"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaPlus, FaTrash, FaIcons } from "react-icons/fa6";
import { API_URL } from "../../../../../config";
import { SpecialityLandingPage, Speciality } from "../../../../../../../core/src/types";
import DoctorsRTE from "../../../../../../src/components/admin/SpecialitiesRTE";

export default function SpecialityPageForm() {
  const router = useRouter();
  const params = useParams();
  const editId = params?.id as string | undefined;
  const isEditing = !!editId;

  const [availableSpecialities, setAvailableSpecialities] = useState<Speciality[]>([]);
  // NEW: State to track which specialities already have a landing page
  const [mappedSpecialityIds, setMappedSpecialityIds] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<Partial<SpecialityLandingPage>>({
    specialityId: "",
    title: "",
    description: "",
    bannerImage: "",
    conditionsTreated: { title: "", description: "", list: [] },
    specialityDoctors: { title: "", description: "" },
    treatmentsProcedures: { title: "", description: "", list: [] },
    faqs: [],
    seoConfig: { title: "", url: "", metaDescription: "", metaKeywords: "" },
    enabled: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both Specialities AND existing Speciality Pages in parallel
        const [specRes, pagesRes] = await Promise.all([
          axios.get(`${API_URL}/api/specialities/getAllSpecialities`),
          axios.get(`${API_URL}/api/speciality-pages/getAll`)
        ]);

        setAvailableSpecialities(specRes.data.Items || []);
        
        // Extract the IDs of specialities that are already mapped to a page
        const existingMappedIds = (pagesRes.data.Items || []).map((page: SpecialityLandingPage) => page.specialityId);
        setMappedSpecialityIds(existingMappedIds);

        if (isEditing) {
          const pageRes = await axios.get(`${API_URL}/api/speciality-pages/getById/${editId}`);
          setFormData(pageRes.data.Item);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isEditing, editId]);

  // --- Handlers ---
  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (section: keyof SpecialityLandingPage, field: string, value: string) => {
    setFormData({
      ...formData,
      [section]: { ...(formData[section] as any), [field]: value }
    });
  };

  const handleSEOChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      seoConfig: { ...formData.seoConfig!, [e.target.name]: e.target.value }
    });
  };

  // --- Array Handlers ---
  const addListItem = (section: "conditionsTreated" | "treatmentsProcedures", emptyItem: any) => {
    setFormData({
      ...formData,
      [section]: { 
        ...formData[section]!, 
        list: [...(formData[section]!.list || []), emptyItem] 
      }
    });
  };

  const updateListItem = (section: "conditionsTreated" | "treatmentsProcedures", index: number, field: string, value: string) => {
    const newList = [...formData[section]!.list];
    newList[index] = { ...newList[index], [field]: value };
    setFormData({ ...formData, [section]: { ...formData[section]!, list: newList } });
  };

  const removeListItem = (section: "conditionsTreated" | "treatmentsProcedures", index: number) => {
    const newList = formData[section]!.list.filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: { ...formData[section]!, list: newList } });
  };

  // FAQs Handlers
  const addFaq = () => {
    setFormData({ ...formData, faqs: [...(formData.faqs || []), { question: "", answer: "" }] });
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = [...(formData.faqs || [])];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData({ ...formData, faqs: newFaqs });
  };

  const removeFaq = (index: number) => {
    const newFaqs = (formData.faqs || []).filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: newFaqs });
  };

  // --- File Upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);
    try {
      const res = await axios.post(`${API_URL}/api/specialities/uploadImage`, uploadData);
      callback(res.data.imageUrl);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/speciality-pages/update/${editId}`, formData);
        toast.success("Page modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/speciality-pages/add`, formData);
        toast.success("Page created successfully!");
      }
      router.push("/admin/speciality-pages");
    } catch (error) {
      toast.error("Error saving page");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 min-h-screen">Loading form...</div>;

  const inputClass = "w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300";

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">
        
        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Edit Speciality Landing Page" : "Create Speciality Landing Page"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SECTION 1: Basic Info & Mapping */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Basic Setup</h2>
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Banner Image Upload */}
              <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-1/3">
                <input type="file" onChange={(e) => handleImageUpload(e, (url) => setFormData({...formData, bannerImage: url}))} className="hidden" id="upload-banner" accept="image/*" />
                <label htmlFor="upload-banner" className="cursor-pointer group relative w-full aspect-[16/9] md:aspect-square rounded-[24px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                  {formData.bannerImage ? (
                    <Image src={formData.bannerImage} alt="Banner" fill className="object-cover" />
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

              {/* Text Fields */}
              <div className="grid grid-cols-1 gap-5 flex-grow">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Map to Core Speciality</label>
                  <select 
                    name="specialityId" 
                    value={formData.specialityId} 
                    onChange={handleBasicChange} 
                    className={inputClass} 
                    required
                  >
                    <option value="">-- Select Speciality --</option>
                    {availableSpecialities.map(s => {
                      // Check if it's mapped, BUT exempt the one currently selected if we are editing this specific page
                      const isAlreadyMapped = mappedSpecialityIds.includes(s.specialityId) && (!isEditing || formData.specialityId !== s.specialityId);
                      
                      return (
                        <option 
                          key={s.specialityId} 
                          value={s.specialityId}
                          disabled={isAlreadyMapped}
                          title={isAlreadyMapped ? "A landing page already exists for this speciality" : ""}
                        >
                          {s.specialityName} {isAlreadyMapped ? "(Already Mapped)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Page Title (H1)</label>
                  <input type="text" name="title" value={formData.title} onChange={handleBasicChange} placeholder="e.g. Advanced Cardiology Center" className={inputClass} required />
                </div>
              </div>
            </div>

            {/* Main Description RTE */}
            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Main Banner Description</label>
              <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                <DoctorsRTE 
                  value={formData.description || ""} 
                  onChange={(val: string) => setFormData({...formData, description: val})} 
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Conditions Treated */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Conditions Treated</h2>
            <div className="grid grid-cols-1 gap-5 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <input type="text" placeholder="Section Title (e.g. Conditions We Treat)" value={formData.conditionsTreated?.title || ""} onChange={(e) => handleNestedChange("conditionsTreated", "title", e.target.value)} className={inputClass} />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Section Description</label>
                <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                  <DoctorsRTE 
                    value={formData.conditionsTreated?.description || ""} 
                    onChange={(val: string) => handleNestedChange("conditionsTreated", "description", val)} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">Conditions List</label>
                <button type="button" onClick={() => addListItem("conditionsTreated", { icon: "", title: "", description: "" })} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
                  <FaPlus /> Add Condition
                </button>
              </div>
              
              {formData.conditionsTreated?.list?.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeListItem("conditionsTreated", idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2">
                    <FaTrash />
                  </button>
                  
                  {/* Icon Upload for Condition */}
                  <div className="w-24 h-24 shrink-0 mt-2">
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => updateListItem("conditionsTreated", idx, "icon", url))} className="hidden" id={`upload-icon-${idx}`} accept="image/*" />
                    <label htmlFor={`upload-icon-${idx}`} className="cursor-pointer group/icon relative w-full h-full rounded-[16px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                      {item.icon ? (
                        <Image src={item.icon} alt="Icon" fill className="object-contain p-2" />
                      ) : (
                        <FaIcons className="text-gray-400 text-2xl" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                        <span className="text-white text-[10px] font-bold text-center px-1">Upload<br/>Icon</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex-grow grid grid-cols-1 gap-4 w-full">
                    <input type="text" placeholder="Condition Title (e.g. Arrhythmia)" value={item.title} onChange={(e) => updateListItem("conditionsTreated", idx, "title", e.target.value)} className={inputClass} />
                    <textarea placeholder="Short Description..." value={item.description} onChange={(e) => updateListItem("conditionsTreated", idx, "description", e.target.value)} className={inputClass} rows={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Treatments & Procedures */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Treatments & Procedures</h2>
            <div className="grid grid-cols-1 gap-5 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <input type="text" placeholder="Section Title (e.g. Advanced Procedures)" value={formData.treatmentsProcedures?.title || ""} onChange={(e) => handleNestedChange("treatmentsProcedures", "title", e.target.value)} className={inputClass} />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Section Description</label>
                <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                  <DoctorsRTE 
                    value={formData.treatmentsProcedures?.description || ""} 
                    onChange={(val: string) => handleNestedChange("treatmentsProcedures", "description", val)} 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">Procedures List</label>
                <button type="button" onClick={() => addListItem("treatmentsProcedures", { title: "", description: "" })} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
                  <FaPlus /> Add Procedure
                </button>
              </div>

              {formData.treatmentsProcedures?.list?.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeListItem("treatmentsProcedures", idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2">
                    <FaTrash />
                  </button>
                  <div className="flex-grow grid grid-cols-1 gap-4">
                    <input type="text" placeholder="Treatment Title (e.g. Angioplasty)" value={item.title} onChange={(e) => updateListItem("treatmentsProcedures", idx, "title", e.target.value)} className={`${inputClass} pr-10`} />
                    <textarea placeholder="Description..." value={item.description} onChange={(e) => updateListItem("treatmentsProcedures", idx, "description", e.target.value)} className={inputClass} rows={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Speciality Doctors Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Doctors Section Header</h2>
            <div className="grid grid-cols-1 gap-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <input type="text" placeholder="Section Title (e.g. Meet Our Experts)" value={formData.specialityDoctors?.title || ""} onChange={(e) => handleNestedChange("specialityDoctors", "title", e.target.value)} className={inputClass} />
              <textarea placeholder="Section Subtitle / Description" value={formData.specialityDoctors?.description || ""} onChange={(e) => handleNestedChange("specialityDoctors", "description", e.target.value)} rows={2} className={inputClass} />
              <p className="text-xs text-[#5B328C] font-semibold bg-[#F3E8FF] p-3 rounded-lg border border-[#5B328C]/20">
                Note: The actual doctor profiles will be pulled automatically based on the Speciality mapped at the top of this form.
              </p>
            </div>
          </div>

          {/* SECTION 5: FAQs */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
              <button type="button" onClick={addFaq} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                <FaPlus /> Add FAQ
              </button>
            </div>
            
            <div className="space-y-6">
              {(formData.faqs || []).map((faq, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => removeFaq(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FaTrash />
                  </button>
                  <input type="text" placeholder="Question" value={faq.question} onChange={(e) => updateFaq(index, "question", e.target.value)} className={`${inputClass} mb-4 pr-10`} />
                  
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                    <DoctorsRTE 
                      value={faq.answer} 
                      onChange={(val: string) => updateFaq(index, "answer", val)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: SEO Settings */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">SEO Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <input type="text" name="url" placeholder="URL Slug (e.g. cardiology-department)" value={formData.seoConfig?.url || ""} onChange={handleSEOChange} className={inputClass} required />
              <input type="text" name="title" placeholder="Meta Title" value={formData.seoConfig?.title || ""} onChange={handleSEOChange} className={inputClass} required />
              <textarea name="metaDescription" placeholder="Meta Description" value={formData.seoConfig?.metaDescription || ""} onChange={handleSEOChange} className={`${inputClass} md:col-span-2`} rows={3} />
              <textarea name="metaKeywords" placeholder="Meta Keywords (comma separated)" value={formData.seoConfig?.metaKeywords || ""} onChange={handleSEOChange} className={`${inputClass} md:col-span-2`} rows={2} />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex gap-4 pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Landing Page"}
            </button>
            <button type="button" onClick={() => router.push("/admin/speciality-pages")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}