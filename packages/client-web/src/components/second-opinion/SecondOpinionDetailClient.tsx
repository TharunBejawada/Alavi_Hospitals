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
      <section className="relative w-full min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#663399]" />
        {topic.heroImage && (
          <div className="absolute inset-y-0 right-0 w-full md:w-[65%] opacity-90">
            <Image src={topic.heroImage} alt={topic.title} fill className="object-cover" priority />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#663399] via-[#663399]/95 md:via-[#663399]/60 to-[#663399]/10" />

        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center py-16">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-8 max-w-xl">
              {topic.heroHeading}
            </h1>
            <a href="tel:+919603911911">
              <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" /> Call Now
              </button>
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <h3 className="font-bold text-[#663399] text-lg mb-4">Request a Second Opinion</h3>
            <form
              onSubmit={(e) => { e.preventDefault(); submitRequest(heroForm, setIsSubmittingHero, () => setHeroForm(emptyRequestForm())); }}
              className="space-y-3"
            >
              <input type="text" value={heroForm.name} onChange={(e) => setHeroForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" required
                className="w-full h-[44px] bg-white border border-[#663399]/40 rounded-[6px] px-4 text-sm outline-none focus:ring-2 focus:ring-[#663399]/30" />
              <input type="tel" value={heroForm.mobile} onChange={(e) => setHeroForm(f => ({ ...f, mobile: e.target.value }))} placeholder="Mobile Number" required
                className="w-full h-[44px] bg-white border border-[#663399]/40 rounded-[6px] px-4 text-sm outline-none focus:ring-2 focus:ring-[#663399]/30" />
              <input type="email" value={heroForm.email} onChange={(e) => setHeroForm(f => ({ ...f, email: e.target.value }))} placeholder="Email Address"
                className="w-full h-[44px] bg-white border border-[#663399]/40 rounded-[6px] px-4 text-sm outline-none focus:ring-2 focus:ring-[#663399]/30" />
              <label className="flex items-center gap-2 h-[44px] bg-white border border-[#663399]/40 rounded-[6px] px-4 text-sm text-gray-500 cursor-pointer">
                <Paperclip className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1">{isUploadingHero ? "Uploading..." : heroForm.fileName || "Upload Medical Reports"}</span>
                <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadReport(f, setHeroForm, setIsUploadingHero); }} />
              </label>
              <textarea value={heroForm.message} onChange={(e) => setHeroForm(f => ({ ...f, message: e.target.value }))} placeholder="Message" rows={2}
                className="w-full bg-white border border-[#663399]/40 rounded-[6px] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#663399]/30 resize-none" />
              <button type="submit" disabled={isSubmittingHero} className="w-full h-[44px] bg-[#663399] text-white font-semibold text-sm rounded-[6px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-8">
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

      {/* --- 4. RISKS TIMELINE --- */}
      {risksList.length > 0 && (
        <section className="py-16 bg-[#EBF7FF]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4 text-center lowercase first-letter:uppercase">{topic.risks.title}</h2>
            {topic.risks.description && (
              <div
                className="text-black text-center max-w-4xl mx-auto mb-12 leading-relaxed"
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
          </div>
        </section>
      )}

      {/* --- 5. MID CTA --- */}
      <section className="max-w-[1268px] mx-auto px-6 lg:px-12 py-8">
        <div className="bg-[#663399] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <p className="text-lg md:text-xl font-semibold max-w-2xl">
            {topic.ctaText || `Get Your Second Medical Opinion with our Specialists`}
          </p>
          <div className="flex gap-4 shrink-0">
            <a href="tel:+919603911911">
              <button className="bg-white text-[#663399] font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap">
                <Calendar className="w-4 h-4" /> Book Appointment
              </button>
            </a>
          </div>
        </div>
      </section>

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
        <div className="max-w-[1230px] mx-auto px-6 lg:px-12">
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
                    className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[6px] px-4 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Mobile Number:</label>
                  <input type="tel" value={bottomForm.mobile} onChange={(e) => setBottomForm(f => ({ ...f, mobile: e.target.value }))} required
                    className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[6px] px-4 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Email Address:</label>
                  <input type="email" value={bottomForm.email} onChange={(e) => setBottomForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[6px] px-4 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Upload Medical Reports:</label>
                  <label className="flex items-center gap-2 h-[52px] bg-white border border-[#663399]/40 rounded-[6px] px-4 text-gray-500 cursor-pointer">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1">{isUploadingBottom ? "Uploading..." : bottomForm.fileName || "Choose File"}</span>
                    <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadReport(f, setBottomForm, setIsUploadingBottom); }} />
                  </label>
                </div>
                <div>
                  <label className="block font-medium text-[#012B4E] mb-2">Message:</label>
                  <textarea value={bottomForm.message} onChange={(e) => setBottomForm(f => ({ ...f, message: e.target.value }))} rows={3}
                    className="w-full bg-white border border-[#663399]/40 rounded-[6px] px-4 py-3 outline-none focus:ring-2 focus:ring-[#663399]/30 resize-none" />
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
