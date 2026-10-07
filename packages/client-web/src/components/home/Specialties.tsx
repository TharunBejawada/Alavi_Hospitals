"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCirclePlay } from "react-icons/fa6";

// --- STATIC DATA STRUCTURE ---
const specialtiesData = [
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Comprehensive care for adults with a focus on early diagnosis, prevention, and effective treatment of everyday and long-term health conditions.",
    mainImage: "/specialties/general-medicine-main.png",
    features: [
      { title: "Diabetes &\nHypertension", image: "/specialties/diabetes-feat.png" },
      { title: "Thyroid & Chronic\nConditions", image: "/specialties/thyroid-feat.png" },
      { title: "Fever &\nInfections", image: "/specialties/fever-feat.png" },
    ],
    topProcedures: [
      "Liver & pancreatic disease care",
      "Stomach & gut related treatments",
      "Kidney & bladder disease management",
      "Diabetic foot care (non-healing ulcers)"
    ]
  },
  {
    id: "gynecology-obstetrics",
    name: "Gynecology & Obstetrics",
    description: "Expert care for women at every stage of life, from adolescence to pregnancy and menopause.",
    mainImage: "/specialties/gynecology-main.webp",
    features: [
      { title: "PCOS &\nMenstrual Disorders", image: "/specialties/pcos.webp" },
      { title: "Pregnancy\nCare", image: "/specialties/pcos-feat.webp" },
      { title: "Menopause\nManagement", image: "/specialties/menopause-feat.webp" },
    ],
    topProcedures: [
      "Antenatal & Postnatal Care",
      "Normal & Cesarean Deliveries",
      "Laparoscopic Gynecological Surgeries",
      "Infertility Evaluation"
    ]
  },
  {
    id: "pediatrics-neonatology",
    name: "Pediatrics & Neonatology",
    description: "Specialized healthcare for infants, children, and newborns with compassionate care.",
    mainImage: "/specialties/pediatrics-main.webp",
    features: [
      { title: "Childhood\nInfections", image: "/specialties/childhood-feat.webp" },
      { title: "Growth &\nDevelopment", image: "/specialties/growth-feat.webp" },
      { title: "Newborn\nCare", image: "/specialties/newborn-feat.webp" },
    ],
    topProcedures: [
      "Vaccination Programs",
      "Neonatal Care",
      "Pediatric Consultations",
      "Nutritional Guidance"
    ]
  },
  {
    id: "neurology",
    name: "Neurology",
    description: "Comprehensive diagnosis and treatment of disorders affecting the brain, spine, and nerves.",
    mainImage: "/specialties/neurology-main.webp",
    features: [
      { title: "Stroke\nManagement", image: "/specialties/stroke-feat.webp" },
      { title: "Epilepsy\nCare", image: "/specialties/epilepsy-feat.webp" },
      { title: "Migraine &\nHeadaches", image: "/specialties/migraine-feat.webp" },
    ],
    topProcedures: [
      "Stroke Management",
      "EEG Evaluation",
      "Neurological Assessments",
      "Headache Management"
    ]
  },
  {
    id: "orthopedics-sports-injury",
    name: "Orthopedics & Sports Injury",
    description: "Expert treatment for bone, joint, muscle, and sports-related injuries.",
    mainImage: "/specialties/orthopedics-main.webp",
    features: [
      { title: "Fracture\nCare", image: "/specialties/fracture-feat.webp" },
      { title: "Joint\nPain", image: "/specialties/jointpain-feat.webp" },
      { title: "Sports\nInjuries", image: "/specialties/sports-feat.webp" },
    ],
    topProcedures: [
      "Joint Replacement",
      "Arthroscopy",
      "Fracture Care",
      "Sports Rehabilitation"
    ]
  }
];

export default function Specialties() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pillContainerRef = useRef<HTMLDivElement | null>(null);
  const currentSpecialty = specialtiesData[activeIndex];

  // Touch Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Autoplay functionality (3 second interval, pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev === specialtiesData.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Scroll active pill inside the pill container ONLY (without scrolling the browser window)
  useEffect(() => {
    const pill = pillRefs.current[activeIndex];
    const container = pillContainerRef.current;
    if (pill && container) {
      const pillLeft = pill.offsetLeft;
      const pillWidth = pill.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = pillLeft - containerWidth / 2 + pillWidth / 2;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // Navigation Handlers
  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? specialtiesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === specialtiesData.length - 1 ? 0 : prev + 1));
  };

  const handlePillClick = (idx: number) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  // Touch Swipe Handlers for Mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Framer Motion Animation Variants with Custom Direction
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <section className="py-4 lg:py-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20">

        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#5B328C] mb-3 font-[Poppins]">
            Our Specialties
          </h2>
          <p className="text-gray-900 font-medium text-lg font-[Poppins]">
            Comprehensive Care for Every Need
          </p>
        </div>

        {/* Top Pill Navigation */}
        <div
          ref={pillContainerRef}
          className="flex items-center gap-2 overflow-x-auto pb-6 hide-scrollbar max-w-full justify-start md:justify-center px-2"
        >
          {specialtiesData.map((spec, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={spec.id}
                ref={(el) => { pillRefs.current[idx] = el; }}
                onClick={() => handlePillClick(idx)}
                className={`cursor-pointer shrink-0 font-[Poppins] whitespace-nowrap px-6 py-2.5 rounded-full border-2 font-medium text-lg transition-all duration-300 ${isActive
                  ? "bg-[#0066A9] border-[#0066A9] text-white shadow-md scale-105"
                  : "bg-white border-[#0066A9] text-[#000000] hover:bg-blue-50"
                  }`}
              >
                {spec.name}
              </button>
            );
          })}

          <Link href="/specialities" className="shrink-0">
            <button className="cursor-pointer font-[Poppins] whitespace-nowrap px-6 py-2.5 rounded-full border-2 border-[#0066A9] bg-white text-[#0066A9] font-semibold text-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
              View all <FaCirclePlay className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Main Content Card Container */}
        <div
          className="relative mt-4 font-[Poppins]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >

          {/* Outer Navigation Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Previous specialty"
            className="cursor-pointer absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg focus:outline-none"
          >
            <Image
              src="/icons/leftArrow.png"
              alt="Left Navigation"
              fill
              className="object-cover"
            />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next specialty"
            className="cursor-pointer absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg focus:outline-none"
          >
            <Image
              src="/icons/rightArrow.png"
              alt="Right Navigation"
              fill
              className="object-cover"
            />
          </button>

          {/* Gradient Card */}
          <div style={{ background: 'linear-gradient(90deg, #663399 56.94%, #0066A9 116.43%)' }} className="rounded-[32px] md:rounded-[40px] shadow-2xl p-6 lg:p-10 min-h-[450px] flex items-center relative overflow-hidden">

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12"
              >

                {/* Left Side: Main Image */}
                <div className="w-full lg:w-[35%] shrink-0">
                  <div className="relative w-full aspect-[4/3] lg:aspect-square bg-white/20 rounded-[24px] overflow-hidden shadow-inner">
                    {currentSpecialty.mainImage ? (
                      <Image
                        src={currentSpecialty.mainImage}
                        alt={currentSpecialty.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 font-medium">Image Not Available</div>
                    )}
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-[65%] flex flex-col justify-center">

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {currentSpecialty.name}
                  </h3>

                  <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl mb-2">
                    {currentSpecialty.description}
                  </p>
                  <Link href={`/specialities/${currentSpecialty.id}`} className="text-white font-semibold text-sm underline underline-offset-4 mb-8 inline-block hover:text-white/80 transition-colors">
                    Read More...
                  </Link>

                  {/* Features & Procedures Grid */}
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">

                    {/* Small Feature Cards */}
                    <div className="flex gap-4 lg:gap-6 overflow-x-auto max-w-full pb-2 hide-scrollbar">
                      {currentSpecialty.features.map((feat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-3 w-32 md:w-36">
                          <div className="relative w-32 h-36 md:w-36 md:h-40 rounded-2xl overflow-hidden bg-white/20 shrink-0 shadow-sm border border-white/10">
                            {feat.image && (
                              <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                            )}
                          </div>
                          <p className="text-white text-[11px] md:text-xs font-medium leading-snug whitespace-pre-line">
                            {feat.title}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Top Procedures List */}
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-4">Top Procedures</h4>
                      <ul className="space-y-3">
                        {currentSpecialty.topProcedures.map((proc, idx) => (
                          <li key={idx} className="text-white/90 text-sm flex items-start gap-2">
                            <span className="text-white text-[10px] mt-1.5 shrink-0">●</span>
                            <span className="leading-snug">{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <Link href={`/doctors?specialty=${currentSpecialty.id}`}>
                      <button className="cursor-pointer bg-[#FFFFFF] text-[#663399] hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-base sm:text-lg shadow-md transition-colors hover:shadow-lg">
                        Find a doctor
                      </button>
                    </Link>
                    <Link href={`/specialities/${currentSpecialty.id}`}>
                      <button className="cursor-pointer bg-[#FFFFFF] text-[#663399] hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-base sm:text-lg shadow-md transition-colors hover:shadow-lg">
                        Explore more
                      </button>
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Pagination Dots Indicator */}
          <div className="flex justify-center items-center gap-2.5 mt-6">
            {specialtiesData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePillClick(idx)}
                className={`cursor-pointer transition-all duration-300 rounded-full ${activeIndex === idx
                  ? "w-8 h-2.5 bg-[#0066A9]"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-[#0066A9]/50"
                  }`}
                aria-label={`Go to specialty ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Hide Scrollbar Style for the Tabs */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}