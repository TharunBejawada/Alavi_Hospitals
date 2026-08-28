"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPencil, FaPlus, FaPowerOff, FaMagnifyingGlass, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../config";
import { HealthPackage } from "../../../../core/src/types";

export default function HealthPackagesList() {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/health-packages/getAll`);
      setPackages(response.data.Items || []);
    } catch (error) {
      toast.error("Failed to load health packages.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_URL}/api/health-packages/${id}/toggle`, { enabled: !currentStatus });
      toast.success(`Package ${currentStatus ? "disabled" : "enabled"} successfully.`);
      fetchPackages();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete the health package "${title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/api/health-packages/delete/${id}`);
      toast.success("Package deleted successfully.");
      fetchPackages();
    } catch (error) {
      toast.error("Failed to delete package.");
      console.error(error);
    }
  };

  const filteredPackages = packages.filter((p) =>
    p.cardTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h1 className="text-3xl font-bold text-[#5B328C] shrink-0">Health Packages</h1>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by package title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B328C]/50 focus:ring-2 focus:ring-[#5B328C]/20 transition-all text-sm shadow-sm placeholder-gray-400"
              />
            </div>

            <Link href="/admin/health-packages/add" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-[#5B328C] text-white px-6 py-3 rounded-xl hover:bg-[#4a2873] shadow-md transition-all active:scale-95 whitespace-nowrap text-sm font-semibold">
                <FaPlus /> Add Package
              </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500 font-medium">Loading packages...</div>
          ) : packages.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-medium">No health packages found. Add one to get started.</div>
          ) : filteredPackages.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-medium">No packages match your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F6FA] text-[#5B328C] border-b border-gray-100">
                    <th className="p-5 font-semibold whitespace-nowrap">Priority</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Image</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Package</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Price</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Status</th>
                    <th className="p-5 font-semibold text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((p) => (
                    <tr key={p.healthPackageId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 text-gray-600 font-medium whitespace-nowrap">{p.priorityOrder ?? 99}</td>
                      <td className="p-5">
                        {p.cardImage ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F8F6FA]">
                            <Image src={p.cardImage} alt={p.cardTitle} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-[#F8F6FA]" />
                        )}
                      </td>
                      <td className="p-5 font-medium text-gray-800">{p.cardTitle}</td>
                      <td className="p-5 text-gray-600 whitespace-nowrap">
                        <span className="line-through text-gray-400 mr-2">₹{p.originalPrice}</span>
                        <span className="font-semibold text-[#5B328C]">₹{p.discountedPrice}</span>
                      </td>
                      <td className="p-5 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {p.enabled ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="p-5 flex justify-center gap-3">
                        <Link href={`/admin/health-packages/${p.healthPackageId}/edit`}>
                          <button className="p-2 text-[#5B328C] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="Modify Package">
                            <FaPencil className="text-lg" />
                          </button>
                        </Link>
                        <button
                          onClick={() => toggleStatus(p.healthPackageId, p.enabled)}
                          className={`p-2 rounded-lg transition-colors ${p.enabled ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                          title={p.enabled ? "Disable Package" : "Enable Package"}
                        >
                          <FaPowerOff className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.healthPackageId, p.cardTitle)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Package"
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
    </div>
  );
}
