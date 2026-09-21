"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Enhanced animation variants for smooth staggering and entry
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" as const, staggerChildren: 0.15 } 
  }
};

const childFadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const ADMISSION_STEPS = [
  { step: "Step 01", title: "Doctor's Advice", desc: "Your doctor will recommend hospital admission based on your medical condition and treatment requirements." },
  { step: "Step 02", title: "Registration", desc: "Visit our Admission Desk with your admission advice and required identification documents." },
  { step: "Step 03", title: "Documentation", desc: "Your doctor will recommend hospital admission based on your medical condition and treatment requirements." },
  { step: "Step 04", title: "Room & Billing", desc: "Our team will assist you with room allocation, admission charges, insurance formalities and payment requirements." },
  { step: "Step 05", title: "Admission", desc: "Once the formalities are completed, you will be guided to your allocated room and introduced to the nursing and support team." },
];

const DOCUMENTS = [
  { icon: "/assets/icons/doc-id.png", label: "Government-issued ID proof" },
  { icon: "/assets/icons/doc-advice.png", label: "Doctor's admission advice" },
  { icon: "/assets/icons/doc-reports.png", label: "Previous medical reports" },
  { icon: "/assets/icons/doc-prescription.png", label: "Current prescriptions" },
  { icon: "/assets/icons/doc-insurance.png", label: "Insurance/TPA documents, if applicable AA" },
];

export default function AdmissionGuidelinesPage() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-white font-['Inter'] overflow-hidden">

      {/* --- 1. HERO --- */}
      <section className="relative w-full h-[434px] flex items-center overflow-hidden bg-[#663399]">
        {/* Background Image & Mask */}
        <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="/assets/images/admission-hero.png"
            alt="Hospital admission desk"
            className="w-full h-full object-contain object-right-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#663399_30.8%,rgba(102,51,153,0)_50.86%)]" />
        </div>

        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-[154px] relative z-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
            }}
            className="max-w-[540px] flex flex-col"
          >
            <motion.div 
              variants={slideInLeft}
              className="inline-block bg-white text-[#663399] font-medium text-[16px] px-[22px] py-[8px] rounded-[30px] w-fit mb-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              Your Admission, Made Simple
            </motion.div>
            <motion.h1 
              variants={slideInLeft}
              className="text-[20px] md:text-[24px] font-semibold text-white leading-[1.4]"
            >
              At Alavi Hospitals, we make the admission process smooth and hassle-free.
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* --- 2. ADMISSION PROCESS --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-20 max-w-[1440px] w-full mx-auto px-6 lg:px-[154px]"
      >
        <div className="bg-[#F6FBFF] rounded-[12px] p-10 lg:p-[70px] max-w-[1146px] mx-auto transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(102,51,153,0.05)]">
          <motion.h2 variants={childFadeUp} className="text-[#663399] font-bold text-[26px] text-center mb-2">
            Admission Process
          </motion.h2>
          <motion.p variants={childFadeUp} className="text-[#000000] text-[18px] text-center max-w-[661px] mx-auto mb-[60px] leading-[1.48]">
            Our team will guide you through each step and assist you with the necessary formalities.
          </motion.p>

          <div className="max-w-[900px] mx-auto">
            {ADMISSION_STEPS.map((item, idx) => {
              // No initial highlighting. The state is strictly driven by the hovered step.
              const isDotActive = hoveredStep !== null ? idx <= hoveredStep : false;
              const isLineActive = hoveredStep !== null ? idx < hoveredStep : false;
              const isLast = idx === ADMISSION_STEPS.length - 1;

              return (
                <motion.div 
                  key={idx} 
                  variants={childFadeUp}
                  className="flex gap-4 lg:gap-8 group cursor-default"
                  onMouseEnter={() => setHoveredStep(idx)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Label */}
                  <div className="w-[65px] pt-1 shrink-0 text-right">
                    <span className={`font-medium text-[16px] leading-[1.39] transition-colors duration-300 ${isDotActive ? 'text-[#663399]' : 'text-[#000000]'}`}>
                      {item.step}
                    </span>
                  </div>

                  {/* Timeline Visual */}
                  <div className="flex flex-col items-center shrink-0 w-[40px] relative">
                    <motion.div 
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-300 bg-[#F6FBFF] ${isDotActive ? 'border-[2px] border-[#663399]' : 'border-[2px] border-transparent'}`}
                    >
                      <div className={`w-[24px] h-[24px] rounded-full transition-colors duration-300 ${isDotActive ? 'bg-[#663399]' : 'bg-[#D8CBE5]'}`} />
                    </motion.div>
                    
                    {/* The Connecting Line */}
                    {!isLast && (
                      <div className="absolute top-[40px] bottom-0 w-[2px] bg-[#D8CBE5] overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 w-full bg-[#663399] transition-all duration-500 ease-in-out origin-top"
                          style={{ height: isLineActive ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <motion.div 
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className={`pb-12 ${isLast ? 'pb-0' : ''}`}
                  >
                    <h3 className={`font-semibold text-[21px] mb-2 leading-[1.39] transition-colors duration-300 ${isDotActive ? "text-[#663399]" : "text-[#000000]"}`}>
                      {item.title}
                    </h3>
                    <p className="text-[#000000] text-[18px] leading-[1.42] max-w-[704px]">
                      {item.desc}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* --- 3. DOCUMENTS TO CARRY --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="bg-[#663399] py-[60px]"
      >
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-[154px]">
          <motion.h2 variants={childFadeUp} className="text-white font-bold text-[26px] text-center mb-[50px]">
            Documents to Carry
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-10 lg:gap-[60px]">
            {DOCUMENTS.map((doc, idx) => (
              <motion.div 
                key={idx} 
                variants={childFadeUp}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center text-center gap-5 w-[170px] group cursor-pointer"
              >
                <div className="w-[76px] h-[76px] rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <img src={doc.icon} alt={doc.label} className="w-full h-full object-contain" />
                </div>
                <p className="text-white text-[18px] leading-[1.29] font-normal transition-opacity duration-300 group-hover:opacity-90">
                  {doc.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- 4. EMERGENCY ADMISSION + NEED HELP --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        style={{ background: 'linear-gradient(90deg, rgba(238, 248, 255, 0) 17.74%, #ECF7FE 30.88%)' }}
        className="w-full relative py-[60px]"
      >
        {/* Full-bleed absolute image on desktop */}
        <motion.div 
          initial={{ x: "-10%", opacity: 0 }}
          whileInView={{ x: "0%", opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="hidden lg:block absolute top-0 left-0 h-full overflow-hidden shadow-[4px_0_20px_rgba(0,0,0,0.06)] z-0"
          style={{ width: 'calc(max(0px, 50vw - 720px) + 154px + 320px)' }}
        >
          <motion.img 
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            src="/assets/images/emergency-admission.png" 
            alt="Emergency admission team" 
            className="w-full h-full object-cover object-right" 
          />
        </motion.div>

        {/* Main Content Container */}
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-[154px] relative z-10">
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-8">
            
            {/* Left side: Emergency Admission Text */}
            <div className="flex flex-col sm:flex-row items-stretch gap-8 lg:gap-12 flex-1">
              
              {/* Spacer on Desktop (to make room for the absolute image), Image on Mobile */}
              <div className="w-full sm:w-[280px] lg:w-[320px] shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="lg:hidden w-full h-[220px] rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                >
                  <img 
                    src="/assets/images/emergency-admission.png" 
                    alt="Emergency admission team" 
                    className="w-full h-full object-contain" 
                  />
                </motion.div>
              </div>
              
              <motion.div 
                variants={childFadeUp}
                className="flex flex-col justify-center max-w-[440px] py-2 lg:py-0"
              >
                <h3 className="text-[#663399] font-bold text-[24px] mb-[14px]">Emergency Admission</h3>
                <p className="text-[#000000] text-[16px] font-medium mb-3">
                  In an emergency, immediate medical care takes priority.
                </p>
                <p className="text-[#000000] text-[14px] leading-relaxed">
                  Please proceed directly to our Emergency Department. Our medical team will assess the patient and provide the required care while our staff assists with the necessary admission formalities.
                </p>
              </motion.div>
            </div>

            {/* Vertical Divider (Hidden on mobile) */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
              viewport={{ once: true }}
              className="hidden lg:block w-[2px] my-2 bg-[#663399] origin-top" 
            />

            {/* Right side: Need Help */}
            <motion.div 
              variants={childFadeUp}
              className="flex flex-col items-center sm:items-start justify-center gap-5 w-full lg:w-auto shrink-0 pl-0 lg:pl-4 group cursor-pointer"
            >
              <div className="flex items-center gap-[18px]">
                <motion.div 
                  whileHover={{ rotate: 10 }}
                  className="w-[60px] h-[60px] rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_4px_15px_rgba(102,51,153,0.15)] group-hover:bg-[#ebdcff]"
                >
                  <img src="/assets/icons/headphones.png" alt="Headphones" className="w-[28px] h-[28px] object-contain" />
                </motion.div>
                <div>
                  <h3 className="text-[#663399] font-bold text-[22px] leading-tight">Need Help?</h3>
                  <p className="text-[#000000] text-[15px] font-medium mt-1 max-w-[200px] leading-snug">
                    Contact Alavi Hospitals for Admission Assistance
                  </p>
                </div>
              </div>
              
              <motion.a
                whileTap={{ scale: 0.95 }}
                href="tel:+919603911911"
                className="inline-flex items-center gap-[14px] bg-white border-[1.5px] border-[#663399] rounded-[30px] px-8 py-[10px] ml-0 sm:ml-[78px] transition-all duration-300 hover:bg-[#663399] hover:shadow-[0_8px_20px_rgba(102,51,153,0.25)] group/btn"
              >
                <img 
                  src="/assets/icons/phone-purple.png" 
                  alt="Phone" 
                  className="w-5 h-5 object-contain transition-transform duration-300 group-hover/btn:brightness-0 group-hover/btn:invert" 
                />
                <span className="text-[#663399] font-semibold text-[18px] transition-colors duration-300 group-hover/btn:text-white">
                  9603 911 911
                </span>
              </motion.a>
            </motion.div>
            
          </div>
        </div>
      </motion.section>
    </div>
  );
}