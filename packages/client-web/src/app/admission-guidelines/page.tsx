"use client";

import { motion } from "framer-motion";
import { IdCard, ClipboardList, FileText, Pill, ShieldCheck, Phone, Headphones } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const ADMISSION_STEPS = [
  { step: "Step 01", title: "Doctor's Advice", desc: "Your doctor will recommend hospital admission based on your medical condition and treatment requirements." },
  { step: "Step 02", title: "Registration", desc: "Visit our Admission Desk with your admission advice and required identification documents." },
  { step: "Step 03", title: "Documentation", desc: "Your doctor will recommend hospital admission based on your medical condition and treatment requirements." },
  { step: "Step 04", title: "Room & Billing", desc: "Our team will assist you with room allocation, admission charges, insurance formalities and payment requirements." },
  { step: "Step 05", title: "Admission", desc: "Once the formalities are completed, you will be guided to your allocated room and introduced to the nursing and support team." },
];

const DOCUMENTS = [
  { icon: IdCard, label: "Government-issued ID proof" },
  { icon: ClipboardList, label: "Doctor's admission advice" },
  { icon: FileText, label: "Previous medical reports" },
  { icon: Pill, label: "Current prescriptions" },
  { icon: ShieldCheck, label: "Insurance/TPA documents, if applicable" },
];

export default function AdmissionGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[380px] lg:h-[420px] flex items-center overflow-hidden bg-[#663399] font-['Inter']">
        <div className="absolute top-0 right-0 w-full lg:w-[75%] h-full z-0 opacity-20 lg:opacity-100">
          <img
            src="/contact-reception.png"
            alt="Hospital admission desk"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#663399] via-[#663399]/70 to-transparent" />
        </div>

        <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[520px] flex flex-col"
          >
            <span className="inline-block bg-white text-[#663399] font-semibold text-[16px] px-6 py-2.5 rounded-full w-fit mb-5">
              Your Admission, Made Simple
            </span>
            <p className="text-[20px] md:text-[24px] font-semibold text-white leading-[1.4]">
              At Alavi Hospitals, we make the admission process smooth and hassle-free.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- 2. ADMISSION PROCESS --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-16 max-w-[1453px] w-full mx-auto px-6 lg:px-16"
      >
        <div className="bg-[#F6FBFF] rounded-xl p-8 lg:p-14">
          <h2 className="text-[#663399] font-bold text-[26px] text-center mb-3">Admission Process</h2>
          <p className="text-black text-[18px] text-center max-w-[661px] mx-auto mb-12">
            Our team will guide you through each step and assist you with the necessary formalities.
          </p>

          <div className="max-w-[900px] mx-auto space-y-0">
            {ADMISSION_STEPS.map((item, idx) => (
              <div key={idx} className="flex gap-6 lg:gap-10">
                <div className="flex flex-col items-center shrink-0 w-[90px] lg:w-[110px]">
                  <span className="text-black/70 font-medium text-[15px] mb-2">{item.step}</span>
                  <span className={`w-6 h-6 rounded-full border-4 ${idx < 2 ? "bg-[#663399] border-[#663399]" : "bg-white border-[#663399]/40"}`} />
                  {idx < ADMISSION_STEPS.length - 1 && (
                    <span className="w-[2px] flex-1 bg-[#663399]/25 my-1 min-h-[70px]" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className={`font-semibold text-[20px] mb-2 ${idx < 2 ? "text-[#663399]" : "text-black"}`}>{item.title}</h3>
                  <p className="text-black text-[16px] leading-relaxed max-w-[700px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- 3. DOCUMENTS TO CARRY --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="bg-[#663399] py-14"
      >
        <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16">
          <h2 className="text-white font-bold text-[26px] text-center mb-10">Documents to Carry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {DOCUMENTS.map((doc, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
                  <doc.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-[15px] leading-snug">{doc.label}</p>
              </div>
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
        className="bg-[#EEF8FF]"
      >
        <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 py-14 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto_1fr] gap-10 items-center">
          <div className="w-full lg:w-[280px] h-[220px] rounded-xl overflow-hidden shrink-0">
            <img src="/doctor-consultation.png" alt="Emergency admission team" className="w-full h-full object-cover" />
          </div>

          <div>
            <h3 className="text-[#663399] font-bold text-[24px] mb-3">Emergency Admission</h3>
            <p className="text-black text-[16px] font-medium mb-3">
              In an emergency, immediate medical care takes priority.
            </p>
            <p className="text-black text-[14px] leading-relaxed">
              Please proceed directly to our Emergency Department. Our medical team will assess the patient and provide the required care while our staff assists with the necessary admission formalities.
            </p>
          </div>

          <div className="hidden lg:block w-[2px] h-[150px] bg-[#663399]/20" />

          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[60px] h-[60px] rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6 text-[#663399]" />
              </div>
              <div>
                <h3 className="text-[#663399] font-bold text-[22px]">Need Help?</h3>
                <p className="text-black text-[16px] font-medium">Contact Alavi Hospitals for Admission Assistance</p>
              </div>
            </div>
            <a
              href="tel:+919603911911"
              className="inline-flex items-center gap-3 bg-white border border-[#663399] rounded-full px-8 py-3 text-[#663399] font-semibold text-[18px] shadow-sm hover:bg-[#663399] hover:text-white transition-colors"
            >
              <Phone className="w-5 h-5" />
              9603 911 911
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
