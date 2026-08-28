"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaPlus, FaTrash } from "react-icons/fa6";
import { API_URL } from "../../config";
import { HealthPackage, HealthPackageTestGroup, HealthPackageAssessmentItem } from "../../../../core/src/types";

// Cleans up an admin-entered SEO slug so the public /health-packages/[slug]
// route can always resolve it — same convention as the other admin forms.
const sanitizeSlug = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/^\/?(health-packages\/)?/, "")
    .replace(/\/+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyTestGroup = (): HealthPackageTestGroup => ({ id: crypto.randomUUID(), title: "", image: "", tests: [] });
const emptyAssessmentItem = (): HealthPackageAssessmentItem => ({ id: crypto.randomUUID(), icon: "", title: "", description: "" });

export default function HealthPackageForm({ editId = null }: { editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  // Overview card
  const [cardImage, setCardImage] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [diseasesScreened, setDiseasesScreened] = useState("");
  const [testsCountLabel, setTestsCountLabel] = useState("");
  const [recommendedFor, setRecommendedFor] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [priorityOrder, setPriorityOrder] = useState("");

  // Pricing
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");

  // Test groups
  const [testGroups, setTestGroups] = useState<HealthPackageTestGroup[]>([]);

  // Detail hero
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");

  // Who is this for
  const [whoIntro, setWhoIntro] = useState("");
  const [whoList, setWhoList] = useState<string[]>([]);

  const [detailSummary, setDetailSummary] = useState("");

  // Assessment items
  const [assessmentItems, setAssessmentItems] = useState<HealthPackageAssessmentItem[]>([]);

  const [seoConfig, setSeoConfig] = useState({ title: "", url: "", metaDescription: "", metaKeywords: "" });
  const [enabled, setEnabled] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !editId) return;
    const fetchPackage = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/health-packages/getById/${editId}`);
        const p: HealthPackage = res.data.Item;

        setCardImage(p.cardImage || "");
        setCardTitle(p.cardTitle || "");
        setDiseasesScreened(p.diseasesScreened || "");
        setTestsCountLabel(p.testsCountLabel || "");
        setRecommendedFor(p.recommendedFor || "");
        setCardDescription(p.cardDescription || "");
        setPriorityOrder(p.priorityOrder != null ? String(p.priorityOrder) : "");
        setOriginalPrice(p.originalPrice != null ? String(p.originalPrice) : "");
        setDiscountedPrice(p.discountedPrice != null ? String(p.discountedPrice) : "");
        setTestGroups(p.testGroups || []);
        setPageTitle(p.pageTitle || "");
        setPageSubtitle(p.pageSubtitle || "");
        setHeroDescription(p.heroDescription || "");
        setHeroImage(p.heroImage || "");
        setWhoIntro(p.whoIsThisFor?.intro || "");
        setWhoList(p.whoIsThisFor?.list || []);
        setDetailSummary(p.detailSummary || "");
        setAssessmentItems(p.assessmentItems || []);
        setSeoConfig(p.seoConfig || { title: "", url: "", metaDescription: "", metaKeywords: "" });
        setEnabled(p.enabled ?? true);
      } catch (error) {
        toast.error("Failed to load health package.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackage();
  }, [isEditing, editId]);

  // --- Generic image upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${API_URL}/api/health-packages/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      callback(response.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  // --- Test groups ---
  const addTestGroup = () => setTestGroups(prev => [...prev, emptyTestGroup()]);
  const removeTestGroup = (idx: number) => setTestGroups(prev => prev.filter((_, i) => i !== idx));
  const updateTestGroupField = (idx: number, field: "title" | "image", value: string) => {
    setTestGroups(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };
  const addTestToGroup = (idx: number) => {
    setTestGroups(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], tests: [...next[idx].tests, ""] };
      return next;
    });
  };
  const updateTestInGroup = (groupIdx: number, testIdx: number, value: string) => {
    setTestGroups(prev => {
      const next = [...prev];
      const tests = [...next[groupIdx].tests];
      tests[testIdx] = value;
      next[groupIdx] = { ...next[groupIdx], tests };
      return next;
    });
  };
  const removeTestFromGroup = (groupIdx: number, testIdx: number) => {
    setTestGroups(prev => {
      const next = [...prev];
      next[groupIdx] = { ...next[groupIdx], tests: next[groupIdx].tests.filter((_, i) => i !== testIdx) };
      return next;
    });
  };

  // --- Who list (plain strings) ---
  const addWhoItem = () => setWhoList(prev => [...prev, ""]);
  const updateWhoItem = (idx: number, value: string) => setWhoList(prev => prev.map((v, i) => (i === idx ? value : v)));
  const removeWhoItem = (idx: number) => setWhoList(prev => prev.filter((_, i) => i !== idx));

  // --- Assessment items ---
  const addAssessmentItem = () => setAssessmentItems(prev => [...prev, emptyAssessmentItem()]);
  const removeAssessmentItem = (idx: number) => setAssessmentItems(prev => prev.filter((_, i) => i !== idx));
  const updateAssessmentItem = (idx: number, field: "icon" | "title" | "description", value: string) => {
    setAssessmentItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        cardImage,
        cardTitle,
        diseasesScreened,
        testsCountLabel,
        recommendedFor,
        cardDescription,
        priorityOrder: priorityOrder ? Math.abs(Number(priorityOrder)) : 99,
        originalPrice: Number(originalPrice) || 0,
        discountedPrice: Number(discountedPrice) || 0,
        testGroups,
        pageTitle,
        pageSubtitle,
        heroDescription,
        heroImage,
        whoIsThisFor: { intro: whoIntro, list: whoList },
        detailSummary,
        assessmentItems,
        seoConfig: { ...seoConfig, url: sanitizeSlug(seoConfig.url) },
        enabled
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/health-packages/update/${editId}`, payload);
        toast.success("Health package modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/health-packages/add`, payload);
        toast.success("Health package added successfully!");
      }
      router.push("/admin/health-packages");
    } catch (error) {
      toast.error(isEditing ? "Error updating health package" : "Error adding health package");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 min-h-screen">Loading form...</div>;

  const inputClass = "w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300";

  const renderImageUploadBox = (image: string, id: string, onUpload: (url: string) => void, label = "Upload Image") => (
    <div className="flex flex-col items-center gap-4 shrink-0">
      <input type="file" onChange={(e) => handleImageUpload(e, onUpload)} className="hidden" id={id} accept="image/*" />
      <label htmlFor={id} className="cursor-pointer group relative w-40 h-40 rounded-[24px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
        {image ? (
          <Image src={image} alt="Preview" fill className="object-cover" />
        ) : (
          <>
            <FaImage className="text-3xl text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 font-medium">{label}</span>
          </>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm font-bold">Change Image</span>
        </div>
      </label>
    </div>
  );

  const renderStringListSection = (
    heading: string,
    list: string[],
    onAdd: () => void,
    onUpdate: (idx: number, value: string) => void,
    onRemove: (idx: number) => void,
    placeholder: string
  ) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-gray-700">{heading}</label>
        <button type="button" onClick={onAdd} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
          <FaPlus /> Add Item
        </button>
      </div>
      {list.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <input type="text" value={item} onChange={(e) => onUpdate(idx, e.target.value)} placeholder={placeholder} className={inputClass} />
          <button type="button" onClick={() => onRemove(idx)} className="text-red-400 hover:text-red-600 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0">
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">

        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Modify Health Package" : "Add New Health Package"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* SECTION 1: Overview Card */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">1. Overview Card</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {renderImageUploadBox(cardImage, "upload-card-image", setCardImage, "Upload Card Image")}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} placeholder="Card Title (e.g. Essential Health Checkup)" className={`${inputClass} md:col-span-2`} required />
                <input type="text" value={diseasesScreened} onChange={(e) => setDiseasesScreened(e.target.value)} placeholder="Diseases Screened (e.g. 40+ diseases)" className={inputClass} />
                <input type="text" value={testsCountLabel} onChange={(e) => setTestsCountLabel(e.target.value)} placeholder="Tests Count (e.g. 75 Tests)" className={inputClass} />
                <input type="text" value={recommendedFor} onChange={(e) => setRecommendedFor(e.target.value)} placeholder="Recommended For (e.g. Men & Women)" className={inputClass} />
                <input
                  type="number"
                  value={priorityOrder}
                  onChange={(e) => setPriorityOrder(e.target.value)}
                  placeholder="Priority Order (Lower shows first)"
                  className={inputClass}
                  min="1"
                  step="1"
                />
                <textarea value={cardDescription} onChange={(e) => setCardDescription(e.target.value)} placeholder="Card Description" rows={3} className={`${inputClass} md:col-span-2`} />
              </div>
            </div>
          </div>

          {/* SECTION 2: Pricing */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">2. Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Original Price (₹)" className={inputClass} min="0" required />
              <input type="number" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} placeholder="Discounted Price (₹)" className={inputClass} min="0" required />
            </div>
          </div>

          {/* SECTION 3: Test Groups */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">3. Tests Included</h2>
              <button type="button" onClick={addTestGroup} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                <FaPlus /> Add Test Group
              </button>
            </div>
            <div className="space-y-6">
              {testGroups.map((group, gIdx) => (
                <div key={group.id ?? gIdx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeTestGroup(gIdx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FaTrash />
                  </button>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {renderImageUploadBox(group.image || "", `upload-group-${gIdx}`, (url) => updateTestGroupField(gIdx, "image", url), "Upload Photo")}
                    <input
                      type="text"
                      placeholder="Group Title (e.g. General Health)"
                      value={group.title}
                      onChange={(e) => updateTestGroupField(gIdx, "title", e.target.value)}
                      className={`${inputClass} flex-grow h-fit`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-gray-700">Tests</label>
                      <button type="button" onClick={() => addTestToGroup(gIdx)} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
                        <FaPlus /> Add Test
                      </button>
                    </div>
                    {group.tests.map((test, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-3">
                        <input type="text" value={test} onChange={(e) => updateTestInGroup(gIdx, tIdx, e.target.value)} placeholder="e.g. Complete Blood Count (CBC)" className={inputClass} />
                        <button type="button" onClick={() => removeTestFromGroup(gIdx, tIdx)} className="text-red-400 hover:text-red-600 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0">
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Detail Page Hero */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">4. Detail Page Hero</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {renderImageUploadBox(heroImage, "upload-hero-image", setHeroImage, "Upload Hero Image")}
              <div className="flex-grow grid grid-cols-1 gap-5">
                <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Page Title (e.g. Alavi Essential Wellness Profile)" className={inputClass} required />
                <input type="text" value={pageSubtitle} onChange={(e) => setPageSubtitle(e.target.value)} placeholder="Page Subtitle" className={inputClass} />
                <textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} placeholder="Hero Description" rows={3} className={inputClass} />
              </div>
            </div>
          </div>

          {/* SECTION 5: Who Is This Package For */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">5. Who Is This Package For?</h2>
            <input type="text" value={whoIntro} onChange={(e) => setWhoIntro(e.target.value)} placeholder="Intro (e.g. Ideal for adults looking for:)" className={`${inputClass} mb-4`} />
            {renderStringListSection("List Items", whoList, addWhoItem, updateWhoItem, removeWhoItem, "e.g. A focused preventive health assessment")}
          </div>

          {/* SECTION 6: Detail Summary */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">6. Detail Summary</h2>
            <textarea value={detailSummary} onChange={(e) => setDetailSummary(e.target.value)} placeholder="Paragraph shown under the price box on the detail page" rows={3} className={inputClass} />
          </div>

          {/* SECTION 7: What Does It Help Assess */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">7. What Does It Help Assess?</h2>
              <button type="button" onClick={addAssessmentItem} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                <FaPlus /> Add Item
              </button>
            </div>
            <div className="space-y-4">
              {assessmentItems.map((item, idx) => (
                <div key={item.id ?? idx} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeAssessmentItem(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2">
                    <FaTrash />
                  </button>
                  <div className="w-24 h-24 shrink-0 mt-2">
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateAssessmentItem(idx, "icon", url))} className="hidden" id={`upload-assess-${idx}`} accept="image/*" />
                    <label htmlFor={`upload-assess-${idx}`} className="cursor-pointer group/thumb relative w-full h-full rounded-[16px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                      {item.icon ? (
                        <Image src={item.icon} alt={item.title} fill className="object-contain p-2" />
                      ) : (
                        <FaImage className="text-gray-400 text-2xl" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-bold text-center px-1">Upload</span>
                      </div>
                    </label>
                  </div>
                  <div className="flex-grow grid grid-cols-1 gap-4 w-full">
                    <input type="text" placeholder="Title (e.g. Blood Health)" value={item.title} onChange={(e) => updateAssessmentItem(idx, "title", e.target.value)} className={inputClass} />
                    <textarea placeholder="Description..." value={item.description} onChange={(e) => updateAssessmentItem(idx, "description", e.target.value)} className={inputClass} rows={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: SEO */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">8. SEO Settings</h2>
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
                  placeholder="Custom URL Slug (e.g. essential-wellness-profile)"
                  className={inputClass}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Just the slug — no leading/trailing slashes and no &quot;health-packages/&quot; prefix; letters,
                  numbers and hyphens only (auto-cleaned up when you leave the field).
                  {seoConfig.url && (
                    <> Page will load at <span className="font-mono font-semibold">/health-packages/{sanitizeSlug(seoConfig.url)}</span>.</>
                  )}
                </p>
              </div>
              <textarea value={seoConfig.metaDescription} onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })} placeholder="Meta Description" rows={3} className={`${inputClass} md:col-span-2`} />
              <textarea value={seoConfig.metaKeywords} onChange={(e) => setSeoConfig({ ...seoConfig, metaKeywords: e.target.value })} placeholder="Meta Keywords (comma separated)" rows={2} className={`${inputClass} md:col-span-2`} />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Package"}
            </button>
            <button type="button" onClick={() => router.push("/admin/health-packages")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
