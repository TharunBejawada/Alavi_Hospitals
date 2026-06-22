"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlus, FaPen, FaTrash, FaTag, FaFileLines } from "react-icons/fa6";
import { API_URL } from "../../../config";
import { SpecialityLandingPage, Speciality } from "../../../../../core/src/types";

export default function SpecialityPagesList() {
  const [pages, setPages] = useState<SpecialityLandingPage[]>([]);
  const [specialityNames, setSpecialityNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both pages and core specialities in parallel
        const [pagesRes, specRes] = await Promise.all([
          axios.get(`${API_URL}/api/speciality-pages/getAll`),
          axios.get(`${API_URL}/api/specialities/getAllSpecialities`)
        ]);

        setPages(pagesRes.data.Items || []);

        // Create a dictionary of specialityId -> specialityName for quick lookup
        const namesMap: Record<string, string> = {};
        (specRes.data.Items || []).forEach((spec: Speciality) => {
          namesMap[spec.specialityId] = spec.specialityName;
        });
        setSpecialityNames(namesMap);

      } catch (error) {
        toast.error("Failed to load landing pages");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      await axios.delete(`${API_URL}/api/speciality-pages/delete/${id}`);
      toast.success("Page deleted");
      setPages(pages.filter(p => p.pageId !== id));
    } catch (error) {
      toast.error("Error deleting page");
    }
  };

  if (loading) return <div className="p-10 text-center text-[#5B328C] min-h-screen font-bold animate-pulse">Loading pages...</div>;

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#5B328C]">Speciality Landing Pages</h1>
          <Link href="/admin/speciality-pages/add">
            <button className="bg-[#5B328C] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#4a2873] transition-colors flex items-center gap-2">
              <FaPlus /> Create Page
            </button>
          </Link>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaFileLines className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Landing Pages Found</h3>
            <p className="text-gray-500 text-sm">Click "Create Page" to build your first speciality landing page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div 
                key={page.pageId} 
                className="relative w-full rounded-[16px] overflow-hidden shadow-lg group flex flex-col min-h-[340px] transform transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Background Image Layer */}
                <div className="absolute inset-0 bg-gray-200">
                  {page.bannerImage && (
                    <Image 
                      src={page.bannerImage} 
                      alt={page.title} 
                      fill 
                      className="object-cover" 
                    />
                  )}
                </div>

                {/* Overlays */}
                <div 
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(270.39deg, rgba(255, 255, 255, 0) -209.35%, #663399 69.26%)' }}
                ></div>
                <div className="absolute inset-0 bg-[#5B328C]/60"></div>

                {/* Content Layer */}
                <div className="relative p-6 z-10 flex flex-col flex-grow">
                  
                  {/* Top Badge: Mapped Speciality Name */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[11px] font-bold tracking-wider flex items-center gap-2 uppercase">
                      <FaTag className="text-white/80" /> 
                      {specialityNames[page.specialityId] || "Unmapped Speciality"}
                    </div>
                  </div>

                  {/* Page Title */}
                  <h3 className="text-white font-bold text-[22px] tracking-wide mb-3 leading-snug font-['Poppins'] group-hover:text-blue-100 transition-colors">
                    {page.title}
                  </h3>

                  {/* Description Snippet */}
                  <p className="text-white/90 text-[13px] leading-relaxed line-clamp-3 mb-6 flex-grow font-['Poppins']">
                    {page.seoConfig?.metaDescription || "No meta description provided. Edit to add a summary."}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider truncate max-w-[150px]">
                      Manage Page
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/admin/speciality-pages/edit/${page.pageId}`}>
                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#5B328C] flex items-center justify-center transition-all" title="Edit">
                          <FaPen className="text-xs" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(page.pageId)} 
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