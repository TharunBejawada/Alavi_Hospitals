"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, ShieldCheck, ClipboardList, Search, UserCheck } from "lucide-react";
import { API_URL } from "../../config";
import type { HealthPackage } from "../../../../core/src/types";
import AppointmentPopup from "../../components/AppointmentPopup";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const WHY_CHOOSE_ITEMS = [
  { icon: "/assets/icon-accurate.png", title: "Accurate & Reliable", description: "Get your health parameters assessed through reliable laboratory testing." },
  { icon: "/assets/icon-comprehensive.png", title: "Comprehensive Screening", description: "Our packages bring together important health tests in one convenient checkup." },
  { icon: "/assets/icon-detection.png", title: "Early Detection", description: "Regular health screening can help identify potential health concerns at an early stage." },
  { icon: "/assets/icon-expert.png", title: "Expert Guidance", description: "Get professional guidance to understand your health results and take the right next steps." },
];

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function PackageCard({ pkg }: { pkg: HealthPackage }) {
  const savedAmount = Math.max(0, (pkg.originalPrice || 0) - (pkg.discountedPrice || 0));
  const savedPercent = pkg.originalPrice ? Math.round((savedAmount / pkg.originalPrice) * 100) : 0;

  return (
    <motion.div 
      variants={fadeUp} 
      className="w-full max-w-[360px] h-[619px] bg-[#F6FBFF] rounded-[24px] shadow-[0px_1px_6.8px_-3px_rgba(0,0,0,0.43)] flex flex-col overflow-hidden"
    >
      {/* Top Banner section */}
      <div className="relative h-[245px] bg-[#663399] p-[24px] flex flex-col text-white shrink-0">
        
        {/* Background Image (Model) */}
        {pkg.cardImage && (
          <div className="absolute right-0 bottom-0 h-[100%] w-[80%] z-0 pointer-events-none">
            <img 
              src={pkg.cardImage} 
              alt={pkg.cardTitle} 
              className="w-full h-full object-contain object-right"
            />
          </div>
        )}
        
        {/* Banner Content */}
        <div className="relative z-10 flex flex-col h-full w-[60%]">
          <h3 className="font-bold text-[14px] uppercase leading-[138%] mb-1">
            {pkg.cardTitle}
          </h3>
          <p className="text-[12px] font-medium leading-[138%] mb-auto">
            Screens {pkg.diseasesScreened}
          </p>

          <div className="flex flex-col mt-[12px] mb-[8px]">
            <span className="text-[10px] line-through opacity-80 leading-[138%]">
              {formatCurrency(pkg.originalPrice)}
            </span>
            <span className="text-[28px] font-bold leading-[1] mt-[-2px]">
              {formatCurrency(pkg.discountedPrice)}
            </span>
          </div>

          {savedAmount > 0 ? (
            <div className="bg-[#7E57A8] rounded-[3px] w-[93px] h-[23px] flex items-center justify-center mb-[10px]">
              <span className="text-[9px] font-medium text-white">
                Save {formatCurrency(savedAmount)} ({savedPercent}%)
              </span>
            </div>
          ) : (
            <div className="h-[23px] mb-[10px]" /> /* Spacer if no discount */
          )}

          <p className="text-[12px] font-extrabold leading-[138%] mb-1">
            {pkg.testsCountLabel}
          </p>
          {pkg.recommendedFor && (
            <p className="text-[10px] font-medium leading-[138%]">
              Recommended for:<br />
              <span className="font-bold text-[11px]">{pkg.recommendedFor}</span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="px-[24px] pt-[20px] pb-[24px] flex-1 flex flex-col min-h-0">
        
        {/* Description */}
        <p className="text-[11px] font-medium text-[#000407] leading-[1.6] mb-[12px] line-clamp-3">
          {pkg.cardDescription}
        </p>

        {/* Tests Included Header */}
        <div className="mb-[12px]">
           <span className="text-[10px] font-bold text-[#663399] border-b-[1.5px] border-[#663399] pb-[1px]">
             Tests Included
           </span>
        </div>

        {/* Scrollable Test List */}
        <div className="flex-1 overflow-y-auto pr-3 space-y-[12px] mb-[20px] [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#7E57A8] [&::-webkit-scrollbar-thumb]:rounded-full">
          {(pkg.testGroups || []).map((group, idx) => (
            <div key={group.id ?? idx}>
              <p className="text-[10px] font-bold text-[#663399] leading-[145%] mb-[4px]">
                {group.title}
              </p>
              <ul className="text-[9px] font-medium text-[#000407] leading-[190%] flex flex-col">
                {group.tests.map((test, tIdx) => (
                  <li key={tIdx} className="flex items-start">
                    <span className="mr-[4px]">•</span> 
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-[19px] mt-auto shrink-0">
          <a href="tel:+919603911911" className="block">
            <button className="w-[124px] h-[35px] bg-[#663399] rounded-[6px] text-white font-['Poppins'] font-semibold text-[14px] flex items-center justify-center hover:opacity-90 transition-opacity">
              Book Now
            </button>
          </a>
          <Link href={`/health-packages/${pkg.seoConfig?.url}`} className="block">
            <button className="w-[124px] h-[35px] border border-[#663399] rounded-[6px] text-black font-['Poppins'] font-semibold text-[14px] flex items-center justify-center hover:bg-[#F3E8FF] transition-colors">
              Know More
            </button>
          </Link>
        </div>
        
      </div>
    </motion.div>
  );
}

export default function HealthPackagesPage() {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await axios.get(`${API_URL}/api/health-packages/getAllEnabled`);
        setPackages(res.data.Items || []);
      } catch (error) {
        console.error("Failed to fetch health packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
<section className="relative w-full h-[500px] lg:h-[460px] flex items-center overflow-hidden bg-[#663399] font-['Inter']">
  
  {/* Background Banner Image */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/assets/health-packages-hero.png" 
      alt="Family choosing preventive health checkups" 
      className="w-full h-full object-cover md:object-right object-center" 
    />
  </div>

  {/* Content Container */}
  <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 relative z-10">
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.6 }}
      className="flex flex-col"
    >
      <h1 className="text-[32px] md:text-[40px] font-bold text-white leading-[138%] uppercase max-w-[411px] mb-[16px]">
        PREVENTIVE HEALTH CHECKUPS
      </h1>
      
      <p className="text-[16px] md:text-[18px] font-medium text-white leading-[148%] max-w-[563px] mb-[27px]">
        Choose from our range of carefully designed health packages for routine health monitoring, early detection and better preventive care.
      </p>
      
      {/* Buttons */}
      <div className="flex flex-wrap gap-[32px]">
        
        {/* Book your Test Button */}
        <button
          onClick={() => setIsPopupOpen(true)}
          className="w-[198px] h-[45px] bg-[#663399] flex items-center justify-center gap-2 rounded-[9px] shadow-[3px_0px_7.6px_1px_rgba(75,31,126,0.9)] text-white font-['Poppins'] font-semibold text-[18px] hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Book your Test
        </button>

        {/* Call Now Button */}
        <a href="tel:+919603911911" className="inline-block">
          <button className="w-[154px] h-[45px] bg-[#663399] flex items-center justify-center gap-2 rounded-[9px] shadow-[3px_0px_7.6px_1px_rgba(75,31,126,0.9)] text-white font-['Poppins'] font-semibold text-[18px] hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"></path>
            </svg>
            Call Now
          </button>
        </a>
        
      </div>
    </motion.div>
  </div>
</section>

      {/* --- 2. OUR HEALTH PACKAGES --- */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.05 }}
  variants={fadeUp}
  className="py-16 max-w-[1300px] w-full mx-auto px-6 lg:px-12 font-['Inter']"
>
  <h2 className="text-[26px] md:text-[32px] font-bold text-[#663399] text-center mb-12">
    Our Health Packages
  </h2>

  {loadingPackages ? (
    <div className="flex justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
    </div>
  ) : packages.length === 0 ? (
    <div className="text-center py-16 text-gray-500">
      Health packages will be available here soon.
    </div>
  ) : (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
    >
      {packages.map((pkg) => (
        <PackageCard key={pkg.healthPackageId} pkg={pkg} />
      ))}
    </motion.div>
  )}
</motion.section>

      {/* --- 3. WHY CHOOSE ALAVI HEALTH PACKAGES --- */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.1 }}
  variants={fadeUp}
  className="py-16 bg-white font-['Inter']"
>
  <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12">
    
    {/* Heading */}
    <h2 className="text-[26px] font-bold text-[#663399] leading-[138%] text-center mb-[48px]">
      Why Choose Alavi Health Packages?
    </h2>
    
    {/* Items Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] lg:gap-8 justify-items-center">
      {WHY_CHOOSE_ITEMS.map((item, idx) => {
        // Alternates the circle background color (Purple / Blue) based on the reference image
        const circleBg = idx % 2 === 0 ? "bg-[#E7DEF0]" : "bg-[#E4F5FD]";

        return (
          <div key={idx} className="flex flex-col items-center text-center">
            
            {/* 100x100 Icon Container */}
            <div className={`w-[100px] h-[100px] rounded-full flex items-center justify-center mb-[21px] ${circleBg}`}>
              {/* Using img tag since you have the icons as PNGs */}
              <img 
                src={item.icon} 
                alt={`${item.title} icon`} 
                className="w-[45px] h-[45px] object-contain" 
              />
            </div>
            
            {/* Item Title */}
            <h3 className="text-[18px] font-semibold text-[#663399] leading-[148%] mb-[9px]">
              {item.title}
            </h3>
            
            {/* Item Description */}
            <p className="text-[13px] font-medium text-black leading-[148%] max-w-[215px]">
              {item.description}
            </p>
            
          </div>
        );
      })}
    </div>
    
  </div>
</motion.section>

      {/* --- 4. BOTTOM CTA --- */}
<section className="py-16 bg-[#663399]">
  <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
    <div>
      <h2 className="text-2xl font-bold text-white mb-3 max-w-[560px]">
        Your health is your greatest wealth. Don&rsquo;t wait for symptoms to take action.
      </h2>
      <p className="text-white/90 text-lg max-w-[560px]">
        Book your health checkup at <span className="font-bold">Alavi Hospitals</span> and make preventive healthcare a part of your routine.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-4 shrink-0">
      
      {/* Call Now Button */}
      <a href="tel:+919603911911" className="inline-block">
        <button className="flex items-center justify-center gap-2 whitespace-nowrap border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"></path>
          </svg>
          Call Now
        </button>
      </a>

      {/* Book your Test Button */}
      <button
        onClick={() => setIsPopupOpen(true)}
        className="flex items-center justify-center gap-2 whitespace-nowrap border-2 border-white bg-[#663399] text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
      >
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Book your Test Now
      </button>

    </div>
  </div>
</section>

      <AppointmentPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
