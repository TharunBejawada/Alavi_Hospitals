"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- STATIC DATA STRUCTURE ---
const stories = [
  {
    id: 1,
    treatment: "Asthma & Respiratory\nTreatment",
    patient: "Mr. Imran Khan",
    image: "/stories/asthma.png", // Replace with your actual paths
  },
  {
    id: 2,
    treatment: "Laparoscopic Hernia\nSurgery",
    patient: "Mrs. Kavitha Rao",
    image: "/stories/hernia.png",
  },
  {
    id: 3,
    treatment: "Neonatal Care\n(Preterm Baby)",
    patient: "Baby Aarav",
    image: "/stories/neonatal.png",
  },
  {
    id: 4,
    treatment: "Diabetes Management",
    patient: "Mr. Ramesh Kumar",
    image: "/stories/diabetes.png",
  },
  {
    id: 5,
    treatment: "Knee Replacement\nSurgery",
    patient: "Mrs. Lakshmi Devi",
    image: "/stories/knee.png",
  },
  {
    id: 6,
    treatment: "Stroke Treatment",
    patient: "Mr. Suresh Reddy",
    image: "/stories/stroke.png",
  },
  {
    id: 7,
    treatment: "Angioplasty Procedure",
    patient: "Mr. Anil Sharma",
    image: "/stories/angioplasty.png",
  },
];

// Helper Component for the Individual Story Cards
const StoryCard = ({ data, heightClass, delay }: { data: any; heightClass: string; delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`relative w-full ${heightClass} rounded-[20px] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Background Image */}
      <Image
        src={data.image}
        alt={data.patient}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        sizes="(max-width: 768px) 100vw, 20vw"
      />

      {/* Purple Gradient Overlay */}
      {/* Covers the bottom 60% of the image, transitioning from solid purple to transparent */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#5B328C] via-[#5B328C]/80 to-transparent pointer-events-none" />

      {/* Text Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 text-center flex flex-col items-center justify-end h-full pointer-events-none">
        <h3 className="text-white font-bold text-sm leading-tight mb-1.5 whitespace-pre-line">
          {data.treatment}
        </h3>
        <p className="text-white/90 text-sm font-medium">
          {data.patient}
        </p>
      </div>
    </motion.div>
  );
};

export default function PatientStories() {
  return (
    <section className="py-4 lg:py-8 bg-[#F8FBFF] overflow-hidden font-[Poppins]">
      <div className="container mx-auto max-w-[1400px] px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold text-[#663399] mb-4"
          >
            Patient Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#0C0200] text-xl font-medium leading-relaxed"
          >
            Real experiences, real recoveries. Hear from our patients as they share their journey of healing, trust and expert care at Alavi Hospitals.
          </motion.p>
        </div>

        {/* Staggered Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 items-center">
          
          {/* Column 1 (Far Left) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[0]} heightClass="h-[280px]" delay={0.1} />
          </div>

          {/* Column 2 (Mid Left) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[1]} heightClass="h-[230px]" delay={0.2} />
            <StoryCard data={stories[2]} heightClass="h-[230px]" delay={0.3} />
          </div>

          {/* Column 3 (Center - Tall) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[3]} heightClass="h-[480px]" delay={0.4} />
          </div>

          {/* Column 4 (Mid Right) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[4]} heightClass="h-[230px]" delay={0.5} />
            <StoryCard data={stories[5]} heightClass="h-[230px]" delay={0.6} />
          </div>

          {/* Column 5 (Far Right) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[6]} heightClass="h-[280px]" delay={0.7} />
          </div>

        </div>
      </div>
    </section>
  );
}