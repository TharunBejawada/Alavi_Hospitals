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
    <section className="bg-white overflow-hidden py-4 lg:py-8 font-[Poppins]">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#663399]">
          Why Patients Trust Us?
        </h2>
      </div>

      <div className="py-12 relative w-full bg-[#5B328C] min-h-[500px] flex items-center">
        
        {/* BACKGROUND FIX: Added object-left so the left side of the image never crops */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/why-trust-bg.png" 
            alt="Background Layout" 
            fill 
            className="object-cover object-left md:object-center"
            priority
          />
        </div> 
       
        <div className="container mx-auto max-w-7xl px-4 lg:px-12 relative z-10 py-12 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32 items-center">
            
            {/* LEFT COLUMN: Empty space to push the text to the right, letting the background image show through */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 w-full flex justify-center lg:justify-start self-end hidden lg:flex"
            >
              {/* Keeping the empty height container so the grid layout stays perfectly balanced */}
              <div className="relative w-full max-w-[480px] h-[320px] sm:h-[400px] lg:h-[520px] shrink-0">
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Interactive Grid List of Core Strengths */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-7 space-y-6 md:space-y-8"
            >
              {trustItems.map((item) => (
                <motion.div 
                  variants={itemVariants}
                  key={item.id}
                  className="flex items-start gap-4 lg:gap-5 group"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 relative shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Image 
                      src={item.iconSrc} 
                      alt={item.title} 
                      fill 
                      className="object-contain" 
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <h3 className="text-white font-bold text-lg mb-1 tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-white text-sm leading-normal max-w-2xl font-medium">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}