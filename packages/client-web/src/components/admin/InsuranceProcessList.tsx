"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaPencil, FaPlus, FaPowerOff, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../config";
import { InsuranceProcessInfo } from "../../../../core/src/types";

export default function InsuranceProcessList() {
  const [items, setItems] = useState<InsuranceProcessInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/insurance-process/getAll`);
      setItems(response.data.Items || []);
    } catch (error) {
      toast.error("Failed to load process info.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_URL}/api/insurance-process/${id}/toggle`, { enabled: !currentStatus });
      toast.success(`Tab ${currentStatus ? "disabled" : "enabled"} successfully.`);
      fetchItems();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete the process tab "${title}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_URL}/api/insurance-process/delete/${id}`);
      toast.success("Tab deleted successfully.");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete tab.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link href="/admin/insurance/process/add">
          <button className="flex items-center justify-center gap-2 bg-[#5B328C] text-white px-6 py-3 rounded-xl hover:bg-[#4a2873] shadow-md transition-all active:scale-95 whitespace-nowrap text-sm font-semibold">
            <FaPlus /> Add Tab
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 font-medium">Loading tabs...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-gray-500 font-medium">No process tabs found. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F6FA] text-[#5B328C] border-b border-gray-100">
                  <th className="p-5 font-semibold whitespace-nowrap">Priority</th>
                  <th className="p-5 font-semibold whitespace-nowrap">Tab Title</th>
                  <th className="p-5 font-semibold whitespace-nowrap">Status</th>
                  <th className="p-5 font-semibold text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.processId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 text-gray-600 font-medium whitespace-nowrap">{v.priorityOrder ?? 99}</td>
                    <td className="p-5 font-medium text-gray-800">{v.title}</td>
                    <td className="p-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {v.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-5 flex justify-center gap-3">
                      <Link href={`/admin/insurance/process/${v.processId}/edit`}>
                        <button className="p-2 text-[#5B328C] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="Modify Tab">
                          <FaPencil className="text-lg" />
                        </button>
                      </Link>
                      <button
                        onClick={() => toggleStatus(v.processId, v.enabled)}
                        className={`p-2 rounded-lg transition-colors ${v.enabled ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                        title={v.enabled ? "Disable Tab" : "Enable Tab"}
                      >
                        <FaPowerOff className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.processId, v.title)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Tab"
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
