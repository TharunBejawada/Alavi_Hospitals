"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const PATIENT_RIGHTS = [
  {
    title: "Right to Access Care",
    description:
      "Patients will be given impartial treatment regardless of their type of primary and associated illness, socio-economic status, age, sexual orientation, religion, caste, cultural preferences, linguistic and geographical origins, or political affiliations."
  },
  {
    title: "Right to Informed Consent",
    description:
      "You have the right to provide informed consent before blood transfusion or transfusion of blood components, anesthesia, surgery and any other invasive/high-risk procedures and understand them to make informed decisions."
  },
  {
    title: "Right to Make Informed Decisions",
    description:
      "You have the right to know the name of your treating doctor, care plan, progress and information about your healthcare needs."
  },
  {
    title: "Right to Respect & Dignity",
    description:
      "Patients will receive considerate and respectful care at all times. Privacy will be maintained during examination, procedures and treatment."
  },
  {
    title: "Right to Information",
    description: "You have the right to be educated and explained about your disease condition."
  },
  {
    title: "Right to Protection",
    description: "You have the right to receive protection from physical abuse or neglect."
  },
  {
    title: "Right to Privacy & Confidentiality",
    description: "You have the right to receive care with privacy and confidentiality."
  },
  {
    title: "Right to Pain Management",
    description: "You have the right to have your pain effectively managed."
  },
  {
    title: "Right to Safe Care",
    description: "You have the right to receive care in a safe manner."
  },
  {
    title: "Right to Medical Records",
    description: "You have the right to access, review and obtain a copy of your medical records."
  },
  {
    title: "Right to Accept or Refuse Treatment",
    description: "You have the right to accept or refuse the treatment after receiving appropriate information."
  },
  {
    title: "Right to a Second Opinion",
    description: "You have the right to ask for a second medical opinion regarding your condition or treatment."
  },
  {
    title: "Right to Know Treatment Options",
    description: "You have the right to know all your treatment options and participate in decisions about your care."
  },
  {
    title: "Right to Special Preferences",
    description:
      "You have the right to request special preferences such as spiritual needs and cultural needs, respecting values and beliefs and receiving the same within applicable hospital policies."
  },
];

const PATIENT_RESPONSIBILITIES = [
  "To provide correct and complete information to your physician.",
  "To participate in the decision-making process and understand diagnosis.",
  "To be on time for appointments and inform the hospital staff if you cannot keep your appointment.",
  "To follow advice given to you.",
  "To take medicines which are prescribed to you and finish the course of treatment.",
  "To communicate with the healthcare provider if your condition worsens or does not follow the expected course.",
  "To observe the policies and procedures of the hospital.",
  "To comply with the Visitors Policy to ensure comfort to all patients.",
  "To be considerate of noise levels, privacy and safety. Weapons are prohibited on the premises.",
  "To accept financial responsibility for the healthcare services and settle the bills promptly.",
  "You should be aware of your rights and seek clarification if required from the hospital Patient Welfare Officer.",
];

export default function PatientInformationPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[300px] flex items-center overflow-hidden bg-[#663399] font-['Inter']">
        <div className="max-w-[1453px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-6 lg:px-16 py-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[13px] font-semibold text-white/80 tracking-wide uppercase mb-2">Patient Information</p>
            <h1 className="text-[30px] md:text-[42px] font-bold text-white leading-tight mb-4 max-w-[440px]">
              Patients&rsquo; Rights &amp; Responsibilities
            </h1>
            <p className="text-[15px] md:text-[16px] font-medium text-white/90 max-w-[420px] leading-relaxed">
              At Alavi Hospitals, we are committed to providing safe, respectful, transparent and compassionate care to every patient.
            </p>
          </motion.div>
          <div className="relative w-full h-[200px] md:h-[280px]">
            <img
              src="/assets/patient-info-hero.png"
              alt="Doctor examining a patient"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* --- 2. PATIENT RIGHTS --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-16 max-w-[1200px] w-full mx-auto px-6 lg:px-12"
      >
        <div className="flex justify-center mb-12">
          <span className="bg-[#663399] text-white font-semibold text-lg px-10 py-3 rounded-full border-2 border-white shadow-md">
            Patient Rights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PATIENT_RIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[rgba(231,216,245,0.21)] border border-[#7e57a8]/60 rounded-xl p-5"
            >
              <h3 className="text-[#663399] font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-[#0A0013] text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* --- 3. PATIENT RESPONSIBILITIES --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-16 bg-[#663399]"
      >
        <div className="max-w-[1140px] w-full mx-auto px-6 lg:px-12">
          <div className="flex justify-center mb-12">
            <span className="bg-transparent text-white font-semibold text-lg px-10 py-3 rounded-full border-2 border-white">
              Patient Responsibilities
            </span>
          </div>

          <div className="space-y-6">
            {PATIENT_RESPONSIBILITIES.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <ChevronRight className="w-5 h-5 text-white shrink-0 mt-1" />
                <p className="text-white text-base md:text-lg font-medium leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
