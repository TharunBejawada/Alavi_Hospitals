"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const trustItems = [
  {
    id: 1,
    title: "Affordable Medical Services",
    description: "High-quality treatments delivered at transparent and affordable costs without compromising care.",
    iconSrc: "/icons/affordable.png",
  },
  {
    id: 2,
    title: "Compassionate Approach",
    description: "We treat every patient with empathy, care, and attention, just like family.",
    iconSrc: "/icons/compassionate.png",
  },
  {
    id: 3,
    title: "Patient-Centered Care",
    description: "We respect every patient's needs, values, and comfort, providing personalized treatment with dignity.",
    iconSrc: "/icons/patient-care.png",
  },
  {
    id: 4,
    title: "Quality & Trust",
    description: "Committed to delivering reliable healthcare services with consistent outcomes and patient satisfaction.",
    iconSrc: "/icons/quality-trust.png",
  },
  {
    id: 5,
    title: "24/7 Medical Support",
    description: "Experienced doctors and emergency services available anytime for immediate care and assistance.",
    iconSrc: "/icons/support.png",
  },
  {
    id: 6,
    title: "Dedicated Team",
    description: "A skilled and friendly team focused on providing smooth, supportive, and efficient patient care.",
    iconSrc: "/icons/team.png",
  },
];

export default function WhyTrustUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="bg-white overflow-hidden py-4 lg:py-4 font-[Poppins]">
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20">

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#663399]">
            Why Patients Trust Us?
          </h2>
        </div>

        {/* Rounded Purple Banner Container Card */}
        <div className="relative w-full bg-[#5B328C] rounded-[24px] lg:rounded-[32px] overflow-hidden min-h-[450px] lg:min-h-[500px] flex items-center shadow-xl">

          {/* Dedicated Left Image Container - Constrained to Left 40% on desktop, hidden on mobile */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[40%] z-0 overflow-hidden pointer-events-none">
            <Image
              src="/why-trust-bg.png"
              alt="Why Patients Trust Us"
              fill
              className="object-cover lg:object-contain object-left"
              priority
            />
          </div>

          <div className="w-full relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

              {/* LEFT COLUMN: Empty space to allow the background doctor image to show through */}
              <div className="lg:col-span-5 hidden lg:block h-[350px] lg:h-[460px]" />

              {/* RIGHT COLUMN: Grid List of Core Strengths */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="lg:col-span-7 space-y-4 sm:space-y-5"
              >
                {trustItems.map((item) => (
                  <motion.div
                    variants={itemVariants}
                    key={item.id}
                    className="flex items-start gap-3 lg:gap-4 group"
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 relative shrink-0 transition-transform duration-300 group-hover:scale-110 mt-0.5">
                      <Image
                        src={item.iconSrc}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex flex-col text-left">
                      <h3 className="text-white font-bold text-base lg:text-lg mb-0.5 tracking-wide leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-white/95 text-xs sm:text-sm leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}