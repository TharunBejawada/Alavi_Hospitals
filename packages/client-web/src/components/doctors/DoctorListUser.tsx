"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence, hover } from "framer-motion";
import { FaUserDoctor } from "react-icons/fa6";
import { API_URL } from "../../config";
import AppointmentPopup from "../../components/AppointmentPopup";

export default function DoctorListUser() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Filtering States
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
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

  // Apply Multi-Checkbox Filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSpecialty = 
        selectedSpecialties.length === 0 || 
        selectedSpecialties.includes(doc.department);
        
      const matchLocation = 
        selectedLocations.length === 0 || 
        selectedLocations.some(loc => doc.location?.includes(loc));
        
      return matchSpecialty && matchLocation;
    });
  }, [doctors, selectedSpecialties, selectedLocations]);

  // Checkbox Handlers
  const handleSpecialtyChange = (spec: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleLocationChange = (loc: string) => {
    setSelectedLocations(prev => 
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  // --- Framer Motion Animations ---
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
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
    <div className="font-[Poppins] bg-white min-h-screen pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION (Full background, Text Left, Image strictly on Right edge) */}
      <section style={{ background: 'linear-gradient(90deg, #663399 48.69%, #0066A9 111.15%)' }} className="relative w-full mb-12 flex flex-col md:flex-row overflow-hidden min-h-[350px] md:min-h-[450px]">
        
        {/* Left Text Content (Constrained inside container) */}
        <div className="container mx-auto max-w-[1400px] px-4 lg:px-12 flex z-10 relative">
          <div className="w-full flex flex-col justify-center py-12 md:py-20 lg:py-24">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-3xl text-3xl md:text-4xl lg:text-[42px] font-semibold text-white mb-4 leading-tight"
            >
              Meet the Medical Experts Behind Your Care
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/90 text-xl leading-relaxed max-w-xl"
            >
              Our experienced specialists provide compassionate and advanced medical care across multiple specialties.
            </motion.p>
          </div>
        </div>

        {/* Right Image (Bleeding to the right edge with top-left curve) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[45%] h-[300px] md:h-auto z-0"
        >
          {/* The rounded-tl-[120px] recreates the moon-like cutout curve on the top left */}
          <div className="w-full h-full relative overflow-hidden">
            <Image 
              src="/hero-doctors.png" // <-- Replace with your actual hero image
              alt="Medical Experts" 
              fill 
              className="object-contain object-right rounded-tl-[120px] md:rounded-tl-[150px] lg:rounded-tl-[200px]"
              priority
            />
          </div>
        </motion.div>

      </section>

      {/* 2. MAIN LAYOUT (Sidebar + List View Grid) */}
      <section className="px-4 lg:px-12">
        <div className="container mx-auto max-w-[1400px] flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* SIDEBAR (With Checkboxes) */}
          <motion.aside 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[434px] shrink-0 bg-[#F8FAFC] p-6 lg:p-8 h-fit border border-gray-100 rounded-xl"
          >
            {/* Specialties Filter */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-[#663399] mb-4">Specialties</h3>
              <input 
                type="text" 
                placeholder="Search Specialties" 
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded text-xl font-medium mb-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5B328C]/50 transition-colors"
              />
              <ul className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {specialties
                  .filter(s => s.toLowerCase().includes(specialtySearch.toLowerCase()))
                  .map((spec, idx) => (
                  <li key={idx}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedSpecialties.includes(spec)}
                        onChange={() => handleSpecialtyChange(spec)}
                        className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#5B328C] focus:ring-[#5B328C] cursor-pointer accent-[#5B328C]"
                      />
                      <span className={`text-[18px] leading-snug transition-colors ${
                        selectedSpecialties.includes(spec) ? "text-[#5B328C] font-medium" : "text-gray-800 group-hover:text-[#663399]"
                      }`}>
                        {spec}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="text-2xl font-semibold text-[#663399] mb-4">Location</h3>
              <input 
                type="text" 
                placeholder="Search Location" 
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded text-xl font-medium mb-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5B328C]/50 transition-colors"
              />
              <ul className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {locations
                  .filter(l => l.toLowerCase().includes(locationSearch.toLowerCase()))
                  .map((loc, idx) => (
                  <li key={idx}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedLocations.includes(loc)}
                        onChange={() => handleLocationChange(loc)}
                        className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#5B328C] focus:ring-[#5B328C] cursor-pointer accent-[#5B328C]"
                      />
                      <span className={`text-[18px] leading-snug transition-colors ${
                        selectedLocations.includes(loc) ? "text-[#5B328C] font-bold" : "text-gray-800 group-hover:text-[#663399]"
                      }`}>
                        {loc}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* DOCTORS LIST (Single Column Layout) */}
          <div className="flex-1 min-w-0">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-gray-500 font-medium">No doctors found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedSpecialties([]); setSelectedLocations([]); }}
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
                className="flex flex-col gap-6"
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
                        // Group Hover handles the transition from the light card to the dark gradient card
                        className="hover:bg-[linear-gradient(270.11deg,#0066A9_0.09%,#663399_99.91%)] group bg-[#F4F9FF] rounded-[24px] overflow-hidden p-6 flex flex-col md:flex-row gap-12 border border-blue-100 hover:border-transparent hover:shadow-xl transition-all duration-500"
                      >
                        
                        {/* Doctor Image Container (Added Border) */}
                        <div className="w-full md:w-[257px] shrink-0 bg-white rounded-[20px] border-[2px] border-[#5B328C] group-hover:border-white/40 overflow-hidden aspect-[4/5] relative transition-colors duration-500">
                          {doctor.image ? (
                            <Image 
                              src={doctor.image} 
                              alt={doctor.name} 
                              fill 
                              className="object-cover object-top"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                              Alavi Hospitals
                            </div>
                          )}
                        </div>

                        {/* Doctor Details */}
                        <div className="flex flex-col flex-1 py-2 text-left">
                          
                          {/* Department with Icon & Divider Line */}
                          <div className="flex flex-col mb-4">
                            <div className="flex items-center gap-2.5 pb-3">
                              {/* <div className="bg-white p-1.5 rounded-full shrink-0 group-hover:bg-white/20 transition-colors shadow-sm group-hover:shadow-none">
                                <FaUserDoctor className="text-[#0066A9] group-hover:text-white transition-colors" />
                              </div> */}
                              <span className="text-[21px] font-semibold text-[#0066A9] group-hover:text-white transition-colors">
                                {doctor.department}
                              </span>
                            </div>
                            {/* Horizontal Line separating Department and Name */}
                            <hr className="border-t-[1.5px] border-blue-200 group-hover:border-white/30 transition-colors w-full" />
                          </div>

                          {/* Name */}
                          <Link href={`/doctors/${doctor.url || doctor.doctorId}`} className="w-fit">
                            <h2 className="text-[21px] font-bold text-[#663399] group-hover:text-white transition-colors mb-1.5 hover:underline decoration-2 underline-offset-4 break-words">
                              {doctor.name}
                            </h2>
                          </Link>
                          
                          {/* Designations */}
                          <p className="text-[18px] font-normal text-[#000000] group-hover:text-white/90 transition-colors leading-snug mb-3 break-words line-clamp-2">
                            {designationText}
                          </p>
                          
                          {/* Qualifications Badge */}
                          {doctor.qualification && (
                            <div className="mb-4">
                              <span className="inline-block bg-[#0066A9] group-hover:bg-white text-white group-hover:text-[#5B328C] transition-colors text-[18px] font-normal py-1.5 px-3 rounded shadow-sm break-words line-clamp-2">
                                {doctor.qualification}
                              </span>
                            </div>
                          )}
                          
                          {/* Experience */}
                          {doctor.experience && (
                            <p className="text-[18px] font-medium text-[#663399] group-hover:text-white transition-colors mb-6 mt-auto">
                              Experience : {doctor.experience}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-8 mt-auto">
                            <Link href={`/doctors/${doctor.url || doctor.doctorId}`}>
                              <button className="cursor-pointer w-full sm:w-auto bg-transparent text-[#663399] border-[1.5px] border-[#663399] group-hover:text-white group-hover:border-white hover:bg-[#663399]/10 font-medium text-[14px] py-2.5 px-6 rounded transition-colors whitespace-nowrap">
                                View Profile
                              </button>
                            </Link>
                            {/* <Link href={`/contact?doctor=${encodeURIComponent(doctor.name)}`}> */}
                              <button onClick={() => setIsPopupOpen(true)} className="cursor-pointer w-full sm:w-auto bg-[#5B328C] text-white group-hover:bg-white group-hover:text-[#663399] hover:opacity-90 font-medium text-[14px] py-2.5 px-6 rounded transition-colors whitespace-nowrap shadow-sm">
                                Book an Appointment
                              </button>
                            {/* </Link> */}
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
      <AppointmentPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </div>
  );
}