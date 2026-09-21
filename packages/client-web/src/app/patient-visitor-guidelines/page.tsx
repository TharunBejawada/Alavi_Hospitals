"use client";

import { motion } from "framer-motion";
import { Clock, BedDouble, HeartPulse, MessageCircle, Headphones, Users, Info } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const VISITING_HOURS = [
  { icon: Clock, label: "Visiting Hours", time: null },
  { icon: BedDouble, label: "General Wards", time: "4:00 PM – 6:00 PM" },
  { icon: HeartPulse, label: "ICU / Critical Care", time: "11:00 AM – 12:00 PM\n7:00 PM – 8:00 PM" },
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
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[420px] lg:h-[500px] flex items-center overflow-hidden bg-[#663399] font-['Inter']">
        <div className="absolute top-0 right-0 w-full lg:w-[75%] h-full z-0 opacity-20 lg:opacity-100">
          <img
            src="/assets/patient-info-hero.png"
            alt="Family visiting a patient"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#663399] via-[#663399]/70 to-transparent" />
        </div>

        <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
        className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 -mt-10 lg:-mt-14 relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VISITING_HOURS.map((item, idx) => (
            <div key={idx} className="bg-[#FCF9FF] rounded-[10px] shadow-sm px-6 py-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#663399]/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-[#663399]" />
              </div>
              <div>
                <p className="text-[#663399] font-semibold text-[19px] leading-tight">{item.label}</p>
                {item.time && (
                  <p className="text-black font-medium text-[15px] whitespace-pre-line leading-snug mt-1">{item.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-center mt-4 text-[13px] text-black/70">
          <Info className="w-4 h-4 text-[#663399] shrink-0" />
          <p>Visiting hours may vary depending on the patient&rsquo;s condition and the advice of the treating team.</p>
        </div>
      </motion.section>

      {/* --- 3. VISITOR GUIDELINES GRID --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-16 max-w-[1453px] w-full mx-auto px-6 lg:px-16"
      >
        <h2 className="text-[#663399] font-bold text-[28px] mb-8">Visitor Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDELINES.map((item, idx) => (
            <div key={idx} className="bg-[#EEF8FF] rounded-md shadow-sm p-6 relative overflow-hidden">
              <span className="text-[32px] font-bold text-[#663399]/15 leading-none">{item.num}</span>
              <h3 className="text-[#663399] font-semibold text-[16px] mt-3 mb-2">{item.title}</h3>
              <p className="text-black text-[14px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* --- 4. ICU / CRITICAL CARE VISITS --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="bg-[#EEF8FF] py-16"
      >
        <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-[#663399] font-bold text-[26px] mb-5">ICU, NICU &amp; Critical Care Visits</h2>
            <p className="text-black text-[16px] leading-relaxed mb-4">
              Patients receiving critical care need rest, close monitoring and minimal disturbance. Visits to the ICU, NICU and other critical-care areas may therefore be restricted and are generally limited to immediate family members.
            </p>
            <p className="text-black text-[16px] leading-relaxed mb-6">
              Visiting may also depend on the patient&rsquo;s medical condition and the treating team&rsquo;s advice.
            </p>
            <div className="bg-white rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-[#663399] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[#663399] font-semibold text-[15px] mb-1">Need an update outside visiting hours?</p>
                <p className="text-black text-[13px] leading-relaxed">
                  For information about a patient&rsquo;s condition outside visiting hours, please contact the nursing station or patient helpdesk. Our team will guide you appropriately.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#663399] font-bold text-[21px] mb-5">During critical-care visits:</h3>
            <ul className="space-y-3">
              {CRITICAL_CARE_RULES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-[2px] bg-[#663399] rotate-45 shrink-0 mt-2" />
                  <span className="text-black text-[16px] leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* --- 5. DURING YOUR VISIT --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-16 max-w-[1453px] w-full mx-auto px-6 lg:px-16"
      >
        <h2 className="text-[#663399] font-bold text-[28px] text-center mb-10">During Your Visit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#663399] rounded-[20px] p-8">
            <h3 className="text-white font-bold text-[22px] mb-5 underline decoration-white/40 underline-offset-8">Please Do</h3>
            <ul className="space-y-3">
              {PLEASE_DO.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white text-[16px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#EEF8FF] rounded-[20px] p-8">
            <h3 className="text-[#663399] font-bold text-[22px] mb-5">Please Avoid</h3>
            <ul className="space-y-3">
              {PLEASE_AVOID.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-black text-[16px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#663399] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* --- 6. NEED HELP --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="pb-20 max-w-[1453px] w-full mx-auto px-6 lg:px-16"
      >
        <h2 className="text-[#663399] font-bold text-[28px] text-center mb-10">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[900px] mx-auto">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-[100px] h-[100px] rounded-full bg-[#F3E8FF] flex items-center justify-center">
              <Headphones className="w-9 h-9 text-[#663399]" />
            </div>
            <p className="text-black font-medium text-[16px]">We&rsquo;re here to make your visit as comfortable as possible.</p>
            <p className="text-black font-medium text-[18px]">For urgent assistance, please contact our hospital team immediately.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-[100px] h-[100px] rounded-full bg-[#F3E8FF] flex items-center justify-center">
              <Users className="w-9 h-9 text-[#663399]" />
            </div>
            <p className="text-black font-medium text-[18px]">Thank you for helping us create a safe and caring environment for every patient.</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
