"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPencil, FaPlus, FaPowerOff, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../config";
import { InsurancePartner, InsurancePartnerType } from "../../../../core/src/types";

export default function InsurancePartnersList({ type }: { type: InsurancePartnerType }) {
  const [partners, setPartners] = useState<InsurancePartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/insurance-partners/getAll`, { params: { type } });
      setPartners(response.data.Items || []);
    } catch (error) {
      toast.error("Failed to load insurance partners.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_URL}/api/insurance-partners/${id}/toggle`, { enabled: !currentStatus });
      toast.success(`Partner ${currentStatus ? "disabled" : "enabled"} successfully.`);
      fetchPartners();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete the insurance partner "${title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/api/insurance-partners/delete/${id}`);
      toast.success("Partner deleted successfully.");
      fetchPartners();
    } catch (error) {
      toast.error("Failed to delete partner.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link href={`/admin/insurance/partners/add?type=${type}`}>
          <button className="flex items-center justify-center gap-2 bg-[#5B328C] text-white px-6 py-3 rounded-xl hover:bg-[#4a2873] shadow-md transition-all active:scale-95 whitespace-nowrap text-sm font-semibold">
            <FaPlus /> Add {type === "government" ? "Government-Linked" : "Private"} Partner
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium">No partners found. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F6FA] text-[#5B328C] border-b border-gray-100">
                  <th className="p-5 font-semibold whitespace-nowrap">Priority</th>
                  <th className="p-5 font-semibold whitespace-nowrap">Logo</th>
                  <th className="p-5 font-semibold whitespace-nowrap">Title</th>
                  <th className="p-5 font-semibold whitespace-nowrap">Status</th>
                  <th className="p-5 font-semibold text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.partnerId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 text-gray-600 font-medium whitespace-nowrap">{p.priorityOrder ?? 99}</td>
                    <td className="p-5">
                      {p.image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F8F6FA]">
                          <Image src={p.image} alt={p.title} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#F8F6FA]" />
                      )}
                    </td>
                    <td className="p-5 font-medium text-gray-800">{p.title}</td>
                    <td className="p-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-5 flex justify-center gap-3">
                      <Link href={`/admin/insurance/partners/${p.partnerId}/edit`}>
                        <button className="p-2 text-[#5B328C] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="Modify Partner">
                          <FaPencil className="text-lg" />
                        </button>
                      </Link>
                      <button
                        onClick={() => toggleStatus(p.partnerId, p.enabled)}
                        className={`p-2 rounded-lg transition-colors ${p.enabled ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                        title={p.enabled ? "Disable Partner" : "Enable Partner"}
                      >
                        <FaPowerOff className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.partnerId, p.title)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Partner"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
