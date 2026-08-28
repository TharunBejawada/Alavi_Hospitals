"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImage } from "react-icons/fa6";
import { API_URL } from "../../config";
import SpecialitiesRTE from "./SpecialitiesRTE";
import { InsurancePartner, InsurancePartnerType } from "../../../../core/src/types";

export default function InsurancePartnerForm({ type, editId = null }: { type?: InsurancePartnerType; editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  const [partnerType, setPartnerType] = useState<InsurancePartnerType>(type || "private");
  const isGovernment = partnerType === "government";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [priorityOrder, setPriorityOrder] = useState("");
  const [enabled, setEnabled] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !editId) return;
    const fetchPartner = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/insurance-partners/getById/${editId}`);
        const p: InsurancePartner = res.data.Item;
        setPartnerType(p.type || "private");
        setTitle(p.title || "");
        setDescription(p.description || "");
        setImage(p.image || "");
        setWebsiteUrl(p.websiteUrl || "");
        setPriorityOrder(p.priorityOrder != null ? String(p.priorityOrder) : "");
        setEnabled(p.enabled ?? true);
      } catch (error) {
        toast.error("Failed to load insurance partner.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartner();
  }, [isEditing, editId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(`${API_URL}/api/insurance-partners/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(response.data.imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        type: partnerType,
        title,
        description: isGovernment ? description : "",
        image,
        websiteUrl,
        priorityOrder: priorityOrder ? Math.abs(Number(priorityOrder)) : 99,
        enabled
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/insurance-partners/update/${editId}`, payload);
        toast.success("Insurance partner modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/insurance-partners/add`, payload);
        toast.success("Insurance partner added successfully!");
      }
      router.push("/admin/insurance");
    } catch (error) {
      toast.error(isEditing ? "Error updating partner" : "Error adding partner");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 min-h-screen">Loading form...</div>;

  const inputClass = "w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300";

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">

        <h1 className="text-3xl font-bold text-[#5B328C] mb-2">
          {isEditing ? "Modify" : "Add New"} {isGovernment ? "Government-Linked" : "Private"} Insurance Partner
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          {isGovernment
            ? "Shown as a highlighted card at the top of the Insurance page's partners section."
            : "Shown as a logo tile in the Insurance page's private partners grid."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <input type="file" onChange={handleImageUpload} className="hidden" id="upload-partner-logo" accept="image/*" />
              <label htmlFor="upload-partner-logo" className="cursor-pointer group relative w-40 h-40 rounded-[24px] overflow-hidden bg-[#F8F6FA] border-2 border-dashed border-[#5B328C]/40 flex flex-col items-center justify-center hover:border-[#5B328C] transition-colors">
                {image ? (
                  <Image src={image} alt="Preview" fill className="object-contain p-4" />
                ) : (
                  <>
                    <FaImage className="text-3xl text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">Upload Logo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-bold">Change Logo</span>
                </div>
              </label>
            </div>

            <div className="flex-grow grid grid-cols-1 gap-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Partner Title (e.g. Oriental Insurance)"
                className={inputClass}
                required
              />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Website URL (optional — links out when the logo is clicked)"
                className={inputClass}
              />
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

          {isGovernment && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Description</label>
              <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
                <SpecialitiesRTE value={description} onChange={setDescription} />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            Enabled
          </label>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Partner"}
            </button>
            <button type="button" onClick={() => router.push("/admin/insurance")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
