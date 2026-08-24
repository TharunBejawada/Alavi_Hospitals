"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaPlus, FaTrash, FaIcons } from "react-icons/fa6";
import { API_URL } from "../../config";
import SpecialitiesRTE from "./SpecialitiesRTE";
import { SecondOpinionTopic, TreatmentInfoItem, FAQ } from "../../../../core/src/types";

type InfoListSection = { title: string; description: string; list: TreatmentInfoItem[] };
const emptyInfoSection = (): InfoListSection => ({ title: "", description: "", list: [] });

// Cleans up an admin-entered SEO slug so the public /second-opinion/[slug]
// route can always resolve it — same convention as the Treatments admin form.
const sanitizeSlug = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/^\/?(second-opinion\/)?/, "")
    .replace(/\/+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function SecondOpinionForm({ editId = null }: { editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  // Basic
  const [title, setTitle] = useState("");
  const [priorityOrder, setPriorityOrder] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroHeading, setHeroHeading] = useState("");

  // Sections
  const [overview, setOverview] = useState({ title: "", description: "", image: "" });
  const [surgeryRecommendation, setSurgeryRecommendation] = useState({ title: "", description: "", listIntro: "", list: [] as string[], note: "" });
  const [risks, setRisks] = useState<InfoListSection>(emptyInfoSection());
  const [ctaText, setCtaText] = useState("");
  const [benefits, setBenefits] = useState({ title: "", description: "", list: [] as string[], note: "" });
  const [steps, setSteps] = useState<TreatmentInfoItem[]>([]);
  const [requestSection, setRequestSection] = useState({ image: "", heading: "", description: "" });
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [seoConfig, setSeoConfig] = useState({ title: "", url: "", metaDescription: "", metaKeywords: "" });
  const [enabled, setEnabled] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !editId) return;
    const fetchTopic = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/second-opinions/getById/${editId}`);
        const t: SecondOpinionTopic = res.data.Item;

        setTitle(t.title || "");
        setPriorityOrder(t.priorityOrder != null ? String(t.priorityOrder) : "");
        setHeroImage(t.heroImage || "");
        setHeroHeading(t.heroHeading || "");
        setOverview(t.overview || { title: "", description: "", image: "" });
        setSurgeryRecommendation(t.surgeryRecommendation || { title: "", description: "", listIntro: "", list: [], note: "" });
        setRisks(t.risks || emptyInfoSection());
        setCtaText(t.ctaText || "");
        setBenefits(t.benefits || { title: "", description: "", list: [], note: "" });
        setSteps(t.steps || []);
        setRequestSection(t.requestSection || { image: "", heading: "", description: "" });
        setFaqs(t.faqs || []);
        setSeoConfig(t.seoConfig || { title: "", url: "", metaDescription: "", metaKeywords: "" });
        setEnabled(t.enabled ?? true);
      } catch (error) {
        toast.error("Failed to load Second Opinion topic.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopic();
  }, [isEditing, editId]);

  // --- Generic image upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${API_URL}/api/second-opinions/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      callback(response.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  // --- Generic list-section helpers (risks / steps use TreatmentInfoItem) ---
  const addInfoItem = (setter: React.Dispatch<React.SetStateAction<InfoListSection>>) => {
    setter(prev => ({ ...prev, list: [...prev.list, { id: crypto.randomUUID(), icon: "", title: "", description: "" }] }));
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

  const addStep = () => setSteps(prev => [...prev, { id: crypto.randomUUID(), title: "", description: "" }]);
  const updateStep = (idx: number, field: string, value: string) => {
    setSteps(prev => {
      const newList = [...prev];
      newList[idx] = { ...newList[idx], [field]: value };
      return newList;
    });
  };
  const removeStep = (idx: number) => setSteps(prev => prev.filter((_, i) => i !== idx));

  // --- Plain string list helpers (surgeryRecommendation.list / benefits.list) ---
  const addStringItem = (setter: React.Dispatch<React.SetStateAction<any>>) =>
    setter((prev: any) => ({ ...prev, list: [...prev.list, ""] }));
  const updateStringItem = (setter: React.Dispatch<React.SetStateAction<any>>, idx: number, value: string) =>
    setter((prev: any) => {
      const newList = [...prev.list];
      newList[idx] = value;
      return { ...prev, list: newList };
    });
  const removeStringItem = (setter: React.Dispatch<React.SetStateAction<any>>, idx: number) =>
    setter((prev: any) => ({ ...prev, list: prev.list.filter((_: string, i: number) => i !== idx) }));

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
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        priorityOrder: priorityOrder ? Math.abs(Number(priorityOrder)) : 99,
        heroImage,
        heroHeading,
        overview,
        surgeryRecommendation,
        risks,
        ctaText,
        benefits,
        steps,
        requestSection,
        faqs,
        seoConfig: { ...seoConfig, url: sanitizeSlug(seoConfig.url) },
        enabled
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/second-opinions/update/${editId}`, payload);
        toast.success("Second Opinion topic modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/second-opinions/add`, payload);
        toast.success("Second Opinion topic added successfully!");
      }
      router.push("/admin/second-opinions");
    } catch (error) {
      toast.error(isEditing ? "Error updating topic" : "Error adding topic");
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

  const renderInfoListSection = (
    heading: string,
    section: InfoListSection,
    setter: React.Dispatch<React.SetStateAction<InfoListSection>>,
    itemLabel: string
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
          <button type="button" onClick={() => addInfoItem(setter)} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
            <FaPlus /> Add {itemLabel}
          </button>
        </div>

        {section.list.map((item, idx) => (
          <div key={item.id ?? idx} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
            <button type="button" onClick={() => removeInfoItem(setter, idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2">
              <FaTrash />
            </button>

            <div className="w-24 h-24 shrink-0 mt-2">
              <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateInfoItem(setter, idx, "icon", url))} className="hidden" id={`upload-${heading}-${idx}`} accept="image/*" />
              <label htmlFor={`upload-${heading}-${idx}`} className="cursor-pointer group/thumb relative w-full h-full rounded-[16px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                {item.icon ? (
                  <Image src={item.icon} alt={item.title} fill className="object-contain p-2" />
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
              <textarea placeholder="Description..." value={item.description} onChange={(e) => updateInfoItem(setter, idx, "description", e.target.value)} className={inputClass} rows={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStringListSection = (
    heading: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<any>>,
    placeholder: string
  ) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-gray-700">List Items</label>
        <button type="button" onClick={() => addStringItem(setter)} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
          <FaPlus /> Add Item
        </button>
      </div>
      {list.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <input type="text" value={item} onChange={(e) => updateStringItem(setter, idx, e.target.value)} placeholder={placeholder} className={inputClass} />
          <button type="button" onClick={() => removeStringItem(setter, idx)} className="text-red-400 hover:text-red-600 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0">
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
          {isEditing ? "Modify Second Opinion Topic" : "Add New Second Opinion Topic"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* SECTION 1: Basic Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">1. Basic Info</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {renderImageUploadBox(heroImage, "upload-hero-image", setHeroImage, "Upload Hero Image")}
              <div className="flex-grow grid grid-cols-1 gap-5">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Topic Name (e.g. Hernia)" className={inputClass} required />
                <textarea value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} placeholder="Hero Headline (e.g. Already advised hernia surgery? Get an expert second opinion before you decide.)" rows={3} className={inputClass} required />
                <input
                  type="number"
                  value={priorityOrder}
                  onChange={(e) => setPriorityOrder(e.target.value)}
                  placeholder="Priority Order (Lower shows first)"
                  className={inputClass}
                  min="1"
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Overview */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">2. Overview (&quot;What is it?&quot;)</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {renderImageUploadBox(overview.image, "upload-overview-image", (url) => setOverview(prev => ({ ...prev, image: url })))}
              <div className="flex-grow space-y-5">
                <input type="text" value={overview.title} onChange={(e) => setOverview(prev => ({ ...prev, title: e.target.value }))} placeholder="Overview Title (e.g. What is a Hernia?)" className={inputClass} />
                <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                  <SpecialitiesRTE value={overview.description} onChange={(val) => setOverview(prev => ({ ...prev, description: val }))} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Surgery Recommendation */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">3. When is Surgery/Treatment Recommended?</h2>
            <div className="grid grid-cols-1 gap-5 mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <input type="text" placeholder="Section Title" value={surgeryRecommendation.title} onChange={(e) => setSurgeryRecommendation(prev => ({ ...prev, title: e.target.value }))} className={inputClass} />
              <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                <SpecialitiesRTE value={surgeryRecommendation.description} onChange={(val) => setSurgeryRecommendation(prev => ({ ...prev, description: val }))} />
              </div>
              <input type="text" placeholder="List Intro (e.g. Surgery may be considered when you experience:)" value={surgeryRecommendation.listIntro} onChange={(e) => setSurgeryRecommendation(prev => ({ ...prev, listIntro: e.target.value }))} className={inputClass} />
            </div>
            {renderStringListSection("Surgery Reasons", surgeryRecommendation.list, setSurgeryRecommendation, "e.g. Persistent or increasing pain")}
            <textarea value={surgeryRecommendation.note} onChange={(e) => setSurgeryRecommendation(prev => ({ ...prev, note: e.target.value }))} placeholder="Closing note (e.g. The decision to undergo surgery should always be based on an individual clinical assessment.)" rows={2} className={`${inputClass} mt-4`} />
          </div>

          {/* SECTION 4: Risks */}
          {renderInfoListSection("4. Risks of Delaying Treatment", risks, setRisks, "Risk")}

          {/* SECTION 5: Mid CTA */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">5. Mid-Page CTA Text</h2>
            <textarea value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="e.g. Get Your Second Medical Opinion with our Specialists" rows={2} className={inputClass} />
          </div>

          {/* SECTION 6: Benefits */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">6. Benefits of Timely Treatment</h2>
            <div className="grid grid-cols-1 gap-5 mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <input type="text" placeholder="Section Title" value={benefits.title} onChange={(e) => setBenefits(prev => ({ ...prev, title: e.target.value }))} className={inputClass} />
              <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                <SpecialitiesRTE value={benefits.description} onChange={(val) => setBenefits(prev => ({ ...prev, description: val }))} />
              </div>
            </div>
            {renderStringListSection("Benefits", benefits.list, setBenefits, "e.g. Relief from pain and discomfort")}
            <textarea value={benefits.note} onChange={(e) => setBenefits(prev => ({ ...prev, note: e.target.value }))} placeholder="Closing note" rows={2} className={`${inputClass} mt-4`} />
          </div>

          {/* SECTION 7: Steps */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">7. Second Opinion Steps</h2>
              <button type="button" onClick={addStep} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                <FaPlus /> Add Step
              </button>
            </div>
            <div className="space-y-6">
              {steps.map((step, idx) => (
                <div key={step.id ?? idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeStep(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FaTrash />
                  </button>
                  <p className="text-xs font-bold text-[#5B328C] mb-3">Step {idx + 1}</p>
                  <input type="text" placeholder="Step Title (e.g. Medical history)" value={step.title} onChange={(e) => updateStep(idx, "title", e.target.value)} className={`${inputClass} mb-4 pr-10`} />
                  <textarea placeholder="Step Description" value={step.description} onChange={(e) => updateStep(idx, "description", e.target.value)} className={inputClass} rows={2} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 8: Request Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">8. &quot;Request a Second Opinion&quot; Section</h2>
            <div className="flex flex-col md:flex-row gap-8">
              {renderImageUploadBox(requestSection.image, "upload-request-image", (url) => setRequestSection(prev => ({ ...prev, image: url })))}
              <div className="flex-grow space-y-5">
                <input type="text" value={requestSection.heading} onChange={(e) => setRequestSection(prev => ({ ...prev, heading: e.target.value }))} placeholder="Heading (e.g. Already advised hernia surgery? Let our specialist review your case.)" className={inputClass} />
                <textarea value={requestSection.description} onChange={(e) => setRequestSection(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" rows={3} className={inputClass} />
              </div>
            </div>
          </div>

          {/* SECTION 9: FAQs */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">9. Frequently Asked Questions</h2>
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

          {/* SECTION 10: SEO */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">10. SEO Settings</h2>
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
                  placeholder="Custom URL Slug (e.g. hernia)"
                  className={inputClass}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Just the slug — no leading/trailing slashes and no &quot;second-opinion/&quot; prefix; letters,
                  numbers and hyphens only (auto-cleaned up when you leave the field).
                  {seoConfig.url && (
                    <> Page will load at <span className="font-mono font-semibold">/second-opinion/{sanitizeSlug(seoConfig.url)}</span>.</>
                  )}
                </p>
              </div>
              <textarea value={seoConfig.metaDescription} onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })} placeholder="Meta Description" rows={3} className={`${inputClass} md:col-span-2`} />
              <textarea value={seoConfig.metaKeywords} onChange={(e) => setSeoConfig({ ...seoConfig, metaKeywords: e.target.value })} placeholder="Meta Keywords (comma separated)" rows={2} className={`${inputClass} md:col-span-2`} />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Topic"}
            </button>
            <button type="button" onClick={() => router.push("/admin/second-opinions")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
