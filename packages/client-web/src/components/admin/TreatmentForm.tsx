"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa6";
import { API_URL } from "../../config";
import SpecialitiesRTE from "./SpecialitiesRTE";
import {
  Speciality,
  SpecialityLandingPage,
  Treatment,
  TreatmentItemType,
  ConditionTreated,
  TreatmentProcedure,
  backfillItemIds
} from "../../../../core/src/types";

type SelectedItem = {
  itemType: TreatmentItemType;
  itemId: string;
  itemTitle: string;
};

export default function TreatmentForm({ editId = null }: { editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [specialityId, setSpecialityId] = useState("");
  const [matchedPage, setMatchedPage] = useState<SpecialityLandingPage | null>(null);
  const [pageLookupState, setPageLookupState] = useState<"idle" | "loading" | "no-page">("idle");

  const [takenItemIds, setTakenItemIds] = useState<Set<string>>(new Set());
  const [treatmentIdByItemId, setTreatmentIdByItemId] = useState<Record<string, string>>({});
  const [originalItemId, setOriginalItemId] = useState<string | null>(null);

  const [selected, setSelected] = useState<SelectedItem | null>(null);

  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [content, setContent] = useState("");
  const [seoConfig, setSeoConfig] = useState({ title: "", url: "", metaDescription: "", metaKeywords: "" });
  const [enabled, setEnabled] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enabled specialities on mount, and if editing, the existing treatment.
  useEffect(() => {
    const init = async () => {
      try {
        const specRes = await axios.get(`${API_URL}/api/specialities/getAllEnabledSpecialities`);
        setSpecialities(specRes.data.Items || []);

        if (isEditing && editId) {
          const res = await axios.get(`${API_URL}/api/treatments/getById/${editId}`);
          const t: Treatment = res.data.Item;

          setTitle(t.title || "");
          setBannerImage(t.bannerImage || "");
          setContent(t.content || "");
          setSeoConfig(t.seoConfig || { title: "", url: "", metaDescription: "", metaKeywords: "" });
          setEnabled(t.enabled ?? true);
          setSelected({ itemType: t.itemType, itemId: t.itemId, itemTitle: t.itemTitle });
          setOriginalItemId(t.itemId);
          setSpecialityId(t.specialityId);
        }
      } catch (error) {
        toast.error("Failed to load form data.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [isEditing, editId]);

  // When the selected speciality changes, fetch its conditions/procedures list
  // and the set of items that already have a treatment mapped.
  useEffect(() => {
    if (!specialityId) {
      setMatchedPage(null);
      setTakenItemIds(new Set());
      setTreatmentIdByItemId({});
      return;
    }

    const fetchSpecialityContext = async () => {
      setPageLookupState("loading");
      try {
        const [pagesRes, treatmentsRes] = await Promise.all([
          axios.get(`${API_URL}/api/speciality-pages/getAll`),
          axios.get(`${API_URL}/api/treatments/getBySpeciality/${specialityId}`)
        ]);

        const page: SpecialityLandingPage | undefined = (pagesRes.data.Items || []).find(
          (p: SpecialityLandingPage) => p.specialityId === specialityId
        );

        if (!page) {
          setMatchedPage(null);
          setPageLookupState("no-page");
          return;
        }

        const backfilledPage: SpecialityLandingPage = {
          ...page,
          conditionsTreated: {
            ...page.conditionsTreated,
            list: backfillItemIds(page.conditionsTreated?.list, `${specialityId}-conditions`)
          },
          treatmentsProcedures: {
            ...page.treatmentsProcedures,
            list: backfillItemIds(page.treatmentsProcedures?.list, `${specialityId}-procedures`)
          }
        };
        setMatchedPage(backfilledPage);
        setPageLookupState("idle");

        const taken = new Set<string>();
        const byItem: Record<string, string> = {};
        (treatmentsRes.data.Items || []).forEach((t: Treatment) => {
          taken.add(t.itemId);
          byItem[t.itemId] = t.treatmentId;
        });
        setTakenItemIds(taken);
        setTreatmentIdByItemId(byItem);
      } catch (error) {
        toast.error("Failed to load speciality's conditions & procedures.");
        setPageLookupState("no-page");
      }
    };

    fetchSpecialityContext();
  }, [specialityId]);

  const handleSelectSpecialityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecialityId(e.target.value);
    setSelected(null);
  };

  const isItemTaken = (itemId: string) => {
    if (takenItemIds.has(itemId)) {
      // Exempt this treatment's own original item when editing.
      if (isEditing && itemId === originalItemId) return false;
      return true;
    }
    return false;
  };

  const pickItem = (itemType: TreatmentItemType, item: ConditionTreated | TreatmentProcedure) => {
    if (!item.id || isItemTaken(item.id)) return;
    const picked: SelectedItem = { itemType, itemId: item.id, itemTitle: item.title };
    setSelected(picked);
    if (!title) setTitle(item.title);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${API_URL}/api/treatments/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBannerImage(response.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Please select a condition or procedure to write this treatment page for.");
      return;
    }
    if (!matchedPage) {
      toast.error("No speciality page found for the selected speciality.");
      return;
    }

    setIsSubmitting(true);
    try {
      const speciality = specialities.find(s => s.specialityId === specialityId);
      const payload = {
        specialityId,
        specialityName: speciality?.specialityName || "",
        itemType: selected.itemType,
        itemId: selected.itemId,
        itemTitle: selected.itemTitle,
        pageId: matchedPage.pageId,
        title,
        bannerImage,
        content,
        seoConfig,
        enabled
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/treatments/update/${editId}`, payload);
        toast.success("Treatment modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/treatments/add`, payload);
        toast.success("Treatment added successfully!");
      }
      router.push("/admin/treatments");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error(error.response.data?.error || "This item already has a treatment page.");
      } else {
        toast.error(isEditing ? "Error updating treatment" : "Error adding treatment");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 min-h-screen">Loading form...</div>;

  const inputClass = "w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300";

  const renderPickerItem = (itemType: TreatmentItemType, item: ConditionTreated | TreatmentProcedure) => {
    const taken = item.id ? isItemTaken(item.id) : false;
    const isSelected = selected?.itemType === itemType && selected?.itemId === item.id;
    return (
      <button
        type="button"
        key={item.id}
        onClick={() => pickItem(itemType, item)}
        disabled={taken}
        className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${
          isSelected
            ? "border-[#5B328C] bg-[#F3E8FF]"
            : taken
            ? "border-transparent bg-gray-100 opacity-60 cursor-not-allowed"
            : "border-transparent bg-[#F8F6FA] hover:border-[#5B328C]/30"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-gray-800">{item.title}</span>
          {taken && (
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full shrink-0">
              Already has a treatment page
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">

        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Modify Treatment Page" : "Add New Treatment Page"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* SECTION 1: Speciality Select */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">1. Select Speciality</h2>
            <select
              value={specialityId}
              onChange={handleSelectSpecialityChange}
              className={inputClass}
              required
            >
              <option value="">-- Select Speciality --</option>
              {specialities.map(s => (
                <option key={s.specialityId} value={s.specialityId}>{s.specialityName}</option>
              ))}
            </select>
          </div>

          {/* SECTION 2: Categorized Picker */}
          {specialityId && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">2. Select a Condition or Procedure</h2>

              {pageLookupState === "loading" && (
                <p className="text-gray-500">Loading conditions & procedures...</p>
              )}

              {pageLookupState === "no-page" && (
                <p className="text-red-600 font-medium bg-red-50 p-4 rounded-xl">
                  No speciality landing page found for this speciality. Please create one first under
                  &quot;Speciality Pages&quot; before adding a treatment.
                </p>
              )}

              {matchedPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-gray-700 mb-3">Conditions</h3>
                    <div className="space-y-2">
                      {(matchedPage.conditionsTreated?.list || []).length === 0 && (
                        <p className="text-gray-400 text-sm">No conditions found for this speciality.</p>
                      )}
                      {(matchedPage.conditionsTreated?.list || []).map(item => renderPickerItem("condition", item))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-700 mb-3">Procedures</h3>
                    <div className="space-y-2">
                      {(matchedPage.treatmentsProcedures?.list || []).length === 0 && (
                        <p className="text-gray-400 text-sm">No procedures found for this speciality.</p>
                      )}
                      {(matchedPage.treatmentsProcedures?.list || []).map(item => renderPickerItem("procedure", item))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: Content + SEO */}
          {selected && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">3. Treatment Content</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <input type="file" onChange={handleImageUpload} className="hidden" id="upload-treatment-banner" accept="image/*" />
                    <label htmlFor="upload-treatment-banner" className="cursor-pointer group relative w-40 h-40 rounded-[24px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                      {bannerImage ? (
                        <Image src={bannerImage} alt="Preview" fill className="object-cover" />
                      ) : (
                        <>
                          <FaImage className="text-3xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 font-medium">Upload Banner</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-bold">Change Image</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex-grow space-y-5">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Treatment Page Title"
                      className={inputClass}
                      required
                    />
                    <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                      <SpecialitiesRTE value={content} onChange={setContent} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">SEO Settings</h2>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    Enabled
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" value={seoConfig.title} onChange={(e) => setSeoConfig({ ...seoConfig, title: e.target.value })} placeholder="SEO Title" className={inputClass} required />
                  <input type="text" value={seoConfig.url} onChange={(e) => setSeoConfig({ ...seoConfig, url: e.target.value })} placeholder="Custom URL Slug (e.g. angioplasty)" className={inputClass} required />
                  <textarea value={seoConfig.metaDescription} onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })} placeholder="Meta Description" rows={3} className={`${inputClass} md:col-span-2`} />
                  <textarea value={seoConfig.metaKeywords} onChange={(e) => setSeoConfig({ ...seoConfig, metaKeywords: e.target.value })} placeholder="Meta Keywords (comma separated)" rows={2} className={`${inputClass} md:col-span-2`} />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6">
            <button type="submit" disabled={isSubmitting || !selected} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Treatment Page"}
            </button>
            <button type="button" onClick={() => router.push("/admin/treatments")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
