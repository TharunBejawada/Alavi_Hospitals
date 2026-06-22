"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage, FaIcons } from "react-icons/fa6";
import { API_URL } from "../../../../../config";
import { Speciality } from "../../../../../../../core/src/types";

export default function SpecialityForm() {
  const router = useRouter();
  const params = useParams();
  const editId = params?.id as string | undefined;
  const isEditing = !!editId;

  const [speciality, setSpeciality] = useState<Partial<Speciality>>({
    specialityName: "",
    description: "",
    icon: "",
    image: "",
    enabled: true,
    priorityOrder: 99
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchSpeciality = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/specialities/getSpecialityById/${editId}`);
          setSpeciality(response.data.Item);
        } catch (error) {
          toast.error("Failed to load speciality data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchSpeciality();
    }
  }, [isEditing, editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSpeciality({ 
      ...speciality, 
      [name]: name === "priorityOrder" ? (value === "" ? "" : Number(value)) : value 
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "icon") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); // Name must match multer upload.single("image")

    try {
      const response = await axios.post(`${API_URL}/api/specialities/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSpeciality((prev) => ({ ...prev, [type]: response.data.imageUrl }));
      toast.success(`${type === "icon" ? "Icon" : "Image"} uploaded!`);
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/api/specialities/updateSpeciality/${editId}`, speciality);
        toast.success("Speciality updated!");
      } else {
        await axios.post(`${API_URL}/api/specialities/addSpeciality`, speciality);
        toast.success("Speciality added!");
      }
      router.push("/admin/specialities");
    } catch (error) {
      toast.error("Error saving speciality");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-[#5B328C] min-h-screen font-bold animate-pulse">Loading form...</div>;

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Modify Speciality" : "Add New Speciality"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-row md:flex-col gap-4 shrink-0">
              
              {/* Icon Upload */}
              <div className="flex flex-col items-center">
                <input type="file" onChange={(e) => handleFileUpload(e, "icon")} className="hidden" id="upload-icon" accept="image/*" />
                <label htmlFor="upload-icon" className="cursor-pointer group relative w-32 h-32 rounded-[20px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                  {speciality.icon ? (
                    <Image src={speciality.icon} alt="Icon Preview" fill className="object-contain p-4" />
                  ) : (
                    <div className="flex flex-col items-center"><FaIcons className="text-2xl text-gray-400 mb-2" /><span className="text-xs text-gray-500 font-medium">Upload Icon</span></div>
                  )}
                </label>
              </div>

              {/* Cover Image Upload */}
              <div className="flex flex-col items-center">
                <input type="file" onChange={(e) => handleFileUpload(e, "image")} className="hidden" id="upload-image" accept="image/*" />
                <label htmlFor="upload-image" className="cursor-pointer group relative w-32 h-32 rounded-[20px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                  {speciality.image ? (
                    <Image src={speciality.image} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center"><FaImage className="text-2xl text-gray-400 mb-2" /><span className="text-xs text-gray-500 font-medium">Upload Image</span></div>
                  )}
                </label>
              </div>

            </div>

            <div className="flex flex-col gap-5 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Speciality Name</label>
                  <input type="text" name="specialityName" value={speciality.specialityName} onChange={handleChange} className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300" required />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Priority Order</label>
                  <input type="number" name="priorityOrder" value={speciality.priorityOrder ?? ""} onChange={handleChange} placeholder="e.g. 1" className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300" />
                  <p className="text-[11px] text-gray-500 mt-1 ml-1 font-medium">Lower numbers appear first on the website. Default is 99.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Short Description</label>
                <textarea name="description" value={speciality.description} onChange={handleChange} rows={5} className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300 resize-none" required />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : "Save Speciality"}
            </button>
            <button type="button" onClick={() => router.push("/admin/specialities")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}