"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Calendar, Phone, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { API_URL } from "../../config";
import WhyChooseUs from "../home/WhyChooseUs";
import type { Treatment } from "../../../../core/src/types";

const FAQItem = ({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) => (
  <div className="rounded-xl overflow-hidden mb-4 shadow-sm">
    <button onClick={onClick} className="w-full flex justify-between items-center p-5 text-left bg-[#663399] transition-colors duration-300">
      <span className="font-semibold text-[16px] text-white pr-4">{question}</span>
      <ChevronDown className={`w-5 h-5 shrink-0 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden bg-white"
        >
          <div
            className="p-5 text-[14px] font-medium leading-[160%] text-[#012B4E] border-x border-b border-gray-200 rounded-b-xl"
            dangerouslySetInnerHTML={{ __html: answer.replace(/&nbsp;/g, " ") }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function TreatmentDetailClient({ treatment }: { treatment: Treatment }) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Hero quick-lead form
  const [heroName, setHeroName] = useState("");
  const [heroMobile, setHeroMobile] = useState("");
  const [isSubmittingHero, setIsSubmittingHero] = useState(false);

  const submitLead = async (name: string, mobile: string, concern: string, page: string) => {
    await axios.post(`${API_URL}/api/forms/submit`, {
      name,
      mobile,
      message: concern ? `Concern: ${concern}` : "No concern specified",
      speciality: treatment.specialityName,
      page
    });
    const query = new URLSearchParams({ name, mobile, department: treatment.specialityName }).toString();
    router.push(`/thank-you?${query}`);
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim() || !heroMobile.trim()) return;
    setIsSubmittingHero(true);
    try {
      await submitLead(heroName, heroMobile, "", `Treatment Page - ${treatment.title}`);
    } catch (error) {
      console.error("Failed to submit lead:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmittingHero(false);
    }
  };

  // Bottom consultation form
  const [formData, setFormData] = useState({ name: "", mobile: "", concern: "" });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) return;
    setIsSubmittingForm(true);
    try {
      await submitLead(formData.name, formData.mobile, formData.concern, `Treatment Page - ${treatment.title}`);
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Something went wrong while booking. Please try again or call us directly.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="font-['Poppins'] min-h-screen bg-white pb-20">

      {/* --- 1. HERO --- */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pt-10">
        <div className="bg-[#F4FAFF] border-2 border-[#663399] rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            {treatment.badgeLabel && (
              <span className="inline-block bg-[#663399] text-white font-bold text-base md:text-lg px-6 py-3 rounded-full mb-6">
                {treatment.badgeLabel}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#0066A9] leading-tight mb-4">
              {treatment.title}
            </h1>
            {treatment.subtitle && (
              <p className="text-base md:text-lg text-[#012B4E] font-medium max-w-xl">{treatment.subtitle}</p>
            )}
          </div>

          <div className="w-full md:w-[380px] bg-[#DFF2FF] rounded-2xl p-6 shrink-0">
            <h3 className="font-bold text-[#663399] text-xl mb-4">Book an Appointment</h3>
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="Name"
                required
                className="w-full h-[48px] bg-white border-[0.5px] border-black/40 rounded-[8px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/40 transition-all"
              />
              <input
                type="tel"
                value={heroMobile}
                onChange={(e) => setHeroMobile(e.target.value)}
                placeholder="Mobile Number"
                required
                className="w-full h-[48px] bg-white border-[0.5px] border-black/40 rounded-[8px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/40 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmittingHero}
                className="w-full h-[48px] bg-[#663399] text-white font-bold rounded-[8px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSubmittingHero ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- 2. OVERVIEW --- */}
      {treatment.overview?.title && (
        <section className="py-16 max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-6">{treatment.overview.title}</h2>
              <div
                className="text-[#012B4E] text-base md:text-lg leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: (treatment.overview.description || "").replace(/&nbsp;/g, " ") }}
              />
            </div>
            {treatment.overview.image && (
              <div className="relative w-full lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
                <Image src={treatment.overview.image} alt={treatment.overview.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- 3. CAUSES + SYMPTOMS --- */}
      {(treatment.causes?.list?.length > 0 || treatment.symptoms?.list?.length > 0) && (
        <section className="py-16 bg-[#663399]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10">
            {treatment.causes?.list?.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{treatment.causes.title}</h2>
                {treatment.causes.description && (
                  <div
                    className="text-white/90 mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: treatment.causes.description.replace(/&nbsp;/g, " ") }}
                  />
                )}
                <div className="space-y-6">
                  {treatment.causes.list.map((item, idx) => (
                    <div key={item.id ?? idx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#AFD0EC] shrink-0 mt-1"></div>
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                        <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {treatment.symptoms?.list?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 h-fit">
                <h3 className="text-xl md:text-2xl font-bold text-[#663399] mb-6">
                  {treatment.symptoms.title || "Common Signs & Symptoms"}
                </h3>
                <ul className="space-y-4">
                  {treatment.symptoms.list.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[#663399] font-semibold">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-[#663399]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- 4. MID CTA --- */}
      {treatment.ctaText && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 -mt-8 relative z-10">
          <div className="bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-xl">
            <p className="text-base md:text-lg font-medium max-w-2xl">{treatment.ctaText}</p>
            <div className="flex gap-4 shrink-0">
              <a href="tel:+919603911911">
                <button className="bg-white text-[#663399] font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap">
                  <Phone className="w-4 h-4" /> Call Now
                </button>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* --- 5. DIAGNOSIS --- */}
      {treatment.diagnosis?.list?.length > 0 && (
        <section className="py-16 max-w-[1440px] mx-auto px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4">{treatment.diagnosis.title}</h2>
          {treatment.diagnosis.description && (
            <div
              className="text-[#023D6E] max-w-3xl mx-auto mb-12 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: treatment.diagnosis.description.replace(/&nbsp;/g, " ") }}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {treatment.diagnosis.list.map((item, idx) => (
              <div key={item.id ?? idx} className="bg-[#DFF2FF] rounded-2xl p-6">
                <h3 className="font-bold text-[#663399] text-lg mb-2">{item.title}</h3>
                <p className="text-[#023D6E] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- 6. TREATMENT OPTIONS --- */}
      {treatment.treatmentOptions?.list?.length > 0 && (
        <section className="py-16 bg-[#F5F8FC]">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 text-center">
            <p className="text-[#663399] font-bold tracking-wide mb-2">TREATMENT OPTIONS</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0066A9] mb-4">{treatment.treatmentOptions.title}</h2>
            {treatment.treatmentOptions.description && (
              <div
                className="text-[#023D6E] max-w-3xl mx-auto mb-12 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: treatment.treatmentOptions.description.replace(/&nbsp;/g, " ") }}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
              {treatment.treatmentOptions.list.map((item, idx) => (
                <div key={item.id ?? idx} className="bg-[#663399] rounded-2xl p-6 text-white flex flex-col">
                  {item.image && (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                  <p className="text-white/80 text-xs leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- 7. WHY CHOOSE ALAVI HOSPITALS --- */}
      <WhyChooseUs />

      {/* --- 8. CONSULTATION CTA --- */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row shadow-xl rounded-[32px] overflow-hidden border-0 bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)]">
            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center text-white">
              <div className="bg-[rgba(231,216,245,0.21)] w-fit px-5 py-2.5 rounded-[22px] flex items-center gap-2 mb-8">
                <Calendar className="w-4 h-4 text-white" />
                <span className="font-semibold text-[14px] text-white">Book an Appointment</span>
              </div>
              <h2 className="font-semibold text-[28px] leading-[42px] text-white mb-6">
                Take the first step toward<br />better {treatment.itemTitle} care.
              </h2>
              <p className="font-medium text-[16px] leading-[170%] text-white mb-6 max-w-md">
                Share your details and our care team will reach out to confirm your consultation with a specialist.
              </p>
            </div>

            <div className="lg:w-1/2 bg-[#EEF8FF] p-10 lg:p-16 flex flex-col justify-center">
              <h3 className="font-semibold text-[22px] text-[#663399] mb-2">Patient Details</h3>
              <form className="space-y-6" onSubmit={handleConsultationSubmit}>
                <div>
                  <label className="block font-semibold text-[16px] text-[#250F3C] mb-2 ml-4">Patient Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter Your Full Name"
                    className="w-full bg-white px-6 py-4 rounded-[30px] shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#5B328C]/50 transition-all text-[#250F3C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[16px] text-[#250F3C] mb-2 ml-4">Mobile Number*</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10 - digit mobile number"
                    className="w-full bg-white px-6 py-4 rounded-[30px] shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#5B328C]/50 transition-all text-[#250F3C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[16px] text-[#250F3C] mb-2 ml-4">Concern</label>
                  <input
                    type="text"
                    value={formData.concern}
                    onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                    placeholder="Describe your concern"
                    className="w-full bg-white px-6 py-4 rounded-[30px] shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#5B328C]/50 transition-all text-[#250F3C]"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingForm || !formData.name || !formData.mobile}
                    className="mx-auto w-full md:w-auto bg-[linear-gradient(90deg,#0066A9_0%,#663399_100%)] text-white font-semibold text-[18px] py-3.5 px-10 rounded-[32px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingForm ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" /> Book an Appointment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- 9. FAQS --- */}
      {treatment.faqs?.length > 0 && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-[1000px] w-full mx-auto px-6 md:px-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#663399] mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {treatment.faqs.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === idx}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
