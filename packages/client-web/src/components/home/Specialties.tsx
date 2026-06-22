"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCirclePlay } from "react-icons/fa6";

// --- STATIC DATA STRUCTURE (Ready for Dynamic Replacement) ---
const specialtiesData = [
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Comprehensive care for adults with a focus on early diagnosis, prevention, and effective treatment of everyday and long-term health conditions.",
    mainImage: "/specialties/general-medicine-main.png",
    features: [
      { title: "Diabetes &\nHypertension", image: "/specialties/diabetes-feat.png" },
      { title: "Thyroid & Chronic\nConditions", image: "/specialties/thyroid-feat.png" },
      { title: "Fever &\nInfections", image: "/specialties/fever-feat.png" },
    ],
    topProcedures: [
      "Liver & pancreatic disease care",
      "Stomach & gut related treatments",
      "Kidney & bladder disease management",
      "Diabetic foot care (non-healing ulcers)"
    ]
  },
  {
    id: "gynecology",
    name: "Gynecology",
    description: "Expert women's healthcare providing comprehensive services from routine checkups and prenatal care to advanced gynecological surgeries.",
    mainImage: "/specialties/gynecology-main.jpg",
    features: [
      { title: "Maternity\nCare", image: "/specialties/maternity-feat.jpg" },
      { title: "Women's\nWellness", image: "/specialties/wellness-feat.jpg" },
      { title: "Fertility\nSolutions", image: "/specialties/fertility-feat.jpg" },
    ],
    topProcedures: [
      "High-risk pregnancy management",
      "Minimally invasive gynecologic surgery",
      "PCOS and hormonal imbalance treatment",
      "Preventive screenings (Pap smears, Mammograms)"
    ]
  },
  // Add placeholder empty objects for the rest to make the tabs functional
  { id: "paediatrics", name: "Paediatrics", description: "Coming soon...", mainImage: "", features: [], topProcedures: [] },
  { id: "neurology", name: "Neurology", description: "Coming soon...", mainImage: "", features: [], topProcedures: [] },
  { id: "orthopaedics", name: "Orthopaedics", description: "Coming soon...", mainImage: "", features: [], topProcedures: [] },
];

export default function Specialties() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const currentSpecialty = specialtiesData[activeIndex];

  // Navigation Handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? specialtiesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === specialtiesData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-4 lg:py-8 bg-white overflow-hidden">
      <div className="container mx-auto max-w-8xl px-4 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#5B328C] mb-3 font-[Poppins]">
            Our Specialties
          </h2>
          <p className="text-gray-900 font-medium text-lg font-[Poppins]">
            Comprehensive Care for Every Need
          </p>
        </div>

        {/* Top Pill Navigation */}
        <div className="flex items-center gap-3 md:justify-center overflow-x-auto pb-6 hide-scrollbar">
          {specialtiesData.map((spec, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveIndex(idx)}
                className={`cursor-pointer w-52 font-[Poppins] whitespace-nowrap px-6 py-2.5 rounded-full border-2 font-medium text-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-[#0066A9] border-[#0066A9] text-white shadow-md" 
                    : "bg-white border-[#0066A9] text-[#000000] hover:bg-blue-50"
                }`}
              >
                {spec.name}
              </button>
            );
          })}
          
          <Link href="/specialties">
            <button className="cursor-pointer font-[Poppins] whitespace-nowrap px-6 py-2.5 rounded-full border-2 border-[#0066A9] bg-white text-[#0066A9] font-semibold text-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
              View all <FaCirclePlay className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Main Content Card Container */}
        <div className="relative mt-4 font-[Poppins]">
          
          {/* Outer Navigation Arrows (Positioned over the card edges) */}
          <button 
            onClick={handlePrev}
            className="cursor-pointer absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all"
          >
            {/* <FaChevronLeft className="text-sm md:text-lg mr-1" /> */}
            <Image 
                        src="/icons/leftArrow.png"
                        alt="Left Navigation"
                        fill 
                        className="object-cover"
                      />
          </button>

          <button 
            onClick={handleNext}
            className="cursor-pointer absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all"
          >
            {/* <FaChevronRight className="text-sm md:text-lg ml-1" /> */}
            <Image 
                        src="/icons/rightArrow.png"
                        alt="Right Navigation"
                        fill 
                        className="object-cover"
                      />
          </button>

          {/* Gradient Card */}
          <div style={{ background: 'linear-gradient(90deg, #663399 56.94%, #0066A9 116.43%)' }} className="rounded-[32px] md:rounded-[40px] shadow-2xl p-6 lg:p-10 min-h-[450px] flex items-center relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 w-full"
              >
                
                {/* Left Side: Main Image */}
                <div className="w-full lg:w-[35%] shrink-0">
                  <div className="relative w-full aspect-[4/3] lg:aspect-square bg-white/20 rounded-[24px] overflow-hidden">
                    {currentSpecialty.mainImage ? (
                      <Image 
                        src={currentSpecialty.mainImage} 
                        alt={currentSpecialty.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 font-medium">Image Not Available</div>
                    )}
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-[65%] flex flex-col justify-center">
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {currentSpecialty.name}
                  </h3>
                  
                  <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl mb-2">
                    {currentSpecialty.description}
                  </p>
                  <Link href={`/specialties/${currentSpecialty.id}`} className="text-white font-semibold text-sm underline underline-offset-4 mb-8 inline-block hover:text-white/80">
                    Read More...
                  </Link>

                  {/* Features & Procedures Grid */}
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">
                    
                    {/* Small Feature Cards */}
                    <div className="flex gap-4 lg:gap-6">
                      {currentSpecialty.features.map((feat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-3 w-32 md:w-36">
                          <div className="relative w-32 h-36 md:w-36 md:h-40 rounded-2xl overflow-hidden bg-white/20 shrink-0 shadow-sm border border-white/10">
                            {feat.image && (
                              <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                            )}
                          </div>
                          <p className="text-white text-[11px] md:text-xs font-medium leading-snug whitespace-pre-line">
                            {feat.title}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Top Procedures List */}
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-4">Top Procedures</h4>
                      <ul className="space-y-3">
                        {currentSpecialty.topProcedures.map((proc, idx) => (
                          <li key={idx} className="text-white/90 text-sm flex items-start gap-2">
                            <span className="text-white text-[10px] mt-1.5 shrink-0">●</span>
                            <span className="leading-snug">{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex gap-6">
                    <Link href={`/doctors?specialty=${currentSpecialty.id}`}>
                      <button className="cursor-pointer bg-[#FFFFFF] text-[#663399] hover:bg-gray-50 px-8 py-3 rounded-full font-semibold text-lg shadow-md transition-colors">
                        Find a doctor
                      </button>
                    </Link>
                    <Link href={`/specialties/${currentSpecialty.id}`}>
                      <button className="cursor-pointer bg-[#FFFFFF] text-[#663399] hover:bg-gray-50 px-8 py-3 rounded-full font-semibold text-lg shadow-md transition-colors">
                        Explore more
                      </button>
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Hide Scrollbar Style for the Tabs */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}