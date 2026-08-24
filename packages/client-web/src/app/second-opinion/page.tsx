"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  ChevronDown
} from "lucide-react";
import { API_URL } from "../../config";
import type { SecondOpinionTopic } from "../../../../core/src/types";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const WHY_SEEK_ITEMS = [
  "Confirm the accuracy of your diagnosis",
  "Understand all available treatment options",
  "Avoid unnecessary procedures or surgeries",
  "Explore minimally invasive alternatives",
  "Gain confidence before major healthcare decisions",
  "Receive expert guidance from experienced specialists",
];

const WHEN_TO_CONSIDER_ITEMS = [
  "You have been advised to undergo surgery",
  "You have been diagnosed with a serious or chronic illness",
  "Your symptoms are not improving despite treatment",
  "You want reassurance before starting major treatment",
  "You have concerns about your current treatment plan",
];

const PROCESS_STEPS = [
  {
    title: "Submit Your Medical Records",
    desc: "Share your reports, prescriptions, scans, discharge summaries, and treatment recommendations.",
    img: "/assets/process-1.png",
    iconImg: "/assets/submit-records-icon.png", // Replace with your white icon asset
  },
  {
    title: "Specialist Review",
    desc: "Our expert doctors carefully evaluate your medical history and diagnostic findings.",
    img: "/assets/process-2.png",
    iconImg: "/assets/specialist-review-icon.png", 
  },
  {
    title: "Detailed Consultation",
    desc: "Discuss your condition, concerns, and available treatment options with the specialist.",
    img: "/assets/process-3.png",
    iconImg: "/assets/detailed-consultation-icon.png", 
  },
  {
    title: "Receive Expert Recommendations",
    desc: "Get clear medical guidance on the best possible path forward.",
    img: "/assets/process-4.png",
    iconImg: "/assets/expert-recommendations-icon.png", 
  },
  {
    title: "Make an Informed Decision",
    desc: "Choose your treatment plan with confidence and complete understanding.",
    img: "/assets/process-5.png",
    iconImg: "/assets/informed-decision-icon.png", 
  }
];

const WHY_CHOOSE_ITEMS = [
  {
    id: 1,
    title: "Experienced Multispecialty Team:",
    description: "Access expert doctors across multiple specialties under one roof.",
    iconBg: "bg-[#663399]",
    titleColor: "text-[#663399]",
    iconImg: "/assets/team-icon.png", // Replace with your white icon asset
  },
  {
    id: 2,
    title: "Patient-Centered Care:",
    description: "We listen, explain clearly, and answer your concerns with care.",
    iconBg: "bg-[#0066A9]",
    titleColor: "text-[#0066A9]",
    iconImg: "/assets/patient-care-icon.png", 
  },
  {
    id: 3,
    title: "Evidence-Based Recommendations:",
    description: "Treatment advice based on current medical knowledge and best practices.",
    iconBg: "bg-[#663399]",
    titleColor: "text-[#663399]",
    iconImg: "/assets/evidence-icon.png", 
  },
  {
    id: 4,
    title: "Personalized Approach:",
    description: "Every patient receives recommendations tailored to their unique condition.",
    iconBg: "bg-[#0066A9]",
    titleColor: "text-[#0066A9]",
    iconImg: "/assets/personalized-icon.png", 
  }
];

const FAQS = [
  { 
    question: "What is a second medical opinion?", 
    answer: "A second medical opinion is an evaluation of your diagnosis, reports, and proposed treatment by another experienced specialist to help you make a more informed healthcare decision." 
  },
  { 
    question: "When should I consider getting a second opinion?", 
    answer: "You may consider a second opinion if you have been advised surgery, received a serious or chronic illness diagnosis, have symptoms that are not improving, or have concerns about your current treatment plan." 
  },
  { 
    question: "Can a second opinion change my treatment plan?", 
    answer: "Yes. A specialist may help you understand other available treatment options, including minimally invasive alternatives, and provide recommendations based on your individual condition." 
  },
  { 
    question: "Can I get a second opinion before surgery?", 
    answer: "Yes. Seeking another specialist's opinion before a major surgery can help you better understand your diagnosis, treatment options, and the recommended approach." 
  },
  { 
    question: "What medical records do I need for a second opinion?", 
    answer: "You can share relevant medical records such as diagnostic reports, prescriptions, scans, discharge summaries, and previous treatment recommendations for specialist review." 
  },
  { 
    question: "Do I need a referral to get a second opinion?", 
    answer: "The provided page does not specify whether a referral is required. You can contact Alavi Hospitals to confirm the process for your specific consultation." 
  },
  { 
    question: "Will seeking a second opinion offend my current doctor?", 
    answer: "No. Seeking additional medical advice before making an important treatment decision is a reasonable step and can help you feel more confident about your healthcare choices." 
  },
  { 
    question: "What conditions can be reviewed for a second opinion?", 
    answer: "Second opinions may be particularly helpful for conditions involving major surgeries, complex illnesses, cancer treatment, chronic conditions, and unclear diagnoses. The page also highlights joint replacement, spine surgery, stroke, uterine fibroids, and kidney stones." 
  },
  { 
    question: "How does the second opinion process work at Alavi Hospitals?", 
    answer: "The process involves submitting your medical records, specialist review, a detailed consultation, receiving expert recommendations, and then making an informed treatment decision." 
  },
  { 
    question: "How long does it take to get a second opinion?", 
    answer: "The current page does not mention a specific timeframe. The duration may depend on the complexity of your medical records and the specialist consultation." 
  }
];

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
        console.error("Failed to fetch Second Opinion:", error);
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
      <section className="relative w-full min-h-[622px] flex items-center overflow-hidden bg-[#F5FBFF]">
      <div className="max-w-[1453px] w-full mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="max-w-[680.92px]"
        >
          <h1 className="text-[36px] font-bold text-[#663399] leading-[48px] mb-4 max-w-[575px]">
            Get a Trusted Second Opinion<br className="hidden lg:block" /> at Alavi Hospitals
          </h1>
          
          <h2 className="text-[32px] font-semibold text-[#0066A9] leading-[44px] mb-8 max-w-[575px]">
            Not Sure About Your Diagnosis or<br className="hidden lg:block" /> Treatment Plan?
          </h2>
          
          <p className="text-[18px] font-normal text-[#000000] leading-[28px] mb-10 w-full max-w-[680.92px]">
            If you have been advised surgery, received a complex diagnosis, or want to
            explore other treatment options, a second opinion from our experienced
            specialists can help you make an informed decision with clarity and peace
            of mind.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#request-form">
              <button 
                className="text-white font-bold text-lg rounded-[19px] hover:opacity-90 transition-opacity w-full sm:w-[402.42px] h-[64.45px] flex items-center justify-center"
                style={{ background: 'linear-gradient(90deg, #0066A9 -128.06%, #663399 51.87%)' }}
              >
                Request a Second Opinion Today
              </button>
            </a>
            <a href="tel:+919603911911">
              <button 
                className="text-white font-bold text-lg rounded-[19px] hover:opacity-90 transition-opacity w-full sm:w-[145.59px] h-[64.45px] flex items-center justify-center"
                style={{ background: 'linear-gradient(90deg, #0066A9 -84.11%, #663399 116.13%)' }}
              >
                Call Now
              </button>
            </a>
          </div>
        </motion.div>

        {/* Right Content (Images & Icons) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative w-full max-w-[480px] aspect-square mx-auto lg:mr-10 mt-8 lg:mt-0"
        >
          {/* Dashed Outer Ring */}
          <svg 
  className="absolute inset-[-10%] w-[120%] h-[120%] z-0 opacity-80 pointer-events-none" 
  viewBox="0 0 100 100" 
  preserveAspectRatio="xMidYMid meet"
>
  <circle 
    cx="50" 
    cy="50" 
    r="49" 
    fill="none" 
    stroke="#663399" 
    strokeWidth="0.5" 
    strokeDasharray="4 2" 
  />
</svg>

          {/* Main Image */}
          <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200 z-10 border-[6px] border-[#F5FBFF]">
            <img 
              src="/assets/doctor-patient.png" 
              alt="Doctor showing x-ray to patient" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Knee Icon (Top Right) */}
          <div className="absolute -top-[5%] right-[5%] w-[100px] h-[100px] bg-[#0066A9] rounded-full border-[6px] border-[#F5FBFF] flex items-center justify-center z-20">
            <img 
              src="/assets/knee-icon.png" 
              alt="Orthopedics" 
              className="w-12 h-12 object-contain" 
            />
          </div>

          {/* Spine Icon (Bottom Left) */}
          <div className="absolute bottom-[5%] -left-[8%] w-[100px] h-[100px] bg-[#0066A9] rounded-full border-[6px] border-[#F5FBFF] flex items-center justify-center z-20">
            <img 
              src="/assets/spine-icon.png" 
              alt="Spine" 
              className="w-12 h-12 object-contain" 
            />
          </div>

          {/* Brain Icon (Bottom Right) */}
          <div className="absolute bottom-[8%] -right-[5%] w-[100px] h-[100px] bg-[#0066A9] rounded-full border-[6px] border-[#F5FBFF] flex items-center justify-center z-20">
            <img 
              src="/assets/brain-icon.png" 
              alt="Neurology" 
              className="w-12 h-12 object-contain" 
            />
          </div>
        </motion.div>

      </div>
    </section>

      {/* --- 2. WHY SEEK / WHEN TO CONSIDER --- */}
      <section className="py-16 w-full max-w-[1453px] mx-auto px-6 lg:px-12 font-['Poppins'] flex justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[52px] w-full max-w-[1453px]">
        
        {/* Left Card: Why Seek a Second Opinion? */}
        <div className="w-full bg-[rgba(246,238,255,0.53)] rounded-[26px] p-8 md:p-10 flex flex-col h-full min-h-[650px]">
          <h2 className="text-[26px] font-bold text-[#663399] leading-[39px] mb-2">
            Why Seek a Second Opinion?
          </h2>
          <p className="text-[21px] font-medium text-[#000000] leading-[32px] mb-6">
            A second opinion can help you:
          </p>
          
          {/* List Items */}
          <div className="flex-1 flex flex-col">
            <div className="divide-y divide-[rgba(72,31,119,0.30)]">
              {WHY_SEEK_ITEMS.map((text, idx) => (
                <div key={idx} className="group flex items-center gap-4 py-[15px] cursor-pointer transition-all duration-300">
                  <svg 
                    width="18" height="18" viewBox="0 0 24 24" fill="none" 
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" 
                    className="shrink-0 stroke-[#481F77] group-hover:stroke-[#663399] transition-colors duration-300"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12l3 3 5-6" />
                  </svg>
                  <span className="text-[16px] leading-[24px] font-medium text-[#000000] group-hover:font-semibold group-hover:text-[#663399] transition-all duration-300">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-[16px] font-medium text-[#000000] leading-[24px] mt-8">
            Second opinions are especially helpful for complex conditions, major surgeries, cancer treatment, chronic illnesses, and unclear diagnoses.
          </p>
        </div>

        {/* Right Card: When Should You Consider a Second Opinion? */}
        <div className="w-full bg-[#F1FAFF] rounded-[26px] p-8 md:p-10 flex flex-col h-full min-h-[650px]">
          <h2 className="text-[26px] font-bold text-[#481F77] leading-[39px] mb-2">
            When Should You Consider a<br className="hidden md:block"/> Second Opinion?
          </h2>
          <p className="text-[21px] font-medium text-[#000000] leading-[32px] mb-8">
            You may benefit from a second opinion if:
          </p>
          
          {/* Pill Buttons */}
          <div className="flex flex-col gap-[15px]">
            {WHEN_TO_CONSIDER_ITEMS.map((text, idx) => (
              <div 
                key={idx} 
                className="group flex items-center gap-5 px-6 md:px-8 py-3 w-full rounded-[38.42px] bg-[#FFFFFF] min-h-[71.11px] hover:bg-[#0066A9] hover:min-h-[76.84px] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg 
                  width="18" height="18" viewBox="0 0 24 24" fill="none" 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  className="shrink-0 stroke-[#663399] group-hover:stroke-[#FFFFFF] transition-colors duration-300"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className="text-[18px] leading-[27px] font-medium text-[#2A255B] group-hover:font-semibold group-hover:text-[#FFFFFF] transition-all duration-300">
                  {text}
                </span>
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
            <p className="text-center text-[#012B4E]/60">No Second Opinions available yet.</p>
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
      <section className="relative w-full py-20 bg-[#F5FBFF] font-['Poppins'] overflow-hidden">
      <div className="max-w-[1453px] mx-auto px-6">
        
        {/* Section Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[32px] leading-[48px] font-semibold text-[#663399] mb-[60px]"
        >
          How Our <span className="font-extrabold">Second Opinion</span> Process Works
        </motion.h2>

        {/* Process Cards Container */}
        <div className="flex flex-col lg:flex-row flex-wrap xl:flex-nowrap justify-center items-center gap-8 xl:gap-[22.5px] max-w-[1315px] mx-auto">
          {PROCESS_STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              // FIX: This forces earlier cards to have a higher z-index, keeping arrows on top
              style={{ zIndex: PROCESS_STEPS.length - idx }}
              className="w-[244.82px] h-[393.33px] bg-[#FFFFFF] rounded-[15px] relative shrink-0 flex flex-col drop-shadow-sm"
            >
              
              {/* Top Image Box */}
              <div className="w-full h-[194.16px] bg-[#7E57A8] rounded-t-[15px] overflow-hidden">
                <img 
                  src={step.img} 
                  alt={step.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Overlapping Primary Icon */}
              <div 
                className="absolute top-[194.16px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full border-[4px] border-[#FFFFFF] flex items-center justify-center z-20"
                style={{ background: 'linear-gradient(180deg, #324EA1 0%, #663399 100%)' }}
              >
                <img 
                  src={step.iconImg} 
                  alt={`${step.title} icon`} 
                  className="w-[42px] h-[42px] object-contain" 
                />
              </div>

              {/* Connecting Arrow (Visible only on Desktop for the first 4 cards) */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div 
                  className="hidden xl:flex absolute top-[97px] right-[-33.75px] -translate-y-1/2 w-[45px] h-[45px] rounded-full z-30 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] items-center justify-center"
                  style={{ background: 'radial-gradient(74.57% 74.57% at 50% 50%, #663399 0%, #324EA1 100%)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}

              {/* Text Details Area */}
              <div className="mt-[48px] px-[13.5px] pb-4 flex flex-col items-center flex-1">
                <h3 className="font-bold text-[#663399] text-[16px] leading-[21px] text-center min-h-[42px] mb-3 flex items-center justify-center">
                  {step.title}
                </h3>
                <p className="font-medium text-[#000000] text-[12px] leading-[18px] text-center w-full max-w-[217.68px]">
                  {step.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </div>
        
      </div>
    </section>

      {/* --- 5. WHY CHOOSE ALAVI HOSPITALS --- */}
      <section 
      className="py-16 bg-white overflow-hidden" 
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="flex flex-col items-center justify-center">
            <span className="text-[28px] font-semibold text-[#0C0200] leading-tight">
              Why Choose
            </span>
            <span className="text-[40px] font-bold text-[#663399] leading-tight mt-1">
              Alavi Hospitals?
            </span>
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch">
          
          {/* Left Column: Image Area */}
          <div className="w-full lg:w-[40%] flex justify-center">
            <div className="relative w-full max-w-[400px] lg:max-w-none rounded-[13px] border-[8px] border-[#663399] overflow-hidden shadow-lg h-[350px] lg:h-auto lg:min-h-[466px]">
              <img 
                src="/hospital-idpl.jpg" 
                alt="Alavi Hospitals Building" 
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Features List */}
          <div className="w-full lg:w-[60%] flex flex-col justify-between gap-6">
            {WHY_CHOOSE_ITEMS.map((feature) => (
              <div 
                key={feature.id}
                // The box shadow natively applies the solid purple 6px right border block 
                // exactly mimicking Figma's offset background rectangle trick.
                className="flex items-center gap-4 bg-[#EEF8FF] rounded-[6px] w-full min-h-[105px] p-3 pr-6 shadow-[6px_0px_0px_0px_#663399] transition-transform hover:-translate-x-1 duration-300"
              >
                
                {/* Icon Container */}
                <div 
                  className={`w-[85px] h-[75px] rounded-[6px] shrink-0 flex items-center justify-center ${feature.iconBg}`}
                >
                  <img 
                    src={feature.iconImg} 
                    alt={`${feature.title} icon`} 
                    className="w-[42px] h-[42px] object-contain" 
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col pt-1">
                  <h3 className={`font-semibold text-[16px] md:text-[18px] leading-snug mb-1 ${feature.titleColor}`}>
                    {feature.title}
                  </h3>
                  <p className="text-[#0C0200] text-[14px] leading-snug font-medium opacity-90">
                    {feature.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>

      {/* --- 6. FAQS --- */}
            {FAQS.length > 0 && (
              <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
                className="py-20 bg-[#FAFAFA]"
              >
                <div className="max-w-[1440px] w-full mx-auto px-6 md:px-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-[#663399] mb-12">
                    Frequently Asked Questions
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {FAQS.map((faq, idx) => (
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
              </motion.section>
            )}

    </div>
  );
}
