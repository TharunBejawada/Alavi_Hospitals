"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaPen, FaTrash, FaIcons, FaFileLines } from "react-icons/fa6";
import { API_URL } from "../../../config";
import { Speciality } from "../../../../../core/src/types";

export default function SpecialitiesListPage() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSpecialities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/specialities/getAllSpecialities`);
      // Ensure client-side sorting matches backend
      const sorted = (response.data.Items || []).sort((a: Speciality, b: Speciality) => 
        (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99)
      );
      setSpecialities(sorted);
    } catch (error) {
      toast.error("Failed to load specialities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this speciality?")) return;
    try {
      await axios.delete(`${API_URL}/api/specialities/deleteSpeciality/${id}`);
      toast.success("Speciality deleted");
      setSpecialities(specialities.filter(s => s.specialityId !== id));
    } catch (error) {
      toast.error("Error deleting speciality");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_URL}/api/specialities/toggleStatus/${id}`, { enabled: !currentStatus });
      setSpecialities(specialities.map(s => s.specialityId === id ? { ...s, enabled: !currentStatus } : s));
      toast.success(`Speciality ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-10 text-center text-[#5B328C] min-h-screen font-bold animate-pulse">Loading specialities...</div>;

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-[#5B328C]">Manage Specialities</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* NEW: Secondary Cross-Link Button */}
            <Link href="/admin/speciality-pages">
              <button className="bg-white border-2 border-[#5B328C] text-[#5B328C] px-5 py-2.5 rounded-xl font-bold hover:bg-[#F3E8FF] transition-colors flex items-center gap-2">
                <FaFileLines /> Landing Pages
              </button>
            </Link>

            {/* Existing Primary Button */}
            <Link href="/admin/specialities/add">
              <button className="bg-[#5B328C] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-[#4a2873] transition-colors flex items-center gap-2">
                <FaPlus /> Add Speciality
              </button>
            </Link>
          </div>
        </div>

        {specialities.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaIcons className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Specialities Found</h3>
            <p className="text-gray-500 text-sm">Click "Add Speciality" to create your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialities.map((spec) => (
              <div 
                key={spec.specialityId} 
                className="relative w-full rounded-[16px] overflow-hidden shadow-lg group flex flex-col min-h-[340px] transform transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gray-200">
                  {spec.image && (
                    <Image 
                      src={spec.image} 
                      alt={spec.specialityName} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                </div>

                <div 
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(270.39deg, rgba(255, 255, 255, 0) -209.35%, #663399 69.26%)' }}
                ></div>
                <div className="absolute inset-0 bg-[#5B328C]/60"></div>

                <div className="relative p-6 z-10 flex flex-col flex-grow">
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-[60px] h-[60px] rounded-full bg-[#EEF8FF] flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-3">
                      {spec.icon ? (
                        <div className="relative w-full h-full">
                          <Image src={spec.icon} alt="icon" fill className="object-contain" />
                        </div>
                      ) : (
                        <FaIcons className="text-gray-300 text-xl" />
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={() => toggleStatus(spec.specialityId, spec.enabled)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border transition-colors ${
                          spec.enabled 
                            ? 'bg-green-400/20 text-green-300 border-green-400/30 hover:bg-green-400/30' 
                            : 'bg-red-400/20 text-red-300 border-red-400/30 hover:bg-red-400/30'
                        }`}
                      >
                        {spec.enabled ? 'Active' : 'Disabled'}
                      </button>
                      <span className="px-3 py-1 bg-white/10 text-white text-[11px] font-bold rounded-full uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                        Priority: {spec.priorityOrder ?? 99}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-[18px] tracking-wide uppercase mb-3 leading-snug font-['Poppins']">
                    {spec.specialityName}
                  </h3>

                  <p className="text-white/90 text-[13px] leading-relaxed line-clamp-4 mb-6 flex-grow font-['Poppins']">
                    {spec.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                      Manage Entry
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/admin/specialities/edit/${spec.specialityId}`}>
                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5B328C] flex items-center justify-center transition-all" title="Edit">
                          <FaPen className="text-xs" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(spec.specialityId)} 
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all" 
                        title="Delete"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}