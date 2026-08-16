"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaPlus, FaTrash, FaIcons } from "react-icons/fa6";
import { API_URL } from "../../config";
import SpecialitiesRTE from "./SpecialitiesRTE";
import {
  Speciality,
  SpecialityLandingPage,
  Treatment,
  TreatmentItemType,
  TreatmentInfoItem,
  ConditionTreated,
  TreatmentProcedure,
  FAQ,
  backfillItemIds
} from "../../../../core/src/types";

type SelectedItem = {
  itemType: TreatmentItemType;
  itemId: string;
  itemTitle: string;
};

type InfoListSection = { title: string; description: string; list: TreatmentInfoItem[] };

const emptySection = (): InfoListSection => ({ title: "", description: "", list: [] });

// Cleans up an admin-entered SEO slug so the public /treatments/[slug] route
// can always resolve it: strips a leading slash and any "treatments/"
// prefix (the backend also tolerates these, but keeping the stored value
// already-clean avoids relying on that), strips trailing slashes, lowercases,
// and collapses anything that isn't a letter/number into a single hyphen.
const sanitizeSlug = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/^\/?(treatments\/)?/, "")
    .replace(/\/+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function TreatmentForm({ editId = null }: { editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [specialityId, setSpecialityId] = useState("");
  const [matchedPage, setMatchedPage] = useState<SpecialityLandingPage | null>(null);
  const [pageLookupState, setPageLookupState] = useState<"idle" | "loading" | "no-page">("idle");

  const [takenItemIds, setTakenItemIds] = useState<Set<string>>(new Set());

  const [selected, setSelected] = useState<SelectedItem | null>(null);
  // Similar condition(s)/procedure(s) that should also link to this same treatment page.
  const [additionalSelected, setAdditionalSelected] = useState<SelectedItem[]>([]);
  // When editing, the speciality/mapping picker starts locked (read-only) so a
  // stray click can't silently reassign this page to a different item; the
  // admin must explicitly unlock it to remap.
  const [mappingLocked, setMappingLocked] = useState(false);

  // Hero
  const [badgeLabel, setBadgeLabel] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  // Sections
  const [overview, setOverview] = useState({ title: "", description: "", image: "" });
  const [causes, setCauses] = useState<InfoListSection>(emptySection());
  const [symptoms, setSymptoms] = useState<{ title: string; description: string; list: string[] }>({ title: "", description: "", list: [] });
  const [ctaText, setCtaText] = useState("");
  const [whyChooseHeading, setWhyChooseHeading] = useState("");
  const [diagnosis, setDiagnosis] = useState<InfoListSection>(emptySection());
  const [treatmentOptions, setTreatmentOptions] = useState<InfoListSection>(emptySection());
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [bottomCta, setBottomCta] = useState({ label: "", heading: "", description1: "", description2: "" });

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

          setBadgeLabel(t.badgeLabel || "");
          setTitle(t.title || "");
          setSubtitle(t.subtitle || "");
          setOverview(t.overview || { title: "", description: "", image: "" });
          setCauses(t.causes || emptySection());
          setSymptoms(t.symptoms || { title: "", description: "", list: [] });
          setCtaText(t.ctaText || "");
          setWhyChooseHeading(t.whyChooseHeading || "");
          setDiagnosis(t.diagnosis || emptySection());
          setTreatmentOptions(t.treatmentOptions || emptySection());
          setFaqs(t.faqs || []);
          setBottomCta(t.bottomCta || { label: "", heading: "", description1: "", description2: "" });
          setSeoConfig(t.seoConfig || { title: "", url: "", metaDescription: "", metaKeywords: "" });
          setEnabled(t.enabled ?? true);
          setSelected({ itemType: t.itemType, itemId: t.itemId, itemTitle: t.itemTitle });
          setAdditionalSelected(t.additionalItems || []);
          setSpecialityId(t.specialityId);
          setMappingLocked(true);
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

        // Items already mapped (primary or additional) by some OTHER treatment.
        // This treatment's own record is excluded entirely so its existing
        // mappings never show as "taken" against itself.
        const taken = new Set<string>();
        (treatmentsRes.data.Items || []).forEach((t: Treatment) => {
          if (isEditing && t.treatmentId === editId) return;
          taken.add(t.itemId);
          (t.additionalItems || []).forEach(a => taken.add(a.itemId));
        });
        setTakenItemIds(taken);
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
    setAdditionalSelected([]);
  };

  const isItemTaken = (itemId: string) => takenItemIds.has(itemId);

  const pickItem = (itemType: TreatmentItemType, item: ConditionTreated | TreatmentProcedure) => {
    if (!item.id || isItemTaken(item.id)) return;
    const picked: SelectedItem = { itemType, itemId: item.id, itemTitle: item.title };
    setSelected(picked);
    // An item can't be both the primary mapping and an "also apply to" item.
    setAdditionalSelected(prev => prev.filter(a => a.itemId !== item.id));
    if (!title) setTitle(item.title);
    if (!badgeLabel) setBadgeLabel(item.title);
  };

  const isAdditionalChecked = (itemId: string) => additionalSelected.some(a => a.itemId === itemId);

  const toggleAdditionalItem = (itemType: TreatmentItemType, item: ConditionTreated | TreatmentProcedure) => {
    if (!item.id || item.id === selected?.itemId || isItemTaken(item.id)) return;
    setAdditionalSelected(prev => {
      if (prev.some(a => a.itemId === item.id)) return prev.filter(a => a.itemId !== item.id);
      return [...prev, { itemType, itemId: item.id!, itemTitle: item.title }];
    });
  };

  // --- Generic image upload (banner/icon/etc.) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${API_URL}/api/treatments/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      callback(response.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  // --- Generic list-section helpers (causes / diagnosis / treatmentOptions) ---
  const addInfoItem = (setter: React.Dispatch<React.SetStateAction<InfoListSection>>, emptyItem: TreatmentInfoItem) => {
    setter(prev => ({ ...prev, list: [...prev.list, { id: crypto.randomUUID(), ...emptyItem }] }));
  };
  const updateInfoItem = (setter: React.Dispatch<React.SetStateAction<InfoListSection>>, idx: number, field: string, value: string) => {
    setter(prev => {
      const newList = [...prev.list];
      newList[idx] = { ...newList[idx], [field]: value };
      return { ...prev, list: newList };
    });
  };
  const removeInfoItem = (setter: React.Dispatch<React.SetStateAction<InfoListSection>>, idx: number) => {
    setter(prev => ({ ...prev, list: prev.list.filter((_, i) => i !== idx) }));
  };

  // --- Symptoms (plain string list) ---
  const addSymptom = () => setSymptoms(prev => ({ ...prev, list: [...prev.list, ""] }));
  const updateSymptom = (idx: number, value: string) => setSymptoms(prev => {
    const newList = [...prev.list];
    newList[idx] = value;
    return { ...prev, list: newList };
  });
  const removeSymptom = (idx: number) => setSymptoms(prev => ({ ...prev, list: prev.list.filter((_, i) => i !== idx) }));

  // --- FAQs ---
  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const updateFaq = (idx: number, field: string, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[idx] = { ...newFaqs[idx], [field]: value };
    setFaqs(newFaqs);
  };
  const removeFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));

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
        additionalItems: additionalSelected,
        pageId: matchedPage.pageId,
        badgeLabel,
        title,
        subtitle,
        overview,
        causes,
        symptoms,
        ctaText,
        whyChooseHeading,
        diagnosis,
        treatmentOptions,
        faqs,
        bottomCta,
        seoConfig: { ...seoConfig, url: sanitizeSlug(seoConfig.url) },
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

  // Renders a checkbox row for the "also apply to similar items" picker —
  // any item not already taken by another treatment, and not the primary
  // selection, can be checked to also link to this same treatment page.
  const renderAdditionalPickerItem = (itemType: TreatmentItemType, item: ConditionTreated | TreatmentProcedure) => {
    const isPrimary = !!item.id && selected?.itemId === item.id;
    const taken = item.id ? isItemTaken(item.id) : false;
    const checked = !!item.id && isAdditionalChecked(item.id);
    const disabled = isPrimary || taken;
    return (
      <label
        key={item.id}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${
          checked
            ? "border-[#5B328C] bg-[#F3E8FF] cursor-pointer"
            : disabled
            ? "border-transparent bg-gray-100 opacity-60 cursor-not-allowed"
            : "border-transparent bg-[#F8F6FA] hover:border-[#5B328C]/30 cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={() => toggleAdditionalItem(itemType, item)}
          className="accent-[#5B328C] w-4 h-4 shrink-0"
        />
        <span className="font-medium text-gray-800 flex-1">{item.title}</span>
        {isPrimary && (
          <span className="text-xs font-bold text-[#5B328C] bg-[#F3E8FF] px-2 py-1 rounded-full shrink-0">Primary</span>
        )}
        {!isPrimary && taken && (
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full shrink-0">Already mapped</span>
        )}
      </label>
    );
  };

  // Renders an editable list of {icon/image, title, description} items with add/remove controls.
  const renderInfoListSection = (
    heading: string,
    section: InfoListSection,
    setter: React.Dispatch<React.SetStateAction<InfoListSection>>,
    itemLabel: string,
    thumbField: "icon" | "image"
  ) => (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">{heading}</h2>
      <div className="grid grid-cols-1 gap-5 mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <input type="text" placeholder="Section Title" value={section.title} onChange={(e) => setter(prev => ({ ...prev, title: e.target.value }))} className={inputClass} />
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Section Description</label>
          <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
            <SpecialitiesRTE value={section.description} onChange={(val) => setter(prev => ({ ...prev, description: val }))} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-bold text-gray-700">{itemLabel} List</label>
          <button type="button" onClick={() => addInfoItem(setter, { title: "", description: "", [thumbField]: "" })} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
            <FaPlus /> Add {itemLabel}
          </button>
        </div>

        {section.list.map((item, idx) => (
          <div key={item.id ?? idx} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
            <button type="button" onClick={() => removeInfoItem(setter, idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2">
              <FaTrash />
            </button>

            <div className="w-24 h-24 shrink-0 mt-2">
              <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateInfoItem(setter, idx, thumbField, url))} className="hidden" id={`upload-${heading}-${idx}`} accept="image/*" />
              <label htmlFor={`upload-${heading}-${idx}`} className="cursor-pointer group/thumb relative w-full h-full rounded-[16px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                {item[thumbField] ? (
                  <Image src={item[thumbField] as string} alt={item.title} fill className="object-contain p-2" />
                ) : (
                  <FaIcons className="text-gray-400 text-2xl" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                  <span className="text-white text-[10px] font-bold text-center px-1">Upload</span>
                </div>
              </label>
            </div>

            <div className="flex-grow grid grid-cols-1 gap-4 w-full">
              <input type="text" placeholder={`${itemLabel} Title`} value={item.title} onChange={(e) => updateInfoItem(setter, idx, "title", e.target.value)} className={inputClass} />
              <textarea placeholder="Short Description..." value={item.description} onChange={(e) => updateInfoItem(setter, idx, "description", e.target.value)} className={inputClass} rows={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">

        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Modify Treatment Page" : "Add New Treatment Page"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* SECTIONS 1-2: Speciality + Mapping. Locked (read-only) while
              editing, to prevent an accidental click from silently
              reassigning this page to a different condition/procedure. */}
          {mappingLocked ? (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">1-2. Speciality &amp; Mapping</h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-3">Currently mapped to:</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {selected && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#5B328C]">
                      {selected.itemType === "condition" ? "Condition" : "Procedure"} · {selected.itemTitle}
                    </span>
                  )}
                  {additionalSelected.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#5B328C]">
                      {a.itemType === "condition" ? "Condition" : "Procedure"} · {a.itemTitle}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Changing the speciality or mapped condition/procedure may break existing links to this treatment page. Continue?")) {
                      setMappingLocked(false);
                    }
                  }}
                  className="text-[#5B328C] text-sm font-bold hover:underline"
                >
                  Change Mapping
                </button>
              </div>
            </div>
          ) : (
            <>
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
                    <>
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

                      {selected && (
                        <div className="mt-8">
                          <h3 className="font-bold text-gray-700 mb-1">Also apply to similar items (optional)</h3>
                          <p className="text-xs text-gray-500 mb-4">
                            Check any other condition or procedure that should link to this same treatment page.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              {(matchedPage.conditionsTreated?.list || []).map(item => renderAdditionalPickerItem("condition", item))}
                            </div>
                            <div className="space-y-2">
                              {(matchedPage.treatmentsProcedures?.list || []).map(item => renderAdditionalPickerItem("procedure", item))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* SECTION 3+: Full Page Content */}
          {selected && (
            <>
              {/* Hero */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">3. Hero</h2>
                <div className="grid grid-cols-1 gap-5">
                  <input type="text" value={badgeLabel} onChange={(e) => setBadgeLabel(e.target.value)} placeholder="Badge Label (e.g. Migraine Treatment)" className={inputClass} />
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline (e.g. Find Relief from Migraine with Expert Neurology Care)" className={inputClass} required />
                  <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Supporting line under the headline" rows={2} className={inputClass} />
                </div>
              </div>

              {/* Overview: "What is X?" */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">4. Overview (&quot;What is it?&quot;)</h2>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-4 shrink-0">
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => setOverview(prev => ({ ...prev, image: url })))} className="hidden" id="upload-overview-image" accept="image/*" />
                    <label htmlFor="upload-overview-image" className="cursor-pointer group relative w-40 h-40 rounded-[24px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                      {overview.image ? (
                        <Image src={overview.image} alt="Overview" fill className="object-cover" />
                      ) : (
                        <>
                          <FaImage className="text-3xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 font-medium">Upload Image</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-bold">Change Image</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex-grow space-y-5">
                    <input type="text" value={overview.title} onChange={(e) => setOverview(prev => ({ ...prev, title: e.target.value }))} placeholder="Overview Title (e.g. What is Migraine?)" className={inputClass} />
                    <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                      <SpecialitiesRTE value={overview.description} onChange={(val) => setOverview(prev => ({ ...prev, description: val }))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Causes & Triggers */}
              {renderInfoListSection("5. Causes & Triggers (\"Why Does it Occur?\")", causes, setCauses, "Cause", "icon")}

              {/* Symptoms */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">6. Common Signs & Symptoms</h2>
                <input type="text" value={symptoms.title} onChange={(e) => setSymptoms(prev => ({ ...prev, title: e.target.value }))} placeholder="Section Title (e.g. Common Signs & Symptoms)" className={`${inputClass} mb-4`} />
                <textarea value={symptoms.description} onChange={(e) => setSymptoms(prev => ({ ...prev, description: e.target.value }))} placeholder="Short intro line (e.g. Migraine can cause one or more of the following symptoms:)" rows={2} className={`${inputClass} mb-4`} />
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-700">Symptoms List</label>
                  <button type="button" onClick={addSymptom} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
                    <FaPlus /> Add Symptom
                  </button>
                </div>
                <div className="space-y-3">
                  {symptoms.list.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input type="text" value={item} onChange={(e) => updateSymptom(idx, e.target.value)} placeholder="e.g. Sensitivity to bright light" className={inputClass} />
                      <button type="button" onClick={() => removeSymptom(idx)} className="text-red-400 hover:text-red-600 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mid CTA */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">7. Mid-Page CTA Text</h2>
                <textarea value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Early evaluation can help identify the cause and guide appropriate treatment." rows={2} className={inputClass} />
              </div>

              {/* Why Choose Alavi Heading */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                  7a. &quot;Why Choose Alavi&quot; Heading
                </h2>
                <input
                  type="text"
                  value={whyChooseHeading}
                  onChange={(e) => setWhyChooseHeading(e.target.value)}
                  placeholder="e.g. Expert Neurology Care for Better Migraine Management"
                  className={inputClass}
                />
              </div>

              {/* Diagnosis */}
              {renderInfoListSection("8. Diagnosis Steps (\"How is it Diagnosed?\")", diagnosis, setDiagnosis, "Step", "icon")}

              {/* Treatment Options */}
              {renderInfoListSection("9. Treatment Options", treatmentOptions, setTreatmentOptions, "Option", "image")}

              {/* FAQs */}
              <div>
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">10. Frequently Asked Questions</h2>
                  <button type="button" onClick={addFaq} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                    <FaPlus /> Add FAQ
                  </button>
                </div>
                <div className="space-y-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                      <button type="button" onClick={() => removeFaq(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <FaTrash />
                      </button>
                      <input type="text" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(idx, "question", e.target.value)} className={`${inputClass} mb-4 pr-10`} />
                      <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                        <SpecialitiesRTE value={faq.answer} onChange={(val) => updateFaq(idx, "answer", val)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">11. Bottom CTA (&quot;Book Your Consultation&quot;)</h2>
                <div className="grid grid-cols-1 gap-5">
                  <input type="text" value={bottomCta.label} onChange={(e) => setBottomCta(prev => ({ ...prev, label: e.target.value }))} placeholder="Small Label (e.g. BOOK YOUR CONSULTATION)" className={inputClass} />
                  <input type="text" value={bottomCta.heading} onChange={(e) => setBottomCta(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading (e.g. Take the First Step Towards Better Migraine Management)" className={inputClass} />
                  <textarea value={bottomCta.description1} onChange={(e) => setBottomCta(prev => ({ ...prev, description1: e.target.value }))} placeholder="First paragraph" rows={2} className={inputClass} />
                  <textarea value={bottomCta.description2} onChange={(e) => setBottomCta(prev => ({ ...prev, description2: e.target.value }))} placeholder="Second paragraph" rows={2} className={inputClass} />
                </div>
              </div>

              {/* SEO */}
              <div>
                <div className="flex justify-between items-center mb-6 border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">12. SEO Settings</h2>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                    Enabled
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" value={seoConfig.title} onChange={(e) => setSeoConfig({ ...seoConfig, title: e.target.value })} placeholder="SEO Title" className={inputClass} required />
                  <div>
                    <input
                      type="text"
                      value={seoConfig.url}
                      onChange={(e) => setSeoConfig({ ...seoConfig, url: e.target.value })}
                      onBlur={(e) => setSeoConfig(prev => ({ ...prev, url: sanitizeSlug(e.target.value) }))}
                      placeholder="Custom URL Slug (e.g. migraine-treatment)"
                      className={inputClass}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 ml-1">
                      Just the slug — no leading/trailing slashes and no &quot;treatments/&quot; prefix; letters,
                      numbers and hyphens only (auto-cleaned up when you leave the field).
                      {seoConfig.url && (
                        <> Page will load at <span className="font-mono font-semibold">/treatments/{sanitizeSlug(seoConfig.url)}</span>.</>
                      )}
                    </p>
                  </div>
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
