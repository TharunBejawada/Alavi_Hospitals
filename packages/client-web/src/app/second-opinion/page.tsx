"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Loader2,
  Phone,
  Calendar,
  ArrowRight,
  Check,
  FileText,
  Stethoscope,
  MessagesSquare,
  ClipboardCheck,
  ShieldCheck,
  Users,
  HeartHandshake,
  Sparkles
} from "lucide-react";
import { API_URL } from "../../config";
import type { SecondOpinionTopic } from "../../../../core/src/types";

const WHY_SEEK_ITEMS = [
  "Confirm the accuracy of your diagnosis",
  "Understand all available treatment options",
  "Avoid unnecessary procedures or surgeries",
  "Explore minimally invasive alternatives",
  "Gain confidence before major healthcare decisions",
  "Receive expert guidance from experienced specialists"
];

const WHEN_TO_CONSIDER_ITEMS = [
  "You have been advised to undergo surgery",
  "You have been diagnosed with a serious or chronic illness",
  "Your symptoms are not improving despite treatment",
  "You want reassurance before starting major treatment",
  "You have concerns about your current treatment plan"
];

const PROCESS_STEPS = [
  { title: "Submit Your Medical Records", description: "Share your reports, prescriptions, scans, discharge summaries, and treatment recommendations.", Icon: FileText },
  { title: "Specialist Review", description: "Our expert doctors carefully evaluate your medical history and diagnostic findings.", Icon: Stethoscope },
  { title: "Detailed Consultation", description: "Discuss your condition, concerns, and available treatment options with the specialist.", Icon: MessagesSquare },
  { title: "Receive Expert Recommendations", description: "Get clear medical guidance on the best possible path forward.", Icon: ClipboardCheck },
  { title: "Make an Informed Decision", description: "Choose your treatment plan with confidence and complete understanding.", Icon: Sparkles }
];

const WHY_CHOOSE_ITEMS = [
  { title: "Experienced Multispecialty Team", description: "Access expert doctors across multiple specialties under one roof.", Icon: Users },
  { title: "Patient-Centered Care", description: "We listen, explain clearly, and answer your concerns with care.", Icon: HeartHandshake },
  { title: "Evidence-Based Recommendations", description: "Treatment advice based on current medical knowledge and best practices.", Icon: ShieldCheck },
  { title: "Personalized Approach", description: "Every patient receives recommendations tailored to their unique condition.", Icon: Sparkles }
];

const FAQS = [
  { question: "Will seeking a second opinion offend my current doctor?", answer: "No. Most healthcare professionals support patients seeking additional medical advice before making important treatment decisions." },
  { question: "Do I need a referral for a second opinion?", answer: "No referral is required. You can request a second opinion directly by submitting your medical reports and records to our team." },
  { question: "Can a second opinion change my treatment plan?", answer: "Yes. Our specialists may confirm your existing diagnosis or recommend an alternative approach based on their independent review." },
  { question: "Can I seek a second opinion before surgery?", answer: "Yes — this is one of the most common reasons patients request a second opinion, especially before major or elective surgery." },
  { question: "How long does the process take?", answer: "Timelines vary by case complexity, but most reviews and consultations are completed within a few working days of submitting your records." }
];

export default function SecondOpinionHubPage() {
  const [topics, setTopics] = useState<SecondOpinionTopic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch(`${API_URL}/api/second-opinions/getAllEnabled`);
        const data = await res.json();
        setTopics(data.Items || []);
      } catch (error) {
        console.error("Failed to fetch Second Opinion topics:", error);
      } finally {
        setLoadingTopics(false);
      }
    }
    fetchTopics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        message: form.message || "No additional details provided",
        page: "Second Opinion Hub"
      });
      setSubmitted(true);
      setForm({ name: "", mobile: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[520px] flex items-center overflow-hidden bg-[#F5FBFF]">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#663399] leading-tight mb-3">
              Get a Trusted Second Opinion at Alavi Hospitals
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-[#0066A9] mb-6">
              Not Sure About Your Diagnosis or Treatment Plan?
            </h2>
            <p className="text-[#012B4E] text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              If you have been advised surgery, received a complex diagnosis, or want to explore other treatment
              options, a second opinion from our experienced specialists can help you make an informed decision
              with clarity and peace of mind.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#request-form">
                <button className="bg-[#663399] text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity">
                  Request a Second Opinion Today
                </button>
              </a>
              <a href="tel:+919603911911">
                <button className="border-2 border-[#663399] text-[#663399] font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#663399]/5 transition-colors">
                  <Phone className="w-4 h-4" /> Call Now
                </button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative w-full aspect-square max-w-[420px] mx-auto rounded-full bg-[#EBF7FF] border-8 border-white shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#663399_0%,#0066A9_100%)] opacity-10" />
          </motion.div>
        </div>
      </section>

      {/* --- 2. WHY SEEK / WHEN TO CONSIDER --- */}
      <section className="py-16 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4">Why Seek a Second Opinion?</h2>
            <p className="font-bold text-[#012B4E] text-lg mb-6">A second opinion can help you:</p>
            <div className="divide-y divide-[#663399]/15">
              {WHY_SEEK_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-4">
                  <Check className="w-5 h-5 text-[#663399] shrink-0" strokeWidth={3} />
                  <span className="text-[#012B4E] font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-[#012B4E] text-base leading-relaxed mt-8 max-w-lg">
              Second opinions are especially helpful for complex conditions, major surgeries, cancer treatment,
              chronic illnesses, and unclear diagnoses.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4">When Should You Consider a Second Opinion?</h2>
            <p className="font-bold text-[#012B4E] text-lg mb-6">You may benefit from a second opinion if:</p>
            <div className="space-y-3">
              {WHEN_TO_CONSIDER_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#F5FBFF] rounded-xl px-5 py-4">
                  <ArrowRight className="w-4 h-4 text-[#663399] shrink-0" />
                  <span className="text-[#012B4E] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. CONDITIONS COMMONLY REVIEWED (dynamic, from admin topics) --- */}
      <section className="py-16 bg-[#EBF7FF]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-10 text-center">
            Conditions Commonly Reviewed
          </h2>

          {loadingTopics ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
            </div>
          ) : topics.length === 0 ? (
            <p className="text-center text-[#012B4E]/60">No topics available yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {topics.map((topic, idx) => (
                <motion.div
                  key={topic.secondOpinionId}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <Link
                    href={`/second-opinion/${topic.seoConfig?.url}`}
                    className="group flex flex-col items-center gap-4 w-[150px]"
                  >
                    <div className="relative w-[105px] h-[105px] rounded-full bg-white shadow-md overflow-hidden border-2 border-transparent group-hover:border-[#663399] transition-colors flex items-center justify-center">
                      {topic.icon ? (
                        <Image src={topic.icon} alt={topic.title} fill className="object-contain p-4" />
                      ) : (
                        <Stethoscope className="w-10 h-10 text-[#663399]" />
                      )}
                    </div>
                    <span className="font-semibold text-[#663399] text-center group-hover:underline">{topic.title}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- 4. HOW OUR PROCESS WORKS --- */}
      <section className="py-16 max-w-[1400px] mx-auto px-6 lg:px-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-14 text-center">
          How Our Second Opinion Process Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {PROCESS_STEPS.map(({ title, description, Icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#F5FBFF] border-2 border-[#663399]/20 flex items-center justify-center mx-auto mb-5">
                <Icon className="w-8 h-8 text-[#663399]" />
              </div>
              <h3 className="font-bold text-[#663399] text-lg mb-2">{title}</h3>
              <p className="text-[#012B4E] text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 5. WHY CHOOSE ALAVI HOSPITALS --- */}
      <section className="py-16 bg-[#663399]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">Why Choose Alavi Hospitals?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHY_CHOOSE_ITEMS.map(({ title, description, Icon }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white/10 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
                  <p className="text-white/85 text-sm leading-relaxed">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. FAQS --- */}
      <section className="py-16 max-w-[1000px] mx-auto px-6 lg:px-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-[#663399]/20">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-[#F5FBFF] transition-colors"
              >
                <span className="font-semibold text-[#012B4E]">{faq.question}</span>
                <span className={`text-[#663399] text-xl font-bold transition-transform ${openFaq === idx ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-[#012B4E]/80 text-sm leading-relaxed bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- 7. REQUEST FORM --- */}
      <section id="request-form" className="py-16 bg-[#F5FBFF] scroll-mt-24">
        <div className="max-w-[700px] mx-auto px-6 lg:px-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#663399] mb-2 text-center">Request a Second Opinion</h2>
            <p className="text-[#012B4E]/70 text-center mb-8">
              Share a few details and our care team will reach out to guide you through the next steps.
            </p>
            {submitted ? (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-[#663399] mx-auto mb-4" />
                <p className="font-semibold text-[#012B4E]">Thank you! We&apos;ve received your request and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" required
                  className="w-full h-[52px] bg-[#F5FBFF] border border-[#663399]/20 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                <input type="tel" value={form.mobile} onChange={(e) => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="Mobile Number" required
                  className="w-full h-[52px] bg-[#F5FBFF] border border-[#663399]/20 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email Address"
                  className="w-full h-[52px] bg-[#F5FBFF] border border-[#663399]/20 rounded-xl px-5 outline-none focus:ring-2 focus:ring-[#663399]/30" />
                <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Briefly describe your concern" rows={3}
                  className="w-full bg-[#F5FBFF] border border-[#663399]/20 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#663399]/30 resize-none" />
                <button type="submit" disabled={isSubmitting} className="w-full h-[52px] bg-[#663399] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request a Second Opinion"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
