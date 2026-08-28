"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, Phone } from "lucide-react";
import { API_URL } from "../../config";
import type { HealthPackage } from "../../../../core/src/types";
import HealthPackageBookingModal from "./HealthPackageBookingModal";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function HealthPackageDetailClient({ healthPackage }: { healthPackage: HealthPackage }) {
  const router = useRouter();
  const pkg = healthPackage;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const savedAmount = Math.max(0, (pkg.originalPrice || 0) - (pkg.discountedPrice || 0));
  const savedPercent = pkg.originalPrice ? Math.round((savedAmount / pkg.originalPrice) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name,
        mobile,
        email,
        speciality: pkg.pageTitle,
        date: preferredDate,
        message: preferredTime ? `Preferred Time: ${preferredTime}` : "",
        page: `Health Package - ${pkg.pageTitle}`
      });

      const query = new URLSearchParams({ name, mobile, department: pkg.pageTitle, date: preferredDate }).toString();
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit appointment request:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Poppins'] min-h-screen bg-white pb-20">

     {/* --- 1. HERO --- */}
<section className="relative w-full lg:h-[427px] bg-[#663399] font-['Inter'] pb-10 lg:pb-0 overflow-visible">
  {/* Main 1440px Wrapper for exact CSS coordinate mapping */}
  <div className="max-w-[1440px] w-full mx-auto relative h-full px-6 lg:px-0 flex flex-col lg:block pt-10 lg:pt-0">
    
    {/* 1. Hero Image (Pops out top, overlaps Pricing Card) */}
    {pkg.heroImage && (
      <div className="lg:absolute lg:left-[129px] lg:-top-[54px] lg:w-[424px] lg:h-[372px] lg:z-20 w-full max-w-[420px] mx-auto mb-6 relative shrink-0">
        <Image 
          src={pkg.heroImage} 
          alt={pkg.pageTitle} 
          fill 
          className="object-contain object-bottom" 
          priority 
        />
      </div>
    )}

    {/* 2. Text Content */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.6 }} 
      className="lg:absolute lg:left-[543px] lg:top-[36px] flex flex-col lg:z-10 mb-8 items-center lg:items-start text-center lg:text-left"
    >
      <h1 className="text-[28px] lg:text-[34px] font-bold text-white uppercase leading-[138%] max-w-[306px] mb-[16px]">
        {pkg.pageTitle}
      </h1>
      {pkg.pageSubtitle && (
        <p className="text-[14px] lg:text-[16px] font-semibold text-white leading-[149%] max-w-[340px] mb-[12px]">
          {pkg.pageSubtitle}
        </p>
      )}
      {pkg.heroDescription && (
        <p className="text-[12px] font-medium text-white leading-[149%] max-w-[321px]">
          {pkg.heroDescription}
        </p>
      )}
    </motion.div>

    {/* 3. Pricing Card (Matches precise 693x95.5 desktop dimensions) */}
    <div className="lg:absolute lg:left-[171px] lg:top-[315px] w-full lg:w-[693px] lg:h-[95.5px] lg:z-10 flex flex-col lg:flex-row bg-white rounded-[12px] border-[3px] border-[#FFFDFD] shadow-[0px_1px_7px_#521C86] overflow-hidden mb-10 lg:mb-0">
      
      {/* Box 1: Package Price */}
      <div className="flex-1 lg:flex-none lg:w-[171px] flex flex-col items-center justify-center bg-white py-4 lg:py-0 relative border-b lg:border-b-0 lg:border-r border-[#E7D8F5]">
        <p className="text-[14px] font-semibold text-[#663399] leading-[149%]">Package Price</p>
        <div className="relative text-[24px] font-bold text-[#663399] leading-[149%] mt-1">
          {formatCurrency(pkg.originalPrice)}
          {/* Red Strikethrough Line */}
          <div className="absolute top-1/2 left-[-10%] w-[120%] h-[1.5px] bg-[#E30000] -rotate-[8deg]"></div>
        </div>
      </div>

      {/* Box 2: Discounted Price */}
      <div className="flex-1 lg:flex-none lg:w-[184px] flex flex-col items-center justify-center bg-[#663399] py-4 lg:py-0">
        <p className="text-[14px] font-semibold text-[#FFFEFE] leading-[149%]">DISCOUNTED PRICE</p>
        <p className="text-[32px] font-extrabold text-white leading-none mt-1">
          {formatCurrency(pkg.discountedPrice)}
        </p>
      </div>

      {/* Box 3: You Save */}
      <div className="flex-1 lg:flex-none lg:w-[168px] flex flex-col items-center justify-center bg-white py-4 lg:py-0">
        <p className="text-[14px] font-semibold text-[#663399] leading-[149%]">You Save</p>
        <p className="text-[21px] font-bold text-[#663399] leading-[149%] mt-1">
          {savedPercent}% ({formatCurrency(savedAmount)})
        </p>
      </div>

      {/* Box 4: Call Now Button */}
      <a href="tel:+919603911911" className="flex-1 lg:flex-none lg:w-[164px] h-full flex items-center justify-center bg-[#663399] gap-[10px] py-4 lg:py-0 hover:bg-[#5b2d8a] transition-colors cursor-pointer">
        <svg className="w-6 h-6 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"></path>
        </svg>
        <span className="text-[20px] font-bold text-white leading-[149%]">Call Now</span>
      </a>

    </div>

    {/* 4. Booking Form (Matches precise 345x365 desktop dimensions) */}
    <div className="lg:absolute lg:left-[949px] lg:top-[30px] w-full lg:w-[345px] h-[365px] bg-white rounded-[11px] px-[20px] py-[18px] flex flex-col justify-between z-30 mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
        
        {/* Form Inputs Group */}
        <div className="flex flex-col gap-[10px]">
          <div>
            <label className="block text-[9px] font-medium text-black mb-[4px]">Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your full name"
              className="w-full h-[30px] bg-white border-[0.75px] border-[#663399] rounded-[3px] px-2 text-[9px] text-black placeholder-[#DCDCDC] outline-none focus:ring-1 focus:ring-[#663399]/50" />
          </div>
          <div>
            <label className="block text-[9px] font-medium text-black mb-[4px]">Mobile Number :</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="Enter your mobile number"
              className="w-full h-[30px] bg-white border-[0.75px] border-[#663399] rounded-[3px] px-2 text-[9px] text-black placeholder-[#DCDCDC] outline-none focus:ring-1 focus:ring-[#663399]/50" />
          </div>
          <div>
            <label className="block text-[9px] font-medium text-black mb-[4px]">Email Address:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address"
              className="w-full h-[30px] bg-white border-[0.75px] border-[#663399] rounded-[3px] px-2 text-[9px] text-black placeholder-[#DCDCDC] outline-none focus:ring-1 focus:ring-[#663399]/50" />
          </div>
          <div>
            <label className="block text-[9px] font-medium text-black mb-[4px]">Preferred Date :</label>
            <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} placeholder="Select Date"
              className="w-full h-[30px] bg-white border-[0.75px] border-[#663399] rounded-[3px] px-2 text-[9px] text-black placeholder-[#DCDCDC] outline-none focus:ring-1 focus:ring-[#663399]/50" />
          </div>
          <div>
            <label className="block text-[9px] font-medium text-black mb-[4px]">Preferred Time :</label>
            <input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} placeholder="Select Time"
              className="w-full h-[30px] bg-white border-[0.75px] border-[#663399] rounded-[3px] px-2 text-[9px] text-black placeholder-[#DCDCDC] outline-none focus:ring-1 focus:ring-[#663399]/50" />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting}
          className="w-full h-[29px] bg-[#663399] border-[0.75px] border-white shadow-[0px_0px_4px_rgba(63,20,106,0.39)] rounded-[5px] text-[12px] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 uppercase mt-[10px]">
          {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : "BOOK MY APPOINTMENT"}
        </button>
        
      </form>
    </div>

  </div>
</section>

      {/* --- 2. WHAT DOES THIS PACKAGE INCLUDE --- */}
      {(pkg.testGroups?.length || 0) > 0 && (
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} className="py-16 max-w-[1300px] w-full mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-[28px] font-bold text-[#663399] mb-10 text-center">What Does This Package Include?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pkg.testGroups.map((group, idx) => (
              <div key={group.id ?? idx} className="relative bg-[#663399] rounded-2xl p-6 min-h-[240px] overflow-hidden">
                {group.image && (
                  <div className="absolute inset-0 opacity-20">
                    <Image src={group.image} alt={group.title} fill className="object-cover" />
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="text-white font-semibold text-lg mb-4">{group.title}</h3>
                  <ul className="text-white text-sm space-y-2">
                    {group.tests.map((test, tIdx) => (
                      <li key={tIdx}>• {test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* --- 3. WHO IS THIS PACKAGE FOR --- */}
{(pkg.whoIsThisFor?.list?.length || 0) > 0 && (
  <motion.section 
    initial="hidden" 
    whileInView="show" 
    viewport={{ once: true, amount: 0.1 }} 
    variants={fadeUp} 
    className="relative w-full py-16 lg:py-20 bg-[#FAFCFF] overflow-hidden font-['Inter'] flex items-center min-h-[400px]"
  >
    
    {/* Right Static Image - Absolutely positioned to bleed to the screen edge */}
    <div className="absolute right-0 top-0 w-full lg:w-[85%] h-full z-0 opacity-15 lg:opacity-100 pointer-events-none">
      <img 
        src="/assets/who-is-it-for.png" 
        alt="Happy family" 
        className="w-full h-full object-cover lg:object-left"
      />
      {/* Subtle gradient overlay to blend the left edge of the image smoothly into the background */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#FAFCFF] via-[#FAFCFF]/80 to-transparent w-[40%]"></div>
    </div>

    {/* Content Container - Constrained to 1300px and sits above the image */}
    <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 relative z-10">
      
      {/* Left Text Content */}
      <div className="w-full lg:max-w-[55%] flex flex-col">
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#663399] leading-[138%] mb-[24px]">
          Who Is This Package For?
        </h2>
        
        {pkg.whoIsThisFor.intro && (
          <p className="text-[16px] md:text-[18px] font-medium text-black leading-[149%] mb-[24px]">
            {pkg.whoIsThisFor.intro}
          </p>
        )}
        
        <ul className="text-black text-[15px] md:text-[16px] font-medium space-y-[16px] leading-[149%]">
          {pkg.whoIsThisFor.list.map((item, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-[10px] text-[18px] leading-none mt-[2px]">•</span> 
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
    </div>
  </motion.section>
)}

      {/* --- 4. WHAT DOES IT HELP ASSESS --- */}
{(pkg.assessmentItems?.length || 0) > 0 && (
  <motion.section 
    initial="hidden" 
    whileInView="show" 
    viewport={{ once: true, amount: 0.1 }} 
    variants={fadeUp} 
    className="py-16 w-full font-['Inter'] flex flex-col items-center"
  >
    <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12">
      
      {/* Headings */}
      <h2 className="text-[26px] md:text-[34px] font-bold text-[#663399] leading-[138%] text-center mb-[13px]">
        What Does It Help Assess?
      </h2>
      {pkg.detailSummary && (
        <p className="text-[16px] md:text-[18px] font-medium text-black leading-[149%] text-center max-w-[678px] mx-auto mb-[48px]">
          {pkg.detailSummary}
        </p>
      )}

      {/* Bento Box Layout Wrapper */}
      <div className="flex flex-col xl:flex-row justify-center gap-[20px] max-w-[1170px] mx-auto">
        
        {/* ================= LEFT MACRO COLUMN ================= */}
        <div className="flex flex-col gap-[15px] w-full xl:w-[575px] shrink-0">
          
          {/* Card 0: Blood Health (Spans full width of left column) */}
          {pkg.assessmentItems[0] && (
            <div className="relative w-full h-[284px] bg-[#7E57A8] rounded-[19px] overflow-hidden">
              {/* Static Background Image */}
              <div className="absolute right-0 top-0 h-full w-[65%] z-0">
                <img 
                  src="/assets/assessment-hero.png" 
                  alt="Blood test" 
                  className="w-full h-full object-cover object-right" 
                />
              </div>
              {/* Purple Gradient Overlay */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                style={{ background: 'linear-gradient(90deg, #7E57A8 40%, rgba(126, 87, 168, 0.8) 60%, rgba(126, 87, 168, 0) 100%)' }}
              />
              
              {/* Content */}
              <div className="relative z-20 p-[30px] flex flex-col justify-center h-full max-w-[260px]">
                <div className="w-[91px] h-[91px] rounded-full bg-[#FFFAFA] flex items-center justify-center mb-[20px] shrink-0 shadow-sm">
                  <img src={pkg.assessmentItems[0].icon} alt="" className="w-full h-full object-contain p-[18px]" />
                </div>
                <h3 className="text-[16px] font-bold text-white mb-[8px] leading-[149%]">
                  {pkg.assessmentItems[0].title}
                </h3>
                <p className="text-[14px] font-medium text-white leading-[149%]">
                  {pkg.assessmentItems[0].description}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Left Grid (2 small cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
            {/* Card 3: Blood Sugar */}
            {pkg.assessmentItems[3] && (
              <div className="h-[284px] bg-[#7E57A8] rounded-[19px] p-[30px] flex flex-col justify-between items-center sm:items-start text-center sm:text-left">
                <div className="w-[91px] h-[91px] rounded-full bg-[#FFFAFA] flex items-center justify-center shrink-0 shadow-sm self-center sm:self-start">
                  <img src={pkg.assessmentItems[3].icon} alt="" className="w-full h-full object-contain p-[18px]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-[8px] leading-[149%]">
                    {pkg.assessmentItems[3].title}
                  </h3>
                  <p className="text-[14px] font-medium text-white leading-[149%]">
                    {pkg.assessmentItems[3].description}
                  </p>
                </div>
              </div>
            )}
            
            {/* Card 4: Iron Status */}
            {pkg.assessmentItems[4] && (
              <div className="h-[284px] bg-[#7E57A8] rounded-[19px] p-[30px] flex flex-col justify-between relative text-center sm:text-left">
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-[8px] leading-[149%]">
                    {pkg.assessmentItems[4].title}
                  </h3>
                  <p className="text-[14px] font-medium text-white leading-[149%]">
                    {pkg.assessmentItems[4].description}
                  </p>
                </div>
                <div className="w-[91px] h-[91px] rounded-full bg-[#FFFAFA] flex items-center justify-center self-center sm:self-end shrink-0 shadow-sm mt-4">
                  <img src={pkg.assessmentItems[4].icon} alt="" className="w-full h-full object-contain p-[18px]" />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ================= RIGHT MACRO COLUMN ================= */}
        <div className="flex flex-col gap-[15px] w-full xl:w-[575px] shrink-0">
          
          {/* Top Right Grid (2 small cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
            {/* Card 1: Liver & Kidney */}
            {pkg.assessmentItems[1] && (
              <div className="h-[284px] bg-[#7E57A8] rounded-[19px] p-[30px] flex flex-col justify-between relative text-center sm:text-left">
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-[8px] leading-[149%]">
                    {pkg.assessmentItems[1].title}
                  </h3>
                  <p className="text-[14px] font-medium text-white leading-[149%]">
                    {pkg.assessmentItems[1].description}
                  </p>
                </div>
                <div className="w-[91px] h-[91px] rounded-full bg-[#FFFAFA] flex items-center justify-center self-center sm:self-end shrink-0 shadow-sm mt-4">
                  <img src={pkg.assessmentItems[1].icon} alt="" className="w-full h-full object-contain p-[18px]" />
                </div>
              </div>
            )}
            
            {/* Card 2: Thyroid Health */}
            {pkg.assessmentItems[2] && (
              <div className="h-[284px] bg-[#7E57A8] rounded-[19px] p-[30px] flex flex-col justify-between items-center sm:items-start text-center sm:text-left">
                <div className="w-[91px] h-[91px] rounded-full bg-[#FFFAFA] flex items-center justify-center shrink-0 shadow-sm self-center">
                  <img src={pkg.assessmentItems[2].icon} alt="" className="w-full h-full object-contain p-[18px]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white mb-[8px] leading-[149%]">
                    {pkg.assessmentItems[2].title}
                  </h3>
                  <p className="text-[14px] font-medium text-white leading-[149%]">
                    {pkg.assessmentItems[2].description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Card 5: Heart Health (Horizontal Card) */}
          {pkg.assessmentItems[5] && (
            <div className="h-[196px] bg-[#7E57A8] rounded-[19px] p-[30px] flex flex-row items-center justify-between">
              <div className="max-w-[270px]">
                <h3 className="text-[16px] font-bold text-white mb-[8px] leading-[149%]">
                  {pkg.assessmentItems[5].title}
                </h3>
                <p className="text-[14px] font-medium text-white leading-[149%]">
                  {pkg.assessmentItems[5].description}
                </p>
              </div>
              <div className="w-[91px] h-[91px] rounded-full bg-[#FFFAFA] flex items-center justify-center shrink-0 shadow-sm ml-4">
                <img src={pkg.assessmentItems[5].icon} alt="" className="w-full h-full object-contain p-[18px]" />
              </div>
            </div>
          )}

          {/* CTA Card (Bottom) */}
          <div 
            onClick={() => setIsPopupOpen(true)}
            className="h-[74px] bg-[#663399] rounded-[19px] px-[20px] sm:px-[30px] flex items-center justify-between cursor-pointer group hover:bg-[#5b2d8a] transition-colors shadow-sm"
          >
            <p className="text-[14px] sm:text-[18px] font-medium text-white leading-[149%] max-w-[398px]">
              Get fuller insights of your health with this Health check up
            </p>
            <div className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] bg-[#FFFAFA] rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border-[3px] border-[#663399]">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#663399]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  </motion.section>
)}

      {/* --- 5. BOTTOM CTA --- */}
<section className="w-full py-16 px-6 lg:px-12 font-['Inter'] flex justify-center">
  
  {/* Banner Container (Matches precise 1171x145 dimensions) */}
  <div className="relative w-full max-w-[1300px] lg:h-[145px] bg-[#663399] rounded-[24px] overflow-hidden flex flex-col lg:flex-row items-center shadow-lg">
    
    {/* Right Side Image */}
    <div className="absolute right-0 top-0 w-full lg:w-[60%] h-full z-0 pointer-events-none">
      <img 
        src="/assets/cta-doctor-bg.png" 
        alt="Doctor with arms crossed" 
        className="w-full h-full object-cover lg:object-right opacity-50 lg:opacity-100" 
      />
    </div>

    {/* Exact Gradient Mask from CSS to blend the image seamlessly */}
    <div 
      className="hidden lg:block absolute inset-0 z-0 pointer-events-none" 
      style={{ background: 'linear-gradient(90deg, #663399 54.84%, rgba(102, 51, 153, 0) 78.46%)' }}
    />

    {/* Content Wrapper */}
    <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center px-8 py-10 lg:py-0 lg:pl-[45px] lg:pr-[180px]">
      
      {/* Left Text */}
      <div className="flex flex-col mb-8 lg:mb-0 w-full lg:max-w-[447px] text-center lg:text-left">
        <h2 className="text-[24px] lg:text-[28px] font-bold text-white leading-[138%] mb-[8px]">
          Stay Ahead of Your Health
        </h2>
        <p className="text-[16px] lg:text-[18px] font-medium text-white leading-[149%]">
          Know your important health parameters. Make preventive screening part of your routine.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-[24px] shrink-0">
        
        {/* Call Now Button */}
        <a href="tel:+919603911911" className="block">
          <button className="w-[154px] h-[45px] bg-[#663399] border-2 border-white rounded-[9px] shadow-[3px_0px_7.6px_1px_rgba(75,31,126,0.9)] flex items-center justify-center gap-2 hover:bg-[#582a87] transition-colors">
            <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"></path>
            </svg>
            <span className="font-['Poppins'] font-semibold text-[18px] text-white">
              Call Now
            </span>
          </button>
        </a>

        {/* Book Now Button */}
        <button
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="w-[159px] h-[45px] bg-[#663399] border-2 border-white rounded-[9px] shadow-[3px_0px_7.6px_1px_rgba(75,31,126,0.9)] flex items-center justify-center gap-2 hover:bg-[#582a87] transition-colors"
        >
          <svg className="w-5 h-5 stroke-white shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M9 16l2 2 4-4"></path>
          </svg>
          <span className="font-['Poppins'] font-semibold text-[18px] text-white">
            Book Now
          </span>
        </button>

      </div>

    </div>
  </div>
</section>
      <HealthPackageBookingModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        packageTitle={pkg.pageTitle}
      />
    </div>
  );
}
