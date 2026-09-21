"use client";

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

const VISITING_HOURS = [
  { icon: "/assets/icons/visiting-hours.png", label: "Visiting Hours", time: null },
  { icon: "/assets/icons/general-wards.png", label: "General Wards", time: "4:00 PM – 6:00 PM" },
  { icon: "/assets/icons/icu-critical-care.png", label: "ICU / Critical Care", time: "11:00 AM – 12:00 PM\n7:00 PM – 8:00 PM" },
];

const GUIDELINES = [
  { num: "01", title: "Please limit the number of visitors", desc: "A maximum of 2 visitors per patient is permitted at a time." },
  { num: "02", title: "Children's visits", desc: "Children below 12 years are discouraged from visiting, particularly in critical-care areas." },
  { num: "03", title: "Please do not visit when unwell", desc: "Visitors experiencing fever, cough, cold, flu-like symptoms or other infections are requested to postpone their visit." },
  { num: "04", title: "Help us maintain a peaceful environment", desc: "Please keep conversations quiet and avoid unnecessary disturbance around patient-care areas." },
  { num: "05", title: "Follow hand hygiene", desc: "Please clean your hands before entering and after leaving patient-care areas. Follow any additional infection-control instructions provided by our staff." },
  { num: "06", title: "Respect hospital restrictions", desc: "Outside food, flowers and other items may not be permitted in certain areas, especially ICU and isolation rooms. Please follow the instructions of the care team." },
];

const CRITICAL_CARE_RULES = [
  "One visitor may be permitted at a time.",
  "Visitors may be required to wear a mask, gown, shoe covers or other protective equipment.",
  "Please keep mobile phones on silent mode.",
  "Please keep mobile phones on silent mode.",
  "Do not touch medical equipment, lines, tubes or monitors.",
  "Follow all instructions provided by doctors and nurses.",
  "Visits may be temporarily restricted when clinically necessary.",
];

const PLEASE_DO = [
  "Follow staff instructions",
  "Maintain hand hygiene",
  "Keep your phone on silent",
  "Respect patient privacy",
  "Keep patient areas quiet",
  "Use designated waiting areas",
];

const PLEASE_AVOID = [
  "Visiting when you are unwell",
  "Bringing unauthorised food or items",
  "Touching medical equipment",
  "Taking photographs without permission",
  "Creating unnecessary noise",
  "Entering restricted areas",
];

export default function VisitorGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white font-['Inter']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full h-[440px] bg-[#663399] flex items-center overflow-hidden">
        {/* Left Side Image & Gradient Mask */}
        <div className="absolute top-0 left-0 w-full lg:w-[65%] h-full z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="/assets/images/hero-patient.png"
            alt="Family visiting a patient"
            className="w-full h-full object-cover object-left"
          />
          {/* Gradient fading to the right side purple color */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#663399]/60 to-[#663399]" />
        </div>

        {/* Right Side Text Content */}
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-[154px] relative z-10 flex justify-end">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="max-w-[536px] flex flex-col"
          >
            <h1 className="text-[36px] md:text-[48px] font-bold text-white leading-[1.15] mb-[20px]">
              Visitor Guidelines
            </h1>
            <p className="text-[20px] md:text-[24px] font-semibold text-white mb-[16px]">
              Visiting with care, for everyone&rsquo;s comfort
            </p>
            <p className="text-[16px] md:text-[18px] font-medium text-white leading-[1.4]">
              We welcome families and loved ones to be part of a patient&rsquo;s care. Our visitor guidelines help maintain a safe, peaceful and comfortable environment for patients, families and healthcare teams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- 2. VISITING HOURS STRIP --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="max-w-[1440px] w-full mx-auto px-6 lg:px-[147px] mt-[60px] relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VISITING_HOURS.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={childFadeUp}
              whileHover={{ y: -6 }}
              className="bg-[#FCF9FF] rounded-[8px] px-[30px] py-[30px] flex items-center gap-5 min-h-[120px] shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_25px_rgba(102,51,153,0.12)] transition-shadow duration-300 cursor-default"
            >
              <div className="w-[48px] h-[48px] flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110">
                <img src={item.icon} alt={item.label} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#663399] font-bold text-[19px] leading-tight mb-1">{item.label}</p>
                {item.time && (
                  <p className="text-[#000000] font-semibold text-[14px] whitespace-pre-line leading-snug">{item.time}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div variants={childFadeUp} className="flex items-center justify-center mt-6 gap-2">
          <img src="/assets/icons/info-purple.png" alt="Info" className="w-[18px] h-[18px] shrink-0" />
          <p className="text-[#000204] text-[12px] leading-[1.48]">
            Visiting hours may vary depending on the patient&rsquo;s condition and the advice of the treating team.
          </p>
        </motion.div>
      </motion.section>

      {/* --- 3. VISITOR GUIDELINES GRID --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="pt-[70px] pb-24 max-w-[1440px] w-full mx-auto px-6 lg:px-[154px]"
      >
        <motion.h2 variants={childFadeUp} className="text-[#663399] font-bold text-[30px] leading-[1.39] text-left mb-10">
          Visitor Guidelines
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {GUIDELINES.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={childFadeUp}
              whileHover={{ y: -8 }}
              className="bg-[#EEF8FF] rounded-[6px] p-[26px] pt-8 relative min-h-[220px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-default group"
            >
              <div className="text-[34px] font-bold text-[#663399]/[0.16] leading-[1.39] mb-1 transition-colors duration-300 group-hover:text-[#663399]/[0.25]">{item.num}</div>
              <h3 className="text-[#663399] font-semibold text-[16px] leading-[1.39] mb-3">{item.title}</h3>
              <p className="text-[#000000] text-[14px] font-normal leading-[1.42]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* --- 4. ICU / CRITICAL CARE VISITS --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="w-full bg-[#EEF8FF] py-14 mb-[90px]"
      >
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-[154px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[72px] gap-y-12">
            <motion.div variants={childFadeUp}>
              <h2 className="text-[#663399] font-bold text-[28px] leading-[1.39] mb-5">ICU, NICU &amp; Critical Care Visits</h2>
              <p className="text-[#000000] text-[18px] font-normal leading-[1.42] mb-6">
                Patients receiving critical care need rest, close monitoring and minimal disturbance. Visits to the ICU, NICU and other critical-care areas may therefore be restricted and are generally limited to immediate family members.
              </p>
              <p className="text-[#000000] text-[18px] font-normal leading-[1.42] mb-10">
                Visiting may also depend on the patient&rsquo;s medical condition and the treating team&rsquo;s advice.
              </p>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-[#FFFFFF] rounded-[12px] p-6 flex items-center gap-4 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer"
              >
                <div className="w-[52px] h-[52px] shrink-0">
                  <img src="/assets/icons/chat-purple.png" alt="Chat" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-[#663399] font-bold text-[14px] mb-1">Need an update outside visiting hours?</p>
                  <p className="text-[#000000] text-[12px] leading-relaxed">
                    For information about a patient&rsquo;s condition outside visiting hours, please contact the nursing station or patient helpdesk. Our team will guide you appropriately.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={childFadeUp}>
              <h3 className="text-[#663399] font-bold text-[26px] leading-[1.39] mb-6 lg:mt-1">During critical-care visits:</h3>
              <ul className="space-y-[18px]">
                {CRITICAL_CARE_RULES.map((rule, idx) => (
                  <motion.li 
                    key={idx} 
                    variants={childFadeUp}
                    className="flex items-start gap-4 group"
                  >
                    <img src="/assets/icons/triangle-bullet.png" alt="bullet" className="w-[14px] h-[14px] shrink-0 mt-1 transition-transform duration-300 group-hover:translate-x-1" />
                    <span className="text-[#000000] text-[16px] font-normal leading-[1.42] transition-transform duration-300 group-hover:translate-x-1">{rule}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- 5. DURING YOUR VISIT --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="max-w-[1440px] w-full mx-auto px-6 lg:px-[154px] mb-20"
      >
        <motion.h2 variants={childFadeUp} className="text-[#663399] font-bold text-[28px] leading-[1.39] text-center mb-12">
          During Your Visit
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[75px]">
          <motion.div 
            variants={childFadeUp}
            whileHover={{ y: -6 }}
            className="bg-[#663399] rounded-[20px] p-[46px] min-h-[378px] hover:shadow-[0_15px_30px_rgba(102,51,153,0.25)] transition-all duration-300"
          >
            <h3 className="text-white font-bold text-[26px] mb-8 inline-block border-b-2 border-white/50 pb-1">Please Do</h3>
            <ul className="space-y-5">
              {PLEASE_DO.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-white text-[18px] group">
                  <span className="w-2 h-2 rounded-full bg-white shrink-0 transition-transform duration-300 group-hover:scale-150" />
                  <span className="transition-transform duration-300 group-hover:translate-x-2">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            variants={childFadeUp}
            whileHover={{ y: -6 }}
            className="bg-[#EEF8FF] rounded-[20px] p-[46px] min-h-[378px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <h3 className="text-[#663399] font-bold text-[26px] mb-8">Please Avoid</h3>
            <ul className="space-y-5">
              {PLEASE_AVOID.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-[#000000] text-[18px] group">
                  <span className="w-2 h-2 rounded-full bg-[#663399] shrink-0 transition-transform duration-300 group-hover:scale-150" />
                  <span className="transition-transform duration-300 group-hover:translate-x-2">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* --- 6. NEED HELP --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-14 max-w-[1440px] w-full mx-auto px-6 lg:px-[154px]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[75px]">
          
          {/* Left Column */}
          <motion.div variants={childFadeUp} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left group cursor-pointer">
            <div className="w-[100px] h-[100px] rounded-full bg-[#F7EFFF] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#f0e1ff] group-hover:shadow-[0_8px_20px_rgba(102,51,153,0.15)]">
              <img src="/assets/icons/headphones.png" alt="Support" className="w-[46px] h-[46px] object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-col gap-2 pt-1 transition-transform duration-300 group-hover:-translate-y-1">
              <h2 className="text-[#663399] font-bold text-[28px] leading-[1.39] mb-1">Need Help?</h2>
              <p className="text-[#000000] text-[15px] font-normal leading-[1.45]">
                We&rsquo;re here to make your visit as comfortable as possible.
              </p>
              <p className="text-[#000000] font-semibold text-[15px] leading-[1.45] mt-1">
                For urgent assistance, please contact our hospital team immediately.
              </p>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={childFadeUp} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left group">
            <div className="w-[100px] h-[100px] rounded-full bg-[#F7EFFF] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#f0e1ff] group-hover:shadow-[0_8px_20px_rgba(102,51,153,0.15)]">
              <img src="/assets/icons/team.png" alt="Team" className="w-[52px] h-[52px] object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center h-[100px] transition-transform duration-300 group-hover:-translate-y-1">
              <p className="text-[#000000] font-semibold text-[15px] leading-[1.45]">
                Thank you for helping us create a safe and caring environment for every patient.
              </p>
            </div>
          </motion.div>

        </div>
      </motion.section>
    </div>
  );
}