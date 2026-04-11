"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config";

export default function DoctorListUser() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering States
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors/getAllEnabledDoctors`);
        setDoctors(response.data.Items || []);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Extract Unique Specialties and Locations
  const { specialties, locations } = useMemo(() => {
    const uniqueSpecialties = Array.from(
      new Set(doctors.map((d) => d.department).filter(Boolean))
    ).sort();

    const uniqueLocations = Array.from(
      new Set(
        doctors
          .flatMap((d) => d.location?.split(",").map((l: string) => l.trim()))
          .filter(Boolean)
      )
    ).sort();

    return { specialties: uniqueSpecialties as string[], locations: uniqueLocations as string[] };
  }, [doctors]);

  // Apply Filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSpecialty = selectedSpecialty ? doc.department === selectedSpecialty : true;
      const matchLocation = selectedLocation ? doc.location?.includes(selectedLocation) : true;
      return matchSpecialty && matchLocation;
    });
  }, [doctors, selectedSpecialty, selectedLocation]);

  // --- Framer Motion Animations ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F3E8FF] border-t-[#5B328C] rounded-full animate-spin"></div>
          <p className="text-[#5B328C] font-semibold animate-pulse">Loading Specialists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Solid Background with Image on Top) */}
      <section className="relative w-full bg-[#5B328C] mb-12 pt-10 lg:pt-0 overflow-hidden">
        <div className="container max-w-[1800px] flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-8">
          
          {/* Left Image sitting freely on top of background */}
          <motion.div 
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-[45%] lg:w-[40%] h-[350px] lg:h-[450px] relative shrink-0 self-end"
          >
            <Image 
              src="/hero-doctors.png" // <-- Using your transparent PNG
              alt="Medical Experts" 
              fill 
              className="object-contain object-bottom md:object-left-bottom"
              priority
            />
          </motion.div>

          {/* Right Text Content */}
          <div className="w-full md:w-[50%] text-center md:text-left z-10 py-10 lg:py-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white mb-6 leading-tight"
            >
              Meet the Medical Experts Behind Your Care
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/90 text-base lg:text-lg leading-relaxed max-w-xl mx-auto md:mx-0"
            >
              Our experienced specialists provide compassionate and advanced medical care across multiple specialties.
            </motion.p>
          </div>

        </div>
      </section>

      {/* 2. MAIN LAYOUT (Sidebar + Grid) */}
      <section className="px-4 lg:px-12">
        <div className="container mx-auto max-w-[1400px] flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* SIDEBAR */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[300px] shrink-0 bg-[#F6FBFF] p-6 lg:p-8 h-fit border border-gray-100 rounded-lg"
          >
            {/* Specialties Filter */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-[#5B328C] mb-4">Specialties</h3>
              <input 
                type="text" 
                placeholder="Search Specialties" 
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                // Fixed text color and placeholder visibility
                className="w-full p-2.5 bg-white border border-gray-200 rounded text-sm mb-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5B328C]/50 transition-colors"
              />
              <ul className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <li 
                  onClick={() => setSelectedSpecialty(null)}
                  className={`text-[13px] cursor-pointer transition-colors ${!selectedSpecialty ? "text-[#5B328C] font-bold" : "text-gray-800 hover:text-[#5B328C]"}`}
                >
                  All Specialties
                </li>
                {specialties
                  .filter(s => s.toLowerCase().includes(specialtySearch.toLowerCase()))
                  .map((spec, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`text-[13px] cursor-pointer transition-colors leading-snug ${selectedSpecialty === spec ? "text-[#5B328C] font-bold" : "text-gray-800 hover:text-[#5B328C]"}`}
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="text-lg font-bold text-[#5B328C] mb-4">Location</h3>
              <input 
                type="text" 
                placeholder="Search Location" 
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                // Fixed text color and placeholder visibility
                className="w-full p-2.5 bg-white border border-gray-200 rounded text-sm mb-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5B328C]/50 transition-colors"
              />
              <ul className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <li 
                  onClick={() => setSelectedLocation(null)}
                  className={`text-[13px] cursor-pointer transition-colors ${!selectedLocation ? "text-[#5B328C] font-bold" : "text-gray-800 hover:text-[#5B328C]"}`}
                >
                  All Locations
                </li>
                {locations
                  .filter(l => l.toLowerCase().includes(locationSearch.toLowerCase()))
                  .map((loc, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => setSelectedLocation(loc)}
                    className={`text-[13px] cursor-pointer transition-colors flex items-center gap-2 ${selectedLocation === loc ? "text-[#5B328C] font-bold" : "text-gray-800 hover:text-[#5B328C]"}`}
                  >
                    <span className="font-bold text-lg leading-none mb-1">•</span> {loc}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* DOCTORS GRID */}
          <div className="flex-1 min-w-0">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-gray-500 font-medium">No doctors found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedSpecialty(null); setSelectedLocation(null); }}
                  className="mt-4 text-[#5B328C] font-bold underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div 
                variants={staggerContainer} 
                initial="hidden" 
                animate="show" 
                // Changed from 3 columns to 2 columns on large screens
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8"
              >
                <AnimatePresence>
                  {filteredDoctors.map((doctor: any) => {
                    
                    const designationText = doctor.designations && doctor.designations.length > 0 
                      ? doctor.designations.join(" | ") 
                      : doctor.designation;

                    return (
                      <motion.div 
                        variants={itemFadeUp}
                        key={doctor.doctorId} 
                        layout
                        // Changed background to light blue (#F4F9FF)
                        className="bg-[#FCF9FF] rounded-xl overflow-hidden p-6 flex flex-col group border border-blue-50/50 hover:border-blue-100 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Custom Rounded Image Box */}
                        <div className="w-full bg-[#EAF1FA] rounded-[24px] border-[1.5px] border-[#5B328C] overflow-hidden aspect-square relative mb-5">
                          {doctor.image ? (
                            <Image 
                              src={doctor.image} 
                              alt={doctor.name} 
                              fill 
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Doctor Details */}
                        <div className="flex flex-col flex-1 text-left">
                          <Link href={`/doctors/${doctor.url || doctor.doctorId}`}>
                            <h2 className="text-[19px] font-bold text-[#5B328C] mb-1.5 hover:underline decoration-2 underline-offset-2 break-words">
                              {doctor.name}
                            </h2>
                          </Link>
                          
                          {/* Designations */}
                          <p className="text-[13px] font-medium text-gray-800 leading-snug mb-1.5 break-words line-clamp-2">
                            {designationText}
                          </p>
                          
                          {/* Qualifications */}
                          {doctor.qualification && (
                            <p className="text-[13px] text-gray-800 leading-snug mb-5 break-words line-clamp-2">
                              {doctor.qualification}
                            </p>
                          )}
                          
                          {/* Experience */}
                          {doctor.experience && (
                            <p className="text-[13px] text-gray-800 mb-6 font-medium mt-auto">
                              <span className="text-[#5B328C]">Experience :</span> {doctor.experience}
                            </p>
                          )}

                          {/* Side-by-Side Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-2">
                            <Link href={`/doctors/${doctor.url || doctor.doctorId}`} className="flex-1">
                              <button className="w-full bg-white text-[#5B328C] border border-[#5B328C] hover:bg-[#F3E8FF] font-semibold text-[13px] py-3 px-2 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                                View Profile
                              </button>
                            </Link>
                            <Link href={`/contact?doctor=${encodeURIComponent(doctor.name)}`} className="flex-1">
                              <button className="w-full bg-[#5B328C] text-white hover:bg-[#4a2873] font-semibold text-[13px] py-3 px-2 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                                Book Appointment
                              </button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>
      </section>

      {/* Global Style for Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5B328C; 
        }
      `}} />
    </div>
  );
}