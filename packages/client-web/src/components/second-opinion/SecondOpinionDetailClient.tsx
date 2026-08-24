"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Calendar, Phone, ChevronDown, ArrowRight, Loader2, Paperclip } from "lucide-react";
import { API_URL } from "../../config";
import type { SecondOpinionTopic } from "../../../../core/src/types";

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

type RequestFormState = { name: string; mobile: string; email: string; message: string; fileUrl: string; fileName: string };
const emptyRequestForm = (): RequestFormState => ({ name: "", mobile: "", email: "", message: "", fileUrl: "", fileName: "" });

export default function SecondOpinionDetailClient({ topic }: { topic: SecondOpinionTopic }) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [heroForm, setHeroForm] = useState<RequestFormState>(emptyRequestForm());
  const [bottomForm, setBottomForm] = useState<RequestFormState>(emptyRequestForm());
  const [isSubmittingHero, setIsSubmittingHero] = useState(false);
  const [isSubmittingBottom, setIsSubmittingBottom] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingBottom, setIsUploadingBottom] = useState(false);

  const uploadReport = async (file: File, setter: React.Dispatch<React.SetStateAction<RequestFormState>>, setUploading: (v: boolean) => void) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${API_URL}/api/second-opinions/uploadReport`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setter(prev => ({ ...prev, fileUrl: res.data.fileUrl, fileName: file.name }));
    } catch (error) {
      console.error("Report upload failed:", error);
      alert("Failed to upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const submitRequest = async (
    form: RequestFormState,
    setSubmitting: (v: boolean) => void,
    resetForm: () => void
  ) => {
    if (!form.name.trim() || !form.mobile.trim()) return;
    setSubmitting(true);
    try {
      const message = [
        form.message.trim(),
        form.fileUrl ? `Uploaded Medical Report: ${form.fileUrl}` : ""
      ].filter(Boolean).join("\n\n");

      await axios.post(`${API_URL}/api/forms/submit`, {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        message: message || "No additional details provided",
        page: `Second Opinion - ${topic.title}`
      });

      const query = new URLSearchParams({ name: form.name, mobile: form.mobile, department: topic.title }).toString();
      resetForm();
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const risksList = topic.risks?.list || [];
  const stepsList = topic.steps || [];

  return (
    <div className="font-['Poppins'] min-h-screen bg-white pb-20">

      {/* --- 1. HERO --- */}
    <section className="relative w-full h-auto min-h-[460px] md:h-[460px] flex items-center overflow-hidden bg-[#663399] font-['Inter'] py-10 md:py-0">
      
      {/* Background Image (Left Aligned) */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[80%] h-full">
        {topic?.heroImage ? (
          <Image src={topic.heroImage} alt={topic.title || "Hero Background"} fill className="object-cover" priority />
        ) : (
          <img src="/assets/hero-bg.png" alt="Doctors" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Specific Figma Gradient Overlay (Fades image to solid purple on the right) */}
      <div 
        className="absolute inset-0" 
        style={{ background: 'linear-gradient(90deg, rgba(102, 51, 153, 0) 35.21%, #663399 48.79%, #663399 100%)' }} 
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-[1453px] w-full h-full mx-auto flex flex-col md:flex-row items-center justify-end px-6 lg:px-[120px] gap-12 lg:gap-[100px]">
        
        {/* Left/Middle Content: Text and Button */}
        <div className="w-full max-w-[285px]">
          <h1 className="text-[26px] font-extrabold text-white leading-[145%] tracking-[0.01em] mb-6">
            {topic?.heroHeading || "Already advised hernia surgery?\nGet an expert second opinion before you decide."}
          </h1>
          
          <a href="tel:+919603911911" className="inline-block">
            <button className="w-[190.55px] h-[48px] border-[2px] border-white text-white font-semibold text-[18px] leading-[145%] tracking-[0.02em] rounded-[31.7px] flex items-center justify-center gap-3 hover:bg-white/10 transition-colors shadow-[4px_6px_4px_-4px_rgba(0,44,75,0.24)]">
              {/* Phone SVG matched to the solid design */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Call Now
            </button>
          </a>
        </div>

        {/* Right Content: The Form */}
        <div className="w-[342px] bg-white rounded-[11px] p-[19px] shrink-0 shadow-xl">
          <form
              onSubmit={(e) => { e.preventDefault(); submitRequest(heroForm, setIsSubmittingHero, () => setHeroForm(emptyRequestForm())); }}
              className="flex flex-col gap-[8px]"
            >
              {/* Name Input */}
              <div>
                <label className="block text-[9px] font-medium text-[#000000] leading-[145%] mb-[2px]">Name:</label>
                <input 
                  type="text" 
                  value={heroForm.name} 
                  onChange={(e) => setHeroForm(f => ({ ...f, name: e.target.value }))} 
                  required
                  // FIX: text-[#000000] added so typed text is distinctly black
                  className="w-full h-[24.82px] bg-white border-[0.75px] border-[#663399] rounded-[5px] px-2 text-[10px] text-[#000000] outline-none focus:ring-1 focus:ring-[#663399]/50" 
                />
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="block text-[9px] font-medium text-[#000000] leading-[145%] mb-[2px]">Mobile Number :</label>
                <input 
                  type="tel" 
                  value={heroForm.mobile} 
                  onChange={(e) => setHeroForm(f => ({ ...f, mobile: e.target.value }))} 
                  required
                  // FIX: text-[#000000] added
                  className="w-full h-[24.82px] bg-white border-[0.75px] border-[#663399] rounded-[5px] px-2 text-[10px] text-[#000000] outline-none focus:ring-1 focus:ring-[#663399]/50" 
                />
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-[9px] font-medium text-[#000000] leading-[145%] mb-[2px]">Email Address:</label>
                <input 
                  type="email" 
                  value={heroForm.email} 
                  onChange={(e) => setHeroForm(f => ({ ...f, email: e.target.value }))} 
                  // FIX: text-[#000000] added
                  className="w-full h-[24.82px] bg-white border-[0.75px] border-[#663399] rounded-[5px] px-2 text-[10px] text-[#000000] outline-none focus:ring-1 focus:ring-[#663399]/50" 
                />
              </div>

              {/* Upload Medical Reports Custom Input */}
              <div>
                <label className="block text-[9px] font-medium text-[#000000] leading-[145%] mb-[2px]">Upload Medical Reports :</label>
                <label className="w-full h-[24.82px] bg-white border-[0.75px] border-[#663399] rounded-[5px] px-[4px] flex items-center gap-[6px] cursor-pointer focus-within:ring-1 focus-within:ring-[#663399]/50">
                  <div className="w-[60.71px] h-[13.69px] bg-[#E7DEF0] border-[0.5px] border-[#000000] rounded-[5px] flex items-center justify-center shrink-0 hover:bg-[#d8cce4] transition-colors">
                    <span className="text-[6px] font-semibold text-[#000000] leading-[145%]">Choose File</span>
                  </div>
                  {/* FIX: Changed from text-gray-500 to text-[#000000] for better visibility */}
                  <span className="text-[8px] text-[#000000] truncate flex-1 leading-none mt-[1px]">
                    {isUploadingHero ? "Uploading..." : heroForm.fileName || "No file chosen"}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadReport(f, setHeroForm, setIsUploadingHero); }} 
                  />
                </label>
              </div>

              {/* Message Textarea */}
              <div>
                <label className="block text-[9px] font-medium text-[#000000] leading-[145%] mb-[2px]">Message :</label>
                <textarea 
                  value={heroForm.message} 
                  onChange={(e) => setHeroForm(f => ({ ...f, message: e.target.value }))} 
                  rows={2}
                  // FIX: text-[#000000] added
                  className="w-full h-[45.93px] bg-white border-[0.75px] border-[#663399] rounded-[5px] px-2 py-1 text-[10px] text-[#000000] outline-none focus:ring-1 focus:ring-[#663399]/50 resize-none" 
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmittingHero} 
                className="w-full h-[28.58px] bg-[#663399] text-[#FFFFFF] font-semibold text-[12px] leading-[145%] rounded-[5px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 mt-[2px]"
              >
                {isSubmittingHero ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request a Second Opinion"}
              </button>
              
            </form>
        </div>

      </div>
    </section>

      {/* --- 2. OVERVIEW --- */}
      {topic.overview?.title && (
        <section className="py-16 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-6">{topic.overview.title}</h2>
              <div
                className="text-[#012B4E] text-base md:text-lg leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: (topic.overview.description || "").replace(/&nbsp;/g, " ") }}
              />
            </div>
            {topic.overview.image && (
              <div className="relative w-full lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden border-4 border-[#663399] shrink-0">
                <Image src={topic.overview.image} alt={topic.overview.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- 3. SURGERY RECOMMENDATION --- */}
      {topic.surgeryRecommendation?.title && (
        <section className="py-16 bg-[#F5FBFF]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-6">{topic.surgeryRecommendation.title}</h2>
            {topic.surgeryRecommendation.description && (
              <div
                className="text-[#012B4E] text-base md:text-lg leading-relaxed mb-8 max-w-4xl"
                dangerouslySetInnerHTML={{ __html: topic.surgeryRecommendation.description.replace(/&nbsp;/g, " ") }}
              />
            )}
            {topic.surgeryRecommendation.listIntro && (
              <p className="font-bold text-[#012B4E] text-lg mb-5">{topic.surgeryRecommendation.listIntro}</p>
            )}
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 mb-8">
              {(topic.surgeryRecommendation.list || []).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 mt-1 text-[#663399] shrink-0" />
                  <span className="text-[#012B4E] font-semibold text-lg">{item}</span>
                </div>
              ))}
            </div>
            {topic.surgeryRecommendation.note && (
              <p className="text-[#012B4E] font-semibold text-lg max-w-4xl">{topic.surgeryRecommendation.note}</p>
            )}
          </div>
        </section>
      )}

      {/* --- 4. MID CTA --- */}
      <section className="w-full flex justify-center bg-white font-['Inter']">
      {/* Container - Fixed 1440px width bounded */}
      <div className="relative w-full h-[360px] md:h-[285px] bg-[#663399] overflow-hidden">
        
        {/* Right Side Background Image */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full md:w-[621.31px] h-[414.41px]">
          <img 
            src="/assets/specialists-bg.png" 
            alt="Medical Specialists reviewing scan" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Mask over the image - exact match to flipped Figma gradient */}
          <div 
            className="absolute inset-0"
            style={{ background: 'linear-gradient(270deg, rgba(102, 51, 153, 0) 17.84%, #663399 85%)' }}
          />
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:px-0 md:pl-[170.81px]">
          
          <h2 className="text-[#FFFFFF] font-semibold text-[24px] md:text-[30px] leading-[146%] w-full max-w-[507.13px] mb-[28px]">
            Get Your Second Medical Opinion<br className="hidden md:block" /> with our Specialists
          </h2>
          
          <button 
            className="group flex items-center justify-center gap-3 w-full md:w-[479.32px] h-[48px] bg-[#663399] border-[2px] border-[#FFFFFF] rounded-[31.7px] shadow-[4px_6px_4px_-4px_rgba(0,44,75,0.24)] hover:bg-white/10 transition-colors shrink-0"
          >
            {/* Calendar / Clock Icon */}
            <svg 
              width="24" height="24" viewBox="0 0 24 24" fill="none" 
              stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              {/* Internal Clock detail */}
              <circle cx="15.5" cy="15.5" r="3.5" fill="#663399" />
              <polyline points="15.5 13.5 15.5 15.5 16.5 16.5" />
            </svg>

            <span className="text-[#FFFFFF] font-semibold text-[15px] md:text-[18px] leading-[145%] tracking-[0.02em]">
              Book Appointment / Request a Call Back
            </span>
          </button>

        </div>

      </div>
    </section>

      {/* --- 5. RISKS TIMELINE --- */}
      {risksList.length > 0 && (
        <section className="py-16 bg-[#EBF7FF]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4 text-center lowercase first-letter:uppercase">{topic.risks.title}</h2>
            {topic.risks.description && (
              <div
                className="text-black text-center max-w-5xl mx-auto mb-12 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: topic.risks.description.replace(/&nbsp;/g, " ") }}
              />
            )}
            <div className="max-w-3xl mx-auto space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#663399]/30" />
              {risksList.map((item, idx) => (
                <div key={item.id ?? idx} className="flex items-start gap-6 relative">
                  <div className="w-6 h-6 rounded-full bg-[#663399] shrink-0 mt-1 z-10 border-4 border-[#EBF7FF]" />
                  <div>
                    <h3 className="font-semibold text-[#663399] text-xl mb-1">{item.title}</h3>
                    <p className="text-black text-base leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {topic.risks.note && (
              <p className="text-[#012B4E] font-semibold text-lg max-w-4xl mx-auto mt-8">{topic.risks.note}</p>
            )}
          </div>
        </section>
      )}

      

      {/* --- 6. BENEFITS BAND --- */}
      {(topic.benefits?.list?.length || 0) > 0 && (
        <section className="py-16 bg-[#663399]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 uppercase">{topic.benefits.title}</h2>
            {topic.benefits.description && (
              <div
                className="text-white/90 text-lg mb-8 max-w-3xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: topic.benefits.description.replace(/&nbsp;/g, " ") }}
              />
            )}
            <div className="space-y-5 mb-8">
              {topic.benefits.list.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-white shrink-0" />
                  <span className="text-white text-lg md:text-xl font-medium">{item}</span>
                </div>
              ))}
            </div>
            {topic.benefits.note && (
              <p className="text-white/90 text-lg max-w-4xl">{topic.benefits.note}</p>
            )}
          </div>
        </section>
      )}

      {/* --- 7. STEPS TIMELINE --- */}
      {stepsList.length > 0 && (
        <section className="py-16 bg-[#EEF8FF]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-[#663399] mb-3">HOW WE REVIEW YOUR CASE</h2>
            <p className="text-2xl md:text-[30px] font-bold text-[#663399] mb-14">A second opinion, step by step.</p>

            <div className="relative">
              <div className="hidden md:block absolute top-[9px] left-0 right-0 h-[1px] bg-[#663399]/30" />
              <div className="flex flex-wrap md:flex-nowrap gap-8 text-left">
                {stepsList.map((step, idx) => (
                  <div key={step.id ?? idx} className="relative w-[calc(50%-1rem)] md:w-0 md:flex-1">
                    <div className="hidden md:block w-[18px] h-[18px] rounded-full bg-[#0066A9] mb-6" />
                    <p className="text-[#0066A9] font-bold text-lg mb-2">{String(idx + 1).padStart(2, "0")}</p>
                    <h3 className="text-[#663399] font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-black text-sm leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- 8. REQUEST SECTION --- */}
      <section className="py-16 bg-[rgba(231,222,240,0.3)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-8 text-center">REQUEST A SECOND OPINION</h2>
          <div className="flex flex-col lg:flex-row rounded-[20px] overflow-hidden shadow-lg">
            <div className="lg:w-1/2 bg-[#663399] p-10 lg:p-14 flex flex-col justify-center text-white relative overflow-hidden">
              {topic.requestSection?.image && (
                <div className="absolute inset-0 opacity-20">
                  <Image src={topic.requestSection.image} alt="" fill className="object-cover" />
                </div>
              )}
              <div className="relative z-10">
                {topic.requestSection?.heading && (
                  <h3 className="text-2xl font-bold mb-6 leading-snug">{topic.requestSection.heading}</h3>
                )}
                {topic.requestSection?.description && (
                  <p className="text-white/90 text-lg leading-relaxed mb-8">{topic.requestSection.description}</p>
                )}
                <a href="tel:+919603911911">
                  <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors w-fit">
                    <Phone className="w-4 h-4" /> Call Now
                  </button>
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 bg-[rgba(232,246,255,0.96)] p-10 lg:p-14 flex flex-col justify-center">
              <form
                onSubmit={(e) => { e.preventDefault(); submitRequest(bottomForm, setIsSubmittingBottom, () => setBottomForm(emptyRequestForm())); }}
                className="space-y-5"
              >
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Name:</label>
                  <input type="text" value={bottomForm.name} onChange={(e) => setBottomForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full h-[52px] bg-white text-[#012B4E] border border-[#663399]/40 rounded-[6px] px-4 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Mobile Number:</label>
                  <input type="tel" value={bottomForm.mobile} onChange={(e) => setBottomForm(f => ({ ...f, mobile: e.target.value }))} required
                    className="w-full h-[52px] bg-white text-[#012B4E] border border-[#663399]/40 rounded-[6px] px-4 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Email Address:</label>
                  <input type="email" value={bottomForm.email} onChange={(e) => setBottomForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full h-[52px] bg-white text-[#012B4E] border border-[#663399]/40 rounded-[6px] px-4 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Upload Medical Reports:</label>
                  <label className="flex items-center gap-2 h-[52px] bg-white text-[#012B4E] border border-[#663399]/40 rounded-[6px] px-4 cursor-pointer">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1">{isUploadingBottom ? "Uploading..." : bottomForm.fileName || "Choose File"}</span>
                    <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadReport(f, setBottomForm, setIsUploadingBottom); }} />
                  </label>
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Message:</label>
                  <textarea value={bottomForm.message} onChange={(e) => setBottomForm(f => ({ ...f, message: e.target.value }))} rows={3}
                    className="w-full bg-white text-[#012B4E] border border-[#663399]/40 rounded-[6px] px-4 py-3 outline-none focus:ring-2 focus:ring-[#663399]/30 resize-none" />
                </div>
                <button type="submit" disabled={isSubmittingBottom} className="w-full h-[58px] bg-[#663399] text-white font-semibold rounded-[6px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isSubmittingBottom ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request a Second Opinion"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- 9. FAQS --- */}
      {topic.faqs?.length > 0 && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-[1000px] w-full mx-auto px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#663399] mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topic.faqs.map((faq, idx) => (
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
