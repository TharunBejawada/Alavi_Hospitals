"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPencil, FaPlus, FaPowerOff, FaMagnifyingGlass } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../../config";

export default function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. GET ALL DOCTORS
  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/doctors/getAllDoctors`);
      // The Express backend returns { Items: [...] }
      setDoctors(response.data.Items || []);
    } catch (error) {
      toast.error("Failed to load doctors.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 2. TOGGLE DOCTOR STATUS
  const toggleDoctorStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.put(`${API_URL}/api/doctors/${id}/toggle`, {
        enabled: !currentStatus,
      });
      toast.success(`Doctor ${currentStatus ? "disabled" : "enabled"} successfully.`);
      fetchDoctors(); // Refresh list to get updated status
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  };

  // 3. FILTER DOCTORS BASED ON SEARCH TERM
  const filteredDoctors = doctors.filter((doctor: any) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = doctor.name?.toLowerCase().includes(searchLower);
    const deptMatch = doctor.department?.toLowerCase().includes(searchLower);
    const locMatch = doctor.location?.toLowerCase().includes(searchLower);
    
    return nameMatch || deptMatch || locMatch;
  });

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Search and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h1 className="text-3xl font-bold text-[#5B328C] shrink-0">Manage Doctors</h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, dept, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B328C]/50 focus:ring-2 focus:ring-[#5B328C]/20 transition-all text-sm shadow-sm placeholder-gray-400"
              />
            </div>

            {/* Add Doctor Button */}
            <Link href="/admin/doctors/add" className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 bg-[#5B328C] text-white px-6 py-3 rounded-xl hover:bg-[#4a2873] shadow-md transition-all active:scale-95 whitespace-nowrap text-sm font-semibold">
                <FaPlus /> Add Doctor
              </button>
            </Link>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500 font-medium">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-medium">No doctors found. Add one to get started.</div>
          ) : filteredDoctors.length === 0 ? (
             <div className="p-10 text-center text-gray-500 font-medium">No doctors match your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F6FA] text-[#5B328C] border-b border-gray-100">
                    <th className="p-5 font-semibold whitespace-nowrap">Doctor</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Department</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Location</th>
                    <th className="p-5 font-semibold whitespace-nowrap">Status</th>
                    <th className="p-5 font-semibold text-center whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor: any) => (
                    <tr key={doctor.doctorId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      {/* Name & Designation */}
                      <td className="p-5 flex items-center gap-4 min-w-[250px]">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 relative shrink-0 border border-gray-200">
                          {doctor.image ? (
                            <Image src={doctor.image} alt={doctor.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                          )}
                        </div>
                        <div>
  <p className="font-bold text-gray-900">{doctor.name}</p>
  <p className="text-sm text-gray-500 line-clamp-1" title={doctor.designations?.join(" • ") || doctor.designation}>
    {doctor.designations && doctor.designations.length > 0 
      ? doctor.designations.join(" • ") 
      : doctor.designation || "No Designation Set"}
  </p>
</div>
                      </td>
                      
                      {/* Department */}
                      <td className="p-5 text-gray-600 font-medium whitespace-nowrap">
                        {doctor.department || "-"}
                      </td>
                      
                      {/* Location */}
                      <td className="p-5 text-gray-600 font-medium whitespace-nowrap">
                        {doctor.location || "-"}
                      </td>
                      
                      {/* Status */}
                      <td className="p-5 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${doctor.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {doctor.enabled ? "Active" : "Disabled"}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="p-5 flex justify-center gap-3">
                        <Link href={`/admin/doctors/${doctor.doctorId}/edit`}>
                          <button className="p-2 text-[#5B328C] hover:bg-[#F3E8FF] rounded-lg transition-colors" title="Modify Doctor">
                            <FaPencil className="text-lg" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => toggleDoctorStatus(doctor.doctorId, doctor.enabled)}
                          className={`p-2 rounded-lg transition-colors ${doctor.enabled ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`}
                          title={doctor.enabled ? "Disable Doctor" : "Enable Doctor"}
                        >
                          <FaPowerOff className="text-lg" />
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