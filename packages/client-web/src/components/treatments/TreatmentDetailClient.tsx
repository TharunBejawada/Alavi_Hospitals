"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Calendar, Phone, ChevronDown, Check, Loader2, ArrowRight } from "lucide-react";
import { API_URL } from "../../config";
import AppointmentPopup from "../AppointmentPopup";
import type { Treatment, TreatmentInfoItem } from "../../../../core/src/types";

// --- Placeholder asset paths -----------------------------------------------
// These files don't exist in the repo yet. Drop the exported Figma assets
// into these exact paths under packages/client-web/public/ and everything
// below will pick them up automatically — no code changes needed.
const WHY_CHOOSE_ITEMS = [
  { label: "Experienced Specialists", icon: "/icons/treatments/why-choose-experienced-specialists.svg" },
  { label: "Accurate Diagnosis", icon: "/icons/treatments/why-choose-accurate-diagnosis.svg" },
  { label: "Personalized Treatment", icon: "/icons/treatments/why-choose-personalized-treatment.svg" },
  { label: "Modern Medical Facilities", icon: "/icons/treatments/why-choose-modern-facilities.svg" },
  { label: "Comprehensive Support", icon: "/icons/treatments/why-choose-comprehensive-support.svg" },
  { label: "Patient-Centered Approach", icon: "/icons/treatments/why-choose-patient-centered.svg" }
];
const CAUSE_FALLBACK_ICON = "/icons/treatments/cause-arrow.svg";
const MID_CTA_DECORATIVE_IMAGE = "/images/treatments/mid-cta-decorative.png";

// Renders an <Image>, but quietly collapses to an empty placeholder box
// instead of a broken-image icon if the asset hasn't been committed yet.
const SafeImage = ({
  src,
  alt,
  size,
  className
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <div style={{ width: size, height: size }} className={className} />;
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerItem = (idx: number) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const, delay: idx * 0.08 } }
});

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

// The vertical divider between "Why Choose" items, reproducing the Figma
// layer exactly: a 0-height horizontal line rotated 90deg, rather than a
// plain CSS border, per the design spec:
//   width: 125.02px; height: 0px; border: 2px solid #FFFFFF; transform: rotate(90deg);
const WhyChooseDivider = () => (
  <div className="hidden lg:flex items-center justify-center h-[125.02px] shrink-0">
    <div className="w-[125.02px] h-0 border-t-2 border-white rotate-90" />
  </div>
);

// The "WHY CHOOSE ALAVI HOSPITAL" band is static, site-wide marketing content
// (same for every Treatment page), matching the Figma design's dedicated
// icon-row layout rather than the differently-styled home/WhyChooseUs component.
const WhyChooseAlaviBand = ({ heading }: { heading?: string }) => (
  <motion.section
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeUp}
    className="py-16 bg-[#663399]"
  >
    <div className="max-w-[1268px] mx-auto px-6 md:px-10 text-center">
      <p className="text-[24px] font-bold text-white tracking-wide mb-2">WHY CHOOSE ALAVI HOSPITAL?</p>
      <h2 className="text-[20px] md:text-[26px] font-semibold text-white mb-12 max-w-3xl mx-auto">
        {heading || "Expert Care for Better Health Management"}
      </h2>
      <div className="flex flex-wrap justify-center items-center">
        {WHY_CHOOSE_ITEMS.map(({ label, icon }, idx) => (
          <React.Fragment key={label}>
            {idx !== 0 && <WhyChooseDivider />}
            <motion.div
              variants={staggerItem(idx)}
              className="flex flex-col items-center gap-4 px-6 py-2 w-1/2 sm:w-1/3 lg:w-auto lg:flex-1"
            >
              <SafeImage src={icon} alt={label} size={56} className="object-contain brightness-0 invert" />
              <span className="text-[14px] font-semibold text-white text-center max-w-[140px]">{label}</span>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </div>
  </motion.section>
);

const InfoItemIcon = ({
  item,
  fallbackVariant = "dot",
  fallbackClassName
}: {
  item: TreatmentInfoItem;
  fallbackVariant?: "arrow" | "dot";
  fallbackClassName?: string;
}) => {
  if (item.icon) {
    return (
      <div className="relative w-6 h-6 shrink-0">
        <Image src={item.icon} alt="" fill className="object-contain" />
      </div>
    );
  }
  if (fallbackVariant === "arrow") {
    return (
      <div className={`w-6 h-6 rounded-full bg-[#AFD0EC] flex items-center justify-center shrink-0 ${fallbackClassName || ""}`}>
        <SafeImage src={CAUSE_FALLBACK_ICON} alt="" size={12} />
      </div>
    );
  }
  return <div className={`w-6 h-6 rounded-full bg-[#AFD0EC] shrink-0 ${fallbackClassName || ""}`} />;
};

export default function TreatmentDetailClient({ treatment }: { treatment: Treatment }) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Hero quick-lead form
  const [heroName, setHeroName] = useState("");
  const [heroMobile, setHeroMobile] = useState("");
  const [isSubmittingHero, setIsSubmittingHero] = useState(false);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroName.trim() || !heroMobile.trim()) return;
    setIsSubmittingHero(true);
    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name: heroName,
        mobile: heroMobile,
        message: "No concern specified",
        speciality: treatment.specialityName,
        page: `Treatment Page - ${treatment.title}`
      });
      const query = new URLSearchParams({ name: heroName, mobile: heroMobile, department: treatment.specialityName }).toString();
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit lead:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmittingHero(false);
    }
  };

  const causesList = treatment.causes?.list || [];
  const symptomsList = treatment.symptoms?.list || [];
  const diagnosisList = treatment.diagnosis?.list || [];
  const optionsList = treatment.treatmentOptions?.list || [];

  return (
    <div className="font-['Poppins'] min-h-screen bg-white pb-20">

      {/* --- 1. HERO --- */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#F4FAFF] border-2 border-[#663399] rounded-[20px] p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="flex-1">
            {treatment.badgeLabel && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="inline-block bg-[#663399] text-white font-bold text-base md:text-lg px-6 py-3 rounded-full mb-6"
              >
                {treatment.badgeLabel}
              </motion.span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#0066A9] leading-tight mb-4">
              {treatment.title}
            </h1>
            {treatment.subtitle && (
              <p className="text-base md:text-lg text-[#012B4E] font-medium max-w-xl">{treatment.subtitle}</p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-[380px] bg-[#DFF2FF] rounded-2xl p-6 shrink-0"
          >
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmittingHero}
                className="w-full h-[48px] bg-[#663399] text-white font-bold rounded-[8px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSubmittingHero ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* --- 2. OVERVIEW --- */}
      {treatment.overview?.title && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="py-16 max-w-[1440px] mx-auto px-6 md:px-10"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-6">{treatment.overview.title}</h2>
              <div
                className="text-[#012B4E] text-base md:text-lg leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: (treatment.overview.description || "").replace(/&nbsp;/g, " ") }}
              />
            </div>
            {treatment.overview.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full lg:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0"
              >
                <Image src={treatment.overview.image} alt={treatment.overview.title} fill className="object-cover" />
              </motion.div>
            )}
          </div>
        </motion.section>
      )}

      {/* --- 3. CAUSES + SYMPTOMS --- */}
      {(causesList.length > 0 || symptomsList.length > 0) && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="py-16 bg-[#663399]"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10">
            {causesList.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{treatment.causes.title}</h2>
                {treatment.causes.description && (
                  <div
                    className="text-white/90 mb-8 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: treatment.causes.description.replace(/&nbsp;/g, " ") }}
                  />
                )}
                <div className="space-y-6">
                  {causesList.map((item, idx) => (
                    <motion.div
                      key={item.id ?? idx}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={staggerItem(idx)}
                      className="flex gap-4"
                    >
                      <InfoItemIcon item={item} fallbackVariant="arrow" fallbackClassName="mt-1" />
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                        <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {symptomsList.length > 0 && (
              <div className="bg-white rounded-2xl p-8 h-fit">
                <h3 className="text-xl md:text-2xl font-bold text-[#663399] mb-2">
                  {treatment.symptoms.title || "Common Signs & Symptoms"}
                </h3>
                {treatment.symptoms.description && (
                  <p className="text-[#012B4E] text-sm mb-6">{treatment.symptoms.description}</p>
                )}
                <ul className="space-y-4">
                  {symptomsList.map((s, idx) => (
                    <motion.li
                      key={idx}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={staggerItem(idx)}
                      className="flex items-center gap-3 text-[#663399] font-semibold"
                    >
                      <Check className="w-5 h-5 shrink-0 text-[#663399]" strokeWidth={3} />
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* --- 4. DIAGNOSIS --- */}
      {diagnosisList.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          className="py-16 max-w-[1440px] mx-auto px-6 md:px-10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#663399] mb-4">{treatment.diagnosis.title}</h2>
          {treatment.diagnosis.description && (
            <div
              className="text-[#023D6E] max-w-3xl mx-auto mb-12 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: treatment.diagnosis.description.replace(/&nbsp;/g, " ") }}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {diagnosisList.map((item, idx) => (
              <motion.div
                key={item.id ?? idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={staggerItem(idx)}
                whileHover={{ y: -4 }}
                className="bg-[#DFF2FF] rounded-2xl p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <InfoItemIcon item={item} />
                  <h3 className="font-bold text-[#663399] text-lg">{item.title}</h3>
                </div>
                <p className="text-[#023D6E] text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* --- 5. MID CTA (static: always visible, both buttons always shown) --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="max-w-[1268px] mx-auto px-6 md:px-10 pb-16"
      >
        <div className="bg-[#663399] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
          <SafeImage
            src={MID_CTA_DECORATIVE_IMAGE}
            alt=""
            size={320}
            className="absolute -right-10 -bottom-16 w-[320px] h-[320px] object-cover rounded-[24px] -rotate-[16deg] opacity-25 pointer-events-none"
          />
          <p className="text-lg md:text-xl font-semibold max-w-2xl relative z-10">
            {treatment.ctaText || "Early evaluation can help identify the cause and guide you toward the right treatment."}
          </p>
          <div className="flex gap-4 shrink-0 relative z-10">
            <a href="tel:+919603911911">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                <Phone className="w-4 h-4" /> Call Now
              </motion.button>
            </a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsPopupOpen(true)}
              className="bg-white text-[#663399] font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* --- 6. TREATMENT OPTIONS --- */}
      {optionsList.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          className="py-16 bg-[#F5F8FC]"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 text-center">
            <p className="text-[#663399] font-bold tracking-wide mb-2">TREATMENT OPTIONS</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0066A9] mb-4">{treatment.treatmentOptions.title}</h2>
            {treatment.treatmentOptions.description && (
              <div
                className="text-[#023D6E] max-w-3xl mx-auto mb-12 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: treatment.treatmentOptions.description.replace(/&nbsp;/g, " ") }}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-left items-stretch">
              {optionsList.map((item, idx) => {
                const featured = idx === 0;
                if (featured) {
                  return (
                    <motion.div
                      key={item.id ?? idx}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true }}
                      variants={staggerItem(idx)}
                      whileHover={{ y: -4 }}
                      className="group relative rounded-2xl overflow-hidden bg-[linear-gradient(180deg,#0066A9_0%,#663399_100%)] p-6 flex flex-col justify-end min-h-[320px] lg:row-span-2 cursor-pointer"
                    >
                      {item.image && (
                        <Image src={item.image} alt={item.title} fill className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-300" />
                      )}
                      <div className="relative z-10">
                        <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                        <p className="text-white/85 text-sm leading-relaxed mb-4">{item.description}</p>
                        <span className="inline-flex items-center gap-1.5 text-white text-xs font-semibold">
                          Read More <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  );
                }
                // Image + text blend into one seamless card; hovering tints the
                // text portion purple; no uploaded image falls back to a solid
                // purple-filled photo area (per Figma) instead of empty space.
                return (
                  <motion.div
                    key={item.id ?? idx}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={staggerItem(idx)}
                    whileHover={{ y: -4 }}
                    className="group flex flex-col rounded-2xl overflow-hidden shadow-sm cursor-pointer"
                  >
                    <div className="relative w-full aspect-[4/3]">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-[#663399]" />
                      )}
                    </div>
                    <div className="bg-[#DFF2FF] group-hover:bg-[#663399] transition-colors duration-300 p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-[#663399] group-hover:text-white text-sm mb-1 transition-colors duration-300">{item.title}</h3>
                      <p className="text-[#023D6E] group-hover:text-white/90 text-xs leading-relaxed mb-3 flex-1 transition-colors duration-300">{item.description}</p>
                      <span className="inline-flex items-center gap-1.5 text-[#023D6E] group-hover:text-white text-xs font-semibold transition-colors duration-300">
                        Read More <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* --- 7. WHY CHOOSE ALAVI HOSPITALS --- */}
      <WhyChooseAlaviBand heading={treatment.whyChooseHeading} />

      {/* --- 8. BOTTOM CTA: BOOK YOUR CONSULTATION --- */}
      {(treatment.bottomCta?.heading || treatment.bottomCta?.description1) && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="py-16 max-w-[1268px] mx-auto px-6 md:px-10"
        >
          <div className="border-2 border-[#663399] rounded-2xl p-8 md:p-14 text-center">
            {treatment.bottomCta.label && (
              <p className="text-[#663399] font-extrabold tracking-wide mb-4">{treatment.bottomCta.label}</p>
            )}
            {treatment.bottomCta.heading && (
              <h2 className="text-xl md:text-2xl font-bold text-[#0066A9] mb-6">{treatment.bottomCta.heading}</h2>
            )}
            {treatment.bottomCta.description1 && (
              <p className="text-[#0C0200] text-base md:text-lg mb-3 max-w-3xl mx-auto">{treatment.bottomCta.description1}</p>
            )}
            {treatment.bottomCta.description2 && (
              <p className="text-[#0C0200] text-base md:text-lg mb-8 max-w-3xl mx-auto">{treatment.bottomCta.description2}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+919603911911">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-white border-2 border-[#663399] text-[#663399] font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#F3E8FF] transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </motion.button>
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsPopupOpen(true)}
                className="bg-[#663399] text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Calendar className="w-4 h-4" /> Book Appointment
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}

      {/* --- 9. FAQS --- */}
      {treatment.faqs?.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          className="py-20 bg-[#FAFAFA]"
        >
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
        </motion.section>
      )}

      <AppointmentPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        defaultSpeciality={treatment.specialityName}
      />
    </div>
  );
}
