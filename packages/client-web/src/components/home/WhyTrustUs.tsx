"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const trustItems = [
  {
    id: 1,
    title: "Affordable Medical Services",
    description:
      "High-quality treatments delivered at transparent and affordable costs without compromising care.",
    iconSrc: "/icons/affordable.png",
  },
  {
    id: 2,
    title: "Compassionate Approach",
    description:
      "We treat every patient with empathy, care, and attention, just like family.",
    iconSrc: "/icons/compassionate.png",
  },
  {
    id: 3,
    title: "Patient-Centered Care",
    description:
      "We respect every patient’s needs, values, and comfort, providing personalized treatment with dignity.",
    iconSrc: "/icons/patient-care.png",
  },
  {
    id: 4,
    title: "Quality & Trust",
    description:
      "Committed to delivering reliable healthcare services with consistent outcomes and patient satisfaction.",
    iconSrc: "/icons/quality-trust.png",
  },
  {
    id: 5,
    title: "24/7 Medical Support",
    description:
      "Experienced doctors and emergency services available anytime for immediate care and assistance.",
    iconSrc: "/icons/support.png",
  },
  {
    id: 6,
    title: "Dedicated Team",
    description:
      "A skilled and friendly team focused on providing smooth, supportive, and efficient patient care.",
    iconSrc: "/icons/team.png",
  },
];

export default function WhyTrustUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="bg-white overflow-hidden py-8 sm:py-12 font-sans">
      <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#663399]">
            Why Patients Trust Us?
          </h2>
        </div>

        {/* Rounded Purple Banner Container Card */}
        <div className="relative w-full bg-[#663399] rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[540px]">
            {/* LEFT COLUMN: Doctor & Patient Image */}
            <div className="lg:col-span-6 relative w-full h-[260px] sm:h-[340px] md:h-[400px] lg:h-auto min-h-full overflow-hidden">
              <Image
                src="/why-trust-bg.png"
                alt="Why Patients Trust Us - Alavi Hospitals"
                fill
                className="object-cover object-[35%_18%] lg:object-left-bottom"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Mobile bottom gradient to softly blend into purple content */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#663399] to-transparent lg:hidden pointer-events-none" />
            </div>

            {/* RIGHT COLUMN: 6 Core Strengths */}
            <div className="lg:col-span-6 flex flex-col justify-center py-7 sm:py-9 lg:py-12 px-5 sm:px-8 lg:pl-6 lg:pr-10 xl:pr-14">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="space-y-4 sm:space-y-5 lg:space-y-5"
              >
                {trustItems.map((item) => (
                  <motion.div
                    variants={itemVariants}
                    key={item.id}
                    className="flex items-start gap-3.5 sm:gap-4.5 lg:gap-5 group"
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 relative shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={item.iconSrc}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col text-left">
                      <h3 className="text-white font-bold text-[16px] sm:text-[17px] lg:text-[18px] leading-snug mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/95 text-[12.5px] sm:text-[13.5px] lg:text-[14px] leading-relaxed font-normal">
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