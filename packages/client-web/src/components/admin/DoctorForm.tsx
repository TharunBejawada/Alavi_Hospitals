"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaImage } from "react-icons/fa6";
import { API_URL } from "../../config";
import DoctorsRTE from "./DoctorsRTE";

export default function DoctorForm({ editId = null }: { editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  // REMOVED 'designation' from here
  const [doctor, setDoctor] = useState({
    name: "", qualification: "", experience: "",
    location: "", department: "", priorityOrder: "", 
    image: "", seoTitle: "", metaDescription: "", metaKeywords: "", url: "",
    enabled: true
  });
  
  const [extraFields, setExtraFields] = useState([{ heading: "", description: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  
  // NEW: Designations is now an array
  const [designations, setDesignations] = useState<string[]>([""]);
  
  const [keyExpertise, setKeyExpertise] = useState<string[]>([""]);
  const [conditionsTreated, setConditionsTreated] = useState<string[]>([""]);
  const [qualificationsList, setQualificationsList] = useState<string[]>([""]);
  const [experienceAchievements, setExperienceAchievements] = useState<string[]>([""]);
  const [memberships, setMemberships] = useState<string[]>([""]);
  const [closingDescription, setClosingDescription] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && editId) {
      const fetchDoctor = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/doctors/getDoctorbyId/${editId}`);
          const data = response.data.Item;
          
          setDoctor({
            name: data.name || "",
            qualification: data.qualification || "",
            experience: data.experience || "",
            location: data.location || "",
            department: data.department || "",
            priorityOrder: data.priorityOrder ?? "",
            image: data.image || "",
            seoTitle: data.seoTitle || "",
            metaDescription: data.metaDescription || "",
            metaKeywords: data.metaKeywords || "",
            url: data.url || "",
            enabled: data.enabled ?? true
          });

          setExtraFields(data.extraFields?.length ? data.extraFields : [{ heading: "", description: "" }]);
          setFaqs(data.faqs?.length ? data.faqs : [{ question: "", answer: "" }]);
          
          // Fallback logic: If they have the new array use it, otherwise wrap the old string in an array
          setDesignations(data.designations?.length ? data.designations : (data.designation ? [data.designation] : [""]));
          
          setKeyExpertise(data.keyExpertise?.length ? data.keyExpertise : [""]);
          setConditionsTreated(data.conditionsTreated?.length ? data.conditionsTreated : [""]);
          setQualificationsList(data.qualificationsList?.length ? data.qualificationsList : [""]);
          setExperienceAchievements(data.experienceAchievements?.length ? data.experienceAchievements : [""]);
          setMemberships(data.memberships?.length ? data.memberships : [""]);
          setClosingDescription(data.closingDescription || "");
          
          if (data.image) setImagePreview(data.image);
        } catch (error) {
          toast.error("Failed to load doctor data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDoctor();
    }
  }, [isEditing, editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${API_URL}/api/doctors/uploadDoctorImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDoctor({ ...doctor, image: response.data.imageUrl });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleDynamicChange = (index: number, field: string, value: string, type: "extra" | "faq") => {
    if (type === "extra") {
      const updated = [...extraFields];
      updated[index] = { ...updated[index], [field]: value };
      setExtraFields(updated);
    } else {
      const updated = [...faqs];
      updated[index] = { ...updated[index], [field]: value };
      setFaqs(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanList = (list: string[]) => list.filter(item => item.trim() !== "");

      const payload = { 
        ...doctor, 
        priorityOrder: doctor.priorityOrder ? Math.abs(Number(doctor.priorityOrder)) : 99,
        extraFields, 
        designations: cleanList(designations), // Saved as an array
        keyExpertise: cleanList(keyExpertise),
        conditionsTreated: cleanList(conditionsTreated),
        qualificationsList: cleanList(qualificationsList),
        experienceAchievements: cleanList(experienceAchievements),
        memberships: cleanList(memberships),
        closingDescription,
        faqs 
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/doctors/updateDoctor/${editId}`, payload);
        toast.success("Doctor modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/doctors/addDoctor`, payload);
        toast.success("Doctor added successfully!");
      }
      router.push("/admin/doctors");
    } catch (error) {
      toast.error(isEditing ? "Error updating doctor" : "Error adding doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 min-h-screen">Loading form...</div>;

  const inputClass = "w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300";

  const renderListSection = (title: string, items: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, placeholder: string) => (
    <div className="mb-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-bold text-gray-700">{title}</label>
        <button type="button" onClick={() => setter([...items, ""])} className="text-[#5B328C] text-sm font-bold flex items-center gap-1 hover:bg-[#F3E8FF] px-3 py-1.5 rounded-lg transition">
          <FaPlus /> Add Line
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 relative group">
            <input 
              type="text" 
              value={item} 
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                setter(newItems);
              }} 
              placeholder={placeholder} 
              className={inputClass} 
            />
            <button 
              type="button" 
              onClick={() => setter(items.filter((_, i) => i !== index))} 
              className="text-red-400 hover:text-red-600 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0"
              title="Remove Line"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">
        
        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Modify Doctor Profile" : "Add New Doctor"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SECTION 1: Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Basic Information</h2>
            <div className="flex flex-col md:flex-row gap-8">
              
              <div className="flex flex-col items-center gap-4 shrink-0">
                <input type="file" onChange={handleImageUpload} className="hidden" id="upload" accept="image/*" />
                <label htmlFor="upload" className="cursor-pointer group relative w-40 h-40 rounded-[24px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <>
                      <FaImage className="text-3xl text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Upload Photo</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-bold">Change Image</span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-grow">
                <input type="text" name="name" value={doctor.name} onChange={handleChange} placeholder="Doctor Name (e.g. Dr. M. Chandra Sekhar)" className={inputClass} required />
                <input type="text" name="department" value={doctor.department} onChange={handleChange} placeholder="Department (e.g. Cardiology)" className={inputClass} required />
                <input type="text" name="qualification" value={doctor.qualification} onChange={handleChange} placeholder="Qualifications Summary (e.g. MBBS, MD)" className={inputClass} required />
                <input type="text" name="experience" value={doctor.experience} onChange={handleChange} placeholder="Experience Summary (e.g. 19 Years)" className={inputClass} />
                <input type="text" name="location" value={doctor.location} onChange={handleChange} placeholder="Location / Branch" className={inputClass} />
                <input type="number" name="priorityOrder" value={doctor.priorityOrder} onChange={handleChange} placeholder="Priority Order (Lower shows first)" className={inputClass} min="1" step="1" />
              </div>
            </div>
          </div>

          {/* SECTION 2: Extra Fields (Dynamic) */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">Profile Sections (Extra Fields)</h2>
              <button type="button" onClick={() => setExtraFields([...extraFields, { heading: "", description: "" }])} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                <FaPlus /> Add Section
              </button>
            </div>
            
            <div className="space-y-6">
              {extraFields.map((field, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => setExtraFields(extraFields.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FaTrash />
                  </button>
                  <input type="text" placeholder="Section Heading (e.g. Area of Expertise)" value={field.heading} onChange={(e) => handleDynamicChange(index, "heading", e.target.value, "extra")} className={`${inputClass} mb-4`} />
                  
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                    <DoctorsRTE value={field.description} onChange={(val: string) => handleDynamicChange(index, "description", val, "extra")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Specific Bullet Points & Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Professional Details (Lists)</h2>
            <div className="space-y-4">
              {/* Added Designations to the top of the list fields */}
              {renderListSection("Designations", designations, setDesignations, "Enter a designation (e.g. Managing Director)")}
              
              {renderListSection("Key Expertise", keyExpertise, setKeyExpertise, "Enter a key expertise (e.g. Advanced Laparoscopy)")}
              {renderListSection("Conditions Treated", conditionsTreated, setConditionsTreated, "Enter a condition treated (e.g. Type 2 Diabetes)")}
              {renderListSection("Detailed Qualifications", qualificationsList, setQualificationsList, "Enter a qualification (e.g. MBBS from Osmania University, 2010)")}
              {renderListSection("Experience & Achievements", experienceAchievements, setExperienceAchievements, "Enter an achievement (e.g. Awarded Best Physician 2021)")}
              {renderListSection("Memberships", memberships, setMemberships, "Enter a membership (e.g. Member of Indian Medical Association)")}
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-4">Bottom Closing Description</label>
                <textarea 
                  value={closingDescription} 
                  onChange={(e) => setClosingDescription(e.target.value)} 
                  placeholder="Enter a small closing statement or philosophy..." 
                  rows={3} 
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: FAQs (Dynamic) */}
          <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
              <button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="text-[#5B328C] font-bold flex items-center gap-2 hover:bg-[#F3E8FF] px-4 py-2 rounded-lg transition">
                <FaPlus /> Add FAQ
              </button>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <FaTrash />
                  </button>
                  <input type="text" placeholder="Question" value={faq.question} onChange={(e) => handleDynamicChange(index, "question", e.target.value, "faq")} className={`${inputClass} mb-4`} />
                  
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                    <DoctorsRTE value={faq.answer} onChange={(val: string) => handleDynamicChange(index, "answer", val, "faq")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: SEO */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">SEO Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="seoTitle" value={doctor.seoTitle} onChange={handleChange} placeholder="SEO Title" className={inputClass} />
              <input type="text" name="url" value={doctor.url} onChange={handleChange} placeholder="Custom URL Slug (e.g. dr-chandra-sekhar)" className={inputClass} />
              <textarea name="metaDescription" value={doctor.metaDescription} onChange={handleChange} placeholder="Meta Description" rows={3} className={`${inputClass} md:col-span-2`} />
              <textarea name="metaKeywords" value={doctor.metaKeywords} onChange={handleChange} placeholder="Meta Keywords (comma separated)" rows={2} className={`${inputClass} md:col-span-2`} />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Doctor"}
            </button>
            <button type="button" onClick={() => router.push("/admin/doctors")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}