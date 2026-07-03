"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPhone, 
  FaChevronDown, 
  FaHandPointRight,
  FaCircle,
  FaPhoneVolume
} from "react-icons/fa6";
import DoctorTalks from "./DoctorTalks"; 
import PatientSuccessStories from "./PatientSuccessStories"; 

export default function DoctorProfileClient({ doctor }: { doctor: any }) {
  const [activeTab, setActiveTab] = useState("qualifications");
  const [activeNav, setActiveNav] = useState("about");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs = [
    { id: "qualifications", label: "Qualifications", data: doctor?.qualificationsList || [] },
    { id: "experience", label: "Experience & achievements", data: doctor?.experienceAchievements || [] },
    { id: "memberships", label: "Memberships", data: doctor?.memberships || [] },
  ];

  const navLinks = [
    { id: "about", label: "About Doctor" },
    { id: "expertise", label: "Key Expertise" },
    { id: "conditions", label: "Conditions Treated" },
    { id: "qualifications", label: "Qualifications" },
    { id: "experience", label: "Experience & Achievements" },
    { id: "memberships", label: "Memberships" },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  // Smooth scroll handler for the navigation pills with Fixed Header offset
  const scrollToSection = (id: string) => {
    setActiveNav(id);
    
    // Determine the actual target container ID
    const targetId = ["qualifications", "experience", "memberships"].includes(id) 
      ? "details-section" 
      : id;

    // Set the active tab if it is one of the detail tabs
    if (["qualifications", "experience", "memberships"].includes(id)) {
      setActiveTab(id);
    }

    const element = document.getElementById(targetId);
    
    if (element) {
      // Set this to the height of your fixed header in pixels (plus a little extra padding if you like)
      const headerOffset = 200; 
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="font-[Poppins] bg-white min-h-screen pb-20 overflow-x-hidden">
      
      {/* HERO SECTION (Purple Gradient) */}
      <section className="bg-[linear-gradient(90.69deg,#0066A9_-139.87%,#663399_81.46%)] py-12 lg:py-20">
        <div className="container mx-auto max-w-[1200px] px-4">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 w-full"
          >
            {/* Doctor Image */}
            <div className="shrink-0">
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border-2 border-[#5B328C] shadow-2xl bg-gray-100">
                {doctor?.image ? (
                  <Image src={doctor.image} alt={doctor?.name} fill className="object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Alavi Hospitals</div>
                )}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex flex-col text-center md:text-left mt-4 md:mt-0 flex-1 min-w-0 w-full text-white">
              <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold mb-3 break-words">
                {doctor?.name}
              </h1>
              
              <p className="text-xl font-bold text-white/90 mb-2 break-words">
                {doctor?.designations?.join(" | ")}
              </p>
              
              <p className="text-xl font-normal text-white/80 mb-5 break-words">
                {doctor?.qualification}
              </p>
              
              {doctor?.experience && (
                <div className="bg-[#8D61BA] border border-white/30 backdrop-blur-sm px-5 py-2 rounded-md inline-flex justify-center md:justify-start w-fit mb-8 mx-auto md:mx-0 shadow-sm">
                  <p className="text-2xl font-semibold break-words">
                    Experience : {doctor.experience}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                <a href="tel:+919603911911" className="flex items-center gap-2 border-[2px] border-white text-white px-8 py-2.5 rounded-[3px] hover:bg-white/10 transition-colors whitespace-nowrap font-semibold text-xl shadow-sm">
                  Call Now
                </a>
                <Link href={`/contact?doctor=${encodeURIComponent(doctor?.name || '')}`}>
                  <button className="bg-white text-[#5B328C] px-8 py-3 rounded-[3px] font-semibold shadow-md hover:bg-gray-100 transition-colors whitespace-nowrap text-xl">
                    Book an Appointment
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FLOATING CTA BANNER */}
      <div className="container mx-auto max-w-[1200px] px-4 mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[linear-gradient(90.69deg,#0066A9_-174.27%,#663399_99.41%)] rounded-xl py-4 px-6 md:px-10 flex flex-col md:flex-row items-center justify-center text-white shadow-xl border border-white/10 gap-24"
        >
          <span className="font-semibold text-3xl tracking-wide">To Book An Appointment</span>
          <a href="tel:+919603911911" className="text-3xl flex items-center gap-3 bg-[#0066B3] border border-white/20 px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-[#004a85] transition-colors whitespace-nowrap">
            <div className="bg-white text-[#0066B3] rounded-full p-1.5 flex items-center justify-center">
              <FaPhoneVolume className="text-3xl" />
            </div>
            Call Us +91 9603 911 911
          </a>
        </motion.div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 py-12 space-y-10">
        
        {/* NAVIGATION PILLS */}
        <div className="flex flex-wrap justify-center gap-3 pb-4">
          {navLinks.map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollToSection(nav.id)}
              className={`px-5 py-2 rounded-full text-[20px] font-medium border transition-colors ${
                activeNav === nav.id 
                  ? "bg-[#5B328C] border-[#5B328C] text-white shadow-sm" 
                  : "bg-transparent border-[#5B328C] text-[#5B328C] hover:bg-[#F3E8FF]"
              }`}
            >
              {nav.label}
            </button>
          ))}
        </div>

        {/* ABOUT DOCTOR */}
        <section id="about" className="border-2 border-[#5B328C]/20 rounded-2xl p-6 md:p-10 bg-[#FBF7FF] shadow-sm scroll-mt-24">
          <h3 className="text-[#5B328C] font-bold text-xl mb-6">About Doctor</h3>
          {doctor?.extraFields?.map((field: any, index: number) => (
            <div key={index} className="w-full mb-4 last:mb-0">
              {field.heading && field.heading.toLowerCase() !== 'about doctor' && (
                <h4 className="text-[26px] font-semibold text-gray-900 mb-3 break-words">{field.heading.replace(/&nbsp;/g, ' ')}</h4>
              )}
              <div 
                className="text-[21px] leading-relaxed text-gray-700 prose prose-purple max-w-none break-words w-full"
                dangerouslySetInnerHTML={{ __html: field.description.replace(/&nbsp;/g, ' ') }} 
              />
            </div>
          ))}
        </section>

        {/* KEY EXPERTISE */}
        {doctor?.keyExpertise?.length > 0 && (
          <section id="expertise" className="bg-[#F4F9FF] border border-blue-100 rounded-2xl p-6 md:p-10 shadow-sm scroll-mt-24">
            <h3 className="text-gray-900 font-semibold text-[26px] mb-6">Key expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {doctor.keyExpertise.map((item: string, idx: number) => (
                <div 
                  key={idx} 
                  className="group flex items-start gap-4 border border-[#5B328C]/20 rounded p-4 bg-[#FBF7FF] hover:bg-[#3D2C7A] transition-all duration-300 shadow-sm w-full min-w-0"
                >
                  <FaHandPointRight className="text-[#5B328C] group-hover:text-white text-lg shrink-0 mt-0.5 transition-colors" />
                  <span className="text-[21px] font-semibold text-gray-800 group-hover:text-white break-words flex-1 min-w-0 transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONDITIONS TREATED */}
        {doctor?.conditionsTreated?.length > 0 && (
          <section id="conditions" className="bg-gradient-to-br from-[#54338A] to-[#2E376E] rounded-2xl p-6 md:p-10 shadow-lg scroll-mt-24">
            <h3 className="text-white font-semibold text-[26px] mb-2">Advanced Care for Multiple Health Conditions</h3>
            {/* Dynamic RTE Description with Static Fallback */}
            {doctor?.conditionsTreatedDescription ? (
              <div 
                className="text-white/80 text-[21px] mb-8 prose prose-invert prose-p:leading-relaxed max-w-none [&_p]:text-white/80 [&_ul]:text-white/80 [&_ol]:text-white/80 [&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: doctor.conditionsTreatedDescription }}
              />
            ) : (
              <p className="text-white/80 text-[21px] mb-8">
                From initial diagnosis to critical care support, offering trusted medical expertise across a wide spectrum of conditions.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {doctor.conditionsTreated.map((item: string, idx: number) => (
                <div 
                  key={idx} 
                  className="bg-white text-[#5B328C] border-none rounded p-3.5 shadow-sm hover:scale-[1.02] transition-transform duration-300 w-full min-w-0"
                >
                  <span className="text-[21px] font-semibold break-words block">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DETAILS TABS (Qualifications, Experience, Memberships) */}
        {/* 2. FIXED: Assigned parent container the ID 'details-section' for smooth scrolling */}
        <section id="details-section" className="border-2 border-[#5B328C]/20 rounded-2xl p-6 md:p-10 bg-[#FBF7FF] shadow-sm scroll-mt-24">
          <div className="flex flex-col sm:flex-row gap-3 mb-8 border-b-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveNav(tab.id);
                }}
                className={`cursor-pointer flex-1 py-3 px-4 text-[26px] font-semibold border transition-colors duration-300 break-words rounded-sm ${
                  activeTab === tab.id 
                    ? "bg-[#5B328C] border-[#5B328C] text-white" 
                    : "bg-white border-[#5B328C]/30 text-[#5B328C] hover:bg-[#F3E8FF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="w-full min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {tabs.find(t => t.id === activeTab)?.data.length ? (
                  <ul className="space-y-4 w-full">
                    {tabs.find(t => t.id === activeTab)?.data.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-4 w-full min-w-0">
                        <FaCircle className="text-[#5B328C] text-[8px] mt-3.5 shrink-0" />
                        <span className="text-[21px] font-semibold text-gray-800 leading-relaxed break-words flex-1 min-w-0">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-[21px] italic">No details available.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <DoctorTalks />
        <PatientSuccessStories />

        {/* FAQs */}
        {doctor?.faqs?.length > 0 && (
          <section className="pt-4 w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center md:text-left break-words">Frequently asked questions</h3>
            <div className="space-y-3 w-full">
              {doctor.faqs.map((faq: any, idx: number) => {
                const isOpen = openFaq === idx;
                return (
                  // 3. FIXED: Custom gradient, border color #663399, and text color handling
                  <div 
                    key={idx} 
                    className={`border border-[#663399] rounded-xl overflow-hidden transition-all duration-300 w-full ${
                      isOpen 
                        ? "bg-[linear-gradient(90.69deg,#0066A9_-174.27%,#663399_99.41%)] text-white shadow-md" 
                        : "bg-white text-gray-800 hover:bg-[#F9F7FD]"
                    }`}
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center gap-4"
                    >
                      <span className={`text-[21px] font-semibold break-words flex-1 min-w-0 ${isOpen ? "text-white" : "text-gray-800"}`}>
                        {idx + 1}. {faq.question}
                      </span>
                      <FaChevronDown className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-[#663399]"}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full"
                        >
                          {/* Enforced white text on all children elements (p, span, etc) when open */}
                          <div 
                            className="px-6 pb-4 text-[21px] leading-relaxed max-w-none break-words w-full text-white/95 [&_p]:text-white [&_a]:text-blue-200 [&_a]:underline"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}