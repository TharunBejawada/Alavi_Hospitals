"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Baby,
  User,
  UserRound,
  HeartHandshake,
  Plane,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { API_URL } from "../../config";
import type { VaccineInfo } from "../../../../core/src/types";
import AppointmentPopup from "../../components/AppointmentPopup";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const VACCINES_AVAILABLE_FOR = [
  { icon: "/assets/child-icon.png", title: "Children", subtitle: "(0–18 years)" },
  { icon: "/assets/adult-icon.png", title: "Adults", subtitle: "" },
  { icon: "/assets/senior-icon.png", title: "Senior Citizens", subtitle: "" },
  { icon: "/assets/pregnant-icon.png", title: "Pregnant Women", subtitle: "" },
  { icon: "/assets/travel-icon.png", title: "Travellers", subtitle: "" },
  { icon: "/assets/risk-icon.png", title: "Special Risk Groups", subtitle: "" },
];

const VACCINATION_SERVICES = [
  { title: "Child Immunisation", description: "Age-appropriate vaccinations for children as per recommended immunisation schedules." },
  { title: "Adult Immunisation", description: "Recommended vaccinations for adults based on age, health profile, and individual risk factors." },
  { title: "Travel Vaccination", description: "Vaccination guidance based on your destination, itinerary, and travel requirements." },
  { title: "Flu & seasonal vaccines", description: "Protection against influenza and other vaccine-preventable seasonal infections." },
  { title: "Pre-exposure & post-exposure vaccination", description: "Vaccination support following specific exposures or for individuals at increased risk." },
  { title: "Vaccination certificates", description: "Vaccination documentation and certificates provided as applicable." },
];

export default function VaccinationsPage() {
  const [vaccines, setVaccines] = useState<VaccineInfo[]>([]);
  const [loadingVaccines, setLoadingVaccines] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function fetchVaccines() {
      try {
        const res = await axios.get(`${API_URL}/api/vaccines/getAllEnabled`);
        setVaccines(res.data.Items || []);
      } catch (error) {
        console.error("Failed to fetch vaccines:", error);
      } finally {
        setLoadingVaccines(false);
      }
    }
    fetchVaccines();
  }, []);

  const selectedVaccine = vaccines[selectedIdx];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
<section className="relative w-full min-h-[560px] bg-[#663399] font-['Inter'] flex flex-col lg:block">
  
  {/* Left Image - Bleeds to left edge on desktop, stacks on top for mobile */}
  <div className="w-full h-[280px] lg:absolute lg:top-0 lg:left-0 lg:w-1/2 lg:h-full z-0">
    <img 
      src="/assets/vaccination-hero.png" 
      alt="Child receiving a vaccination" 
      className="w-full h-full object-cover" 
    />
  </div>

  {/* Content Wrapper */}
  <div className="max-w-[1453px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 relative z-10 h-full lg:min-h-[560px]">
    
    {/* Invisible Spacer - Replaces the image in the grid to keep text on the right */}
    <div className="hidden lg:block w-full h-full"></div>

    {/* Right Content */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 lg:px-16 py-14 lg:py-0 flex flex-col justify-center"
    >
      <h1 className="text-[34px] font-bold text-white leading-[138%] mb-3">Vaccination</h1>
      <h2 className="text-[24px] font-semibold text-white leading-[149%] mb-4 max-w-[341px]">
        Protect yourself. Protect your loved ones.
      </h2>
      <p className="text-[16px] font-semibold text-white leading-[149%] mb-8 max-w-[434px]">
        Vaccination is one of the most effective ways to protect against serious and preventable diseases.
      </p>
      
      {/* Buttons */}
      <div className="flex flex-wrap gap-[54px]">
        {/* Call Now */}
        <a 
          href="tel:+919603911911"
          className="w-[153px] h-[39px] flex items-center justify-center border-2 border-white text-white font-semibold rounded-[3px] hover:bg-white/10 transition-colors"
        >
          Call Now
        </a>
        
        {/* Book an Appointment */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="w-[271px] h-[41px] flex items-center justify-center bg-white text-[#663399] font-semibold rounded-[3px] hover:opacity-90 transition-opacity"
        >
          Book an Appointment
        </button>
      </div>
    </motion.div>
  </div>
</section>

      {/* --- 2. VACCINES AVAILABLE FOR --- */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.1 }}
  variants={fadeUp} 
  className="py-16 w-full font-['Inter']"
>
  <div className="max-w-[1453px] mx-auto px-6 lg:px-12 flex flex-col items-center">
    
    {/* Heading */}
    <h2 className="text-[26px] font-semibold text-[#663399] leading-[149%] text-center mb-[27px]">
      Vaccines available for
    </h2>
    
    {/* Inner Card (Matches exact 1274x191 dimensions on Desktop) */}
    <div className="w-full max-w-[1453px] lg:h-[191px] bg-[rgba(245,235,255,0.28)] rounded-[16px] py-8 lg:py-0 flex items-center justify-center px-4 md:px-6">
      
      {/* Items Container with exactly 133px tall dividers on desktop */}
      <div className="flex flex-col lg:flex-row w-full justify-center items-center divide-[#663399]/[0.38] divide-y lg:divide-y-0 lg:divide-x">
        {VACCINES_AVAILABLE_FOR.map((item, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center justify-center gap-2 py-8 lg:py-0 lg:h-[133px] flex-1 min-w-[150px] w-full lg:w-auto"
          >
            {/* Icon - Sized exactly to 66x52 based on CSS */}
            <div className="w-[66px] h-[52px] flex items-center justify-center mb-1">
              <img 
                src={item.icon} 
                alt={`${item.title} icon`}
                className="w-full h-full object-contain" 
              />
            </div>
            
            {/* Text */}
            <p className="text-[16px] font-medium text-[#663399] text-center leading-[149%] whitespace-nowrap">
              {item.title}
              {item.subtitle && (
                <>
                  <br />
                  <span className="text-[16px]">{item.subtitle}</span>
                </>
              )}
            </p>
          </div>
        ))}
      </div>

    </div>
  </div>
</motion.section>

      {/* --- 3. OUR VACCINATION SERVICES --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="py-16 bg-[#F5FBFF]"
      >
        <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-0">
          <h2 className="text-2xl md:text-[26px] font-semibold text-[#663399] text-center mb-10">Our vaccination services</h2>
          <div className="bg-white rounded-[36px] grid grid-cols-1 md:grid-cols-3 shadow-sm overflow-hidden">
            {VACCINATION_SERVICES.map((service, idx) => (
              <div
                key={idx}
                className={`p-8 lg:p-10 ${idx % 3 !== 2 ? "md:border-r" : ""} ${idx < 3 ? "border-b" : ""} border-[rgba(126,87,168,0.91)]/40`}
              >
                <h3 className="text-lg font-semibold text-[#663399] mb-3">{service.title}</h3>
                <p className="text-sm font-medium text-[#0A0013] leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- 4. TYPES OF VACCINES (dynamic) --- */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.1 }}
  variants={fadeUp}
  className="py-20 w-full font-['Inter']"
>
  <div className="max-w-[1453px] mx-auto">
    
    
    <h2 className="text-[26px] font-semibold text-[#663399] leading-[149%] text-center mb-[13px]">
      Types of vaccines
    </h2>
    <p className="text-center text-black text-[18px] font-medium leading-[149%] max-w-[856px] mx-auto mb-[36px]">
      Explore commonly recommended vaccines and learn who may need them and when they are generally advised.
    </p>

    {loadingVaccines ? (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
      </div>
    ) : vaccines.length === 0 ? (
      <div className="text-center py-16 text-gray-500">
        Vaccine information will be available here soon.
      </div>
    ) : (
      
      
      <div className="flex flex-col lg:flex-row justify-center max-w-[1204px] mx-auto gap-[15px]">
        
        {/* Sidebar (Individual Tabs) */}
        <div className="w-full lg:w-[274px] shrink-0 flex flex-col gap-[14px]">
          {vaccines.map((v, idx) => {
            const isActive = idx === selectedIdx;
            return (
              <button
                key={v.vaccineId || idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full h-[45px] px-6 flex items-center text-left text-[18px] leading-[149%] transition-colors ${
                  isActive 
                    ? "bg-[#663399] text-white font-bold" 
                    : "bg-[rgba(231,216,245,0.21)] text-[#663399] font-medium hover:bg-[#663399]/10"
                }`}
              >
                {v.title}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full lg:max-w-[915px] lg:min-h-[462px] bg-[rgba(231,216,245,0.21)] p-8 md:p-10">
          {selectedVaccine && (
            <div
              className="prose max-w-none text-black leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: (selectedVaccine.description || "").replace(/&nbsp;/g, " ") 
              }}
            />
          )}
        </div>
        
      </div>
    )}
  </div>
</motion.section>

      {/* --- 5. BOTTOM CTA --- */}
<section className="relative w-full h-[450px] lg:h-[318px] bg-[#663399] overflow-hidden font-['Inter']">
  
  {/* Background Image */}
  <div className="absolute right-0 top-0 h-full w-full lg:w-[50%]">
    <img 
      src="/assets/vaccination-cta.png" 
      alt="Vaccination vial and syringes" 
      className="w-full h-full object-fit object-right" 
    />
  </div>

  {/* Exact Gradient Overlay from CSS */}
  <div
    className="absolute inset-0 z-0"
    style={{ 
      background: 'linear-gradient(90deg, #663399 52.71%, rgba(102, 51, 153, 0) 80.45%)' 
    }}
  />

  {/* Content Container */}
  <div className="relative z-10 max-w-[1453px] w-full h-full mx-auto flex flex-col justify-center px-6 lg:px-16 py-10 lg:py-0">
    
    <div className="flex flex-col max-w-[741px]">
      <h2 className="text-[26px] font-bold text-white leading-[149%] mb-[13px] max-w-[553px]">
        Walk in or pre-book your vaccination
      </h2>
      
      <p className="text-[21px] font-medium text-white leading-[149%] mb-[13px] max-w-[553px]">
        Planning a vaccination for yourself or your family?
      </p>
      
      <p className="text-[21px] font-medium text-white leading-[149%] mb-[30px]">
        Walk in for available vaccination services or pre-book your appointment for a convenient experience.
      </p>
      
      {/* Buttons Container */}
      <div className="flex flex-wrap gap-[54px]">
        {/* Call Now Button */}
        <a 
          href="tel:+919603911911"
          className="w-[153px] h-[39px] flex items-center justify-center border-2 border-white text-white font-semibold rounded-[3px] hover:bg-white/10 transition-colors"
        >
          Call Now
        </a>
        
        {/* Book an Appointment Button */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="w-[271px] h-[41px] flex items-center justify-center bg-white text-[#663399] font-semibold rounded-[3px] hover:opacity-90 transition-opacity"
        >
          Book an Appointment
        </button>
      </div>
    </div>

  </div>
</section>

      <AppointmentPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
