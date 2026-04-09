"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPhone, 
  FaArrowRight, 
  FaChevronDown, 
  FaHandPointRight,
  FaCircle
} from "react-icons/fa6";

export default function DoctorProfileClient({ doctor }: { doctor: any }) {
  const [activeTab, setActiveTab] = useState("qualifications");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs = [
    { id: "qualifications", label: "Qualifications", data: doctor?.qualificationsList || [] },
    { id: "experience", label: "Experience & achievements", data: doctor?.experienceAchievements || [] },
    { id: "memberships", label: "Memberships", data: doctor?.memberships || [] },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    // FIX 1: Added overflow-x-hidden to prevent the entire page from scrolling horizontally
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#FAFAFA] py-12 lg:py-20 border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 w-full"
          >
            {/* Doctor Image */}
            <div className="shrink-0">
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-[24px] overflow-hidden border-2 border-[#5B328C] shadow-lg bg-white">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-gray-100">
                  {doctor?.image ? (
                    <Image src={doctor.image} alt={doctor?.name} fill className="object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            {/* FIX 2: Added flex-1 and min-w-0 so this container shrinks and wraps text properly */}
            <div className="flex flex-col text-center md:text-left mt-4 md:mt-0 flex-1 min-w-0 w-full">
              <h1 className="text-3xl md:text-4xl font-bold text-[#5B328C] mb-2 break-words">{doctor?.name}</h1>
              <p className="text-sm font-semibold text-gray-800 mb-1 break-words">{doctor?.qualification}</p>
              
              <div className="text-sm text-gray-700 mb-1 space-y-1">
                {doctor?.designations?.map((desig: string, idx: number) => (
                  <p key={idx} className="font-medium break-words">{desig}</p>
                ))}
              </div>
              
              {doctor?.experience && (
                <p className="text-sm font-bold text-[#5B328C] mt-2 mb-6 break-words">
                  Experience : <span className="text-gray-800">{doctor.experience}</span>
                </p>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-auto">
                <a href="tel:+919160606108" className="flex items-center gap-2 border-2 border-[#5B328C] text-[#5B328C] px-8 py-2.5 rounded-lg font-bold hover:bg-[#F3E8FF] transition-colors whitespace-nowrap">
                  <FaPhone className="text-sm" /> Call Now
                </a>
                <Link href={`/contact?doctor=${encodeURIComponent(doctor?.name || '')}`}>
                  <button className="bg-[#5B328C] text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-[#4a2873] transition-colors whitespace-nowrap">
                    Book an Appointment
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-16">
        
        {/* 2. ABOUT DOCTOR (Rendered via extraFields Rich Text) */}
        {doctor?.extraFields?.map((field: any, index: number) => (
          <motion.section 
            key={index}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 break-words">{field.heading}</h3>
            {/* FIX 3: Added break-words and w-full to the Rich Text container */}
            <div 
              className="text-sm leading-relaxed text-gray-700 prose prose-purple max-w-none break-words w-full"
              dangerouslySetInnerHTML={{ __html: field.description }} 
            />
          </motion.section>
        ))}

        {/* 3. KEY EXPERTISE */}
        {doctor?.keyExpertise?.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="w-full">
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-gray-900 mb-6">Key expertise</motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {doctor.keyExpertise.map((item: string, idx: number) => (
                <motion.div 
                  key={idx} variants={fadeInUp}
                  className="flex items-start gap-3 border border-gray-200 rounded-lg p-4 bg-white hover:bg-[#F9F7FD] hover:border-[#5B328C]/30 transition-all duration-300 shadow-sm w-full min-w-0"
                >
                  <FaHandPointRight className="text-[#5B328C] text-lg shrink-0 mt-0.5" />
                  {/* FIX 4: Added break-words to span items */}
                  <span className="text-sm font-medium text-gray-800 break-words flex-1 min-w-0">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 4. CONDITIONS TREATED */}
        {doctor?.conditionsTreated?.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="w-full">
            <motion.h3 variants={fadeInUp} className="text-xl font-bold text-gray-900 mb-6">Conditions treated</motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {doctor.conditionsTreated.map((item: string, idx: number) => (
                <motion.div 
                  key={idx} variants={fadeInUp}
                  className="bg-[#5B328C] text-white rounded-lg p-4 shadow-md hover:-translate-y-1 transition-transform duration-300 w-full min-w-0"
                >
                  <span className="text-sm font-medium break-words block">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 5. TABS (Qualifications, Experience, Memberships) */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full">
          <div className="rounded-2xl border border-[#5B328C]/20 overflow-hidden shadow-sm w-full">
            <div className="flex flex-col sm:flex-row border-b border-[#5B328C]/20 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-sm font-bold transition-colors duration-300 break-words ${
                    activeTab === tab.id 
                      ? "bg-[#5B328C] text-white" 
                      : "bg-white text-[#5B328C] hover:bg-[#F9F7FD]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="bg-[#FAFAFA] p-6 md:p-10 min-h-[200px] w-full">
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
                        <li key={idx} className="flex items-start gap-3 w-full min-w-0">
                          <FaCircle className="text-[#5B328C] text-[8px] mt-1.5 shrink-0" />
                          <span className="text-sm font-medium text-gray-800 leading-relaxed break-words flex-1 min-w-0">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No details available.</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* 6. BOTTOM CTA & CLOSING DESCRIPTION */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center max-w-2xl mx-auto flex flex-col items-center pt-8 w-full"
        >
          <Link href={`/contact?doctor=${encodeURIComponent(doctor?.name || '')}`}>
            <button className="bg-[#5B328C] text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-[#4a2873] transition-all flex items-center gap-2 group whitespace-nowrap">
              Book an Appointment 
              <FaArrowRight className="bg-white text-[#5B328C] rounded-full p-1 text-xl group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </Link>
          {doctor?.closingDescription && (
            <p className="text-xs md:text-sm text-gray-600 mt-6 leading-relaxed font-medium break-words w-full">
              {doctor.closingDescription}
            </p>
          )}
        </motion.section>

        {/* 7. FAQs */}
        {doctor?.faqs?.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="pt-8 w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center md:text-left break-words">Frequently asked questions</h3>
            <div className="space-y-3 w-full">
              {doctor.faqs.map((faq: any, idx: number) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border rounded-xl overflow-hidden transition-colors duration-300 w-full ${
                      isOpen ? "border-[#5B328C]/30 bg-[#F9F7FD]" : "border-gray-200 bg-white"
                    }`}
                  >
                    <button 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center gap-4"
                    >
                      <span className={`text-sm font-bold break-words flex-1 min-w-0 ${isOpen ? "text-[#5B328C]" : "text-gray-800"}`}>
                        {idx + 1}. {faq.question}
                      </span>
                      <FaChevronDown className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#5B328C]" : ""}`} />
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
                          <div 
                            className="px-6 pb-4 text-sm text-gray-700 leading-relaxed prose prose-purple max-w-none break-words w-full"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

      </div>
    </div>
  );
}