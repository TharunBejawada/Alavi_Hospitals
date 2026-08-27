"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";
import SpecialitiesRTE from "./SpecialitiesRTE";
import { VaccineInfo } from "../../../../core/src/types";

export default function VaccineForm({ editId = null }: { editId?: string | null }) {
  const router = useRouter();
  const isEditing = !!editId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priorityOrder, setPriorityOrder] = useState("");
  const [enabled, setEnabled] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !editId) return;
    const fetchVaccine = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/vaccines/getById/${editId}`);
        const v: VaccineInfo = res.data.Item;
        setTitle(v.title || "");
        setDescription(v.description || "");
        setPriorityOrder(v.priorityOrder != null ? String(v.priorityOrder) : "");
        setEnabled(v.enabled ?? true);
      } catch (error) {
        toast.error("Failed to load vaccine.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVaccine();
  }, [isEditing, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        priorityOrder: priorityOrder ? Math.abs(Number(priorityOrder)) : 99,
        enabled
      };

      if (isEditing) {
        await axios.put(`${API_URL}/api/vaccines/update/${editId}`, payload);
        toast.success("Vaccine modified successfully!");
      } else {
        await axios.post(`${API_URL}/api/vaccines/add`, payload);
        toast.success("Vaccine added successfully!");
      }
      router.push("/admin/vaccinations");
    } catch (error) {
      toast.error(isEditing ? "Error updating vaccine" : "Error adding vaccine");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500 min-h-screen">Loading form...</div>;

  const inputClass = "w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-5 py-3.5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300";

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-12 rounded-[32px] shadow-sm border border-gray-100">

        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">
          {isEditing ? "Modify Vaccine" : "Add New Vaccine"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vaccine Title (e.g. Hepatitis B vaccination)"
              className={inputClass}
              required
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

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Description</label>
            <div className="bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#5B328C]/30 transition-all duration-300">
              <SpecialitiesRTE value={description} onChange={setDescription} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            Enabled
          </label>

          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={isSubmitting} className="bg-[#5B328C] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4a2873] active:scale-95 transition-all disabled:opacity-70">
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Vaccine"}
            </button>
            <button type="button" onClick={() => router.push("/admin/vaccinations")} className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
