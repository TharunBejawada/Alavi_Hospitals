"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaPlay, FaXmark } from "react-icons/fa6";

// --- YOUTUBE PATIENT STORIES DATA ---
const stories = [
  {
    id: 1,
    treatment: "High-Risk Pregnancy to Normal Delivery",
    patient: "Baby Girl Born at Alavi Hospitals",
    videoId: "AYKSRnYh-5Y",
    image: "https://img.youtube.com/vi/AYKSRnYh-5Y/hqdefault.jpg",
  },
  {
    id: 2,
    treatment: "Born at Just 850 Grams, Now She Walks!",
    patient: "Inspiring Preterm Baby Journey",
    videoId: "6hyprC5yJ2k",
    image: "https://img.youtube.com/vi/6hyprC5yJ2k/hqdefault.jpg",
  },
  {
    id: 3, // CENTER BIG ONE (WN162fuCtn4)
    treatment: "Twin Babies Delivered Prematurely in 8th Month",
    patient: "High-Risk Pregnancy Care at Alavi",
    videoId: "WN162fuCtn4",
    image: "https://img.youtube.com/vi/WN162fuCtn4/hqdefault.jpg",
  },
  {
    id: 4,
    treatment: "A Ganesh Chaturthi Blessing",
    patient: "Baby Boy Born Through Normal Delivery",
    videoId: "-NJ1aD2VVSE",
    image: "https://img.youtube.com/vi/-NJ1aD2VVSE/hqdefault.jpg",
  },
  {
    id: 5,
    treatment: "7-Year-Old Boy Swallowed Button Battery",
    patient: "Emergency Surgery Saved His Life",
    videoId: "e1asuiK7SuU",
    image: "https://img.youtube.com/vi/e1asuiK7SuU/hqdefault.jpg",
  },
  {
    id: 6,
    treatment: "High-Risk Umbilical Hernia Treated",
    patient: "Open Hernioplasty Care",
    videoId: "VLJiiD9UpKM",
    image: "https://img.youtube.com/vi/VLJiiD9UpKM/hqdefault.jpg",
  },
  {
    id: 7,
    treatment: "Gestational Diabetes & Cord Around Neck",
    patient: "Successful Normal Delivery",
    videoId: "kpXrQ-VgFkM",
    image: "https://img.youtube.com/vi/kpXrQ-VgFkM/hqdefault.jpg",
  },
];

// Helper Component for the Individual Story Cards
const StoryCard = ({
  data,
  heightClass,
  delay,
  onSelect
}: {
  data: any;
  heightClass: string;
  delay: number;
  onSelect: (video: { videoId: string; title: string }) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      onClick={() => onSelect({ videoId: data.videoId, title: data.treatment })}
      className={`relative w-full ${heightClass} rounded-[20px] overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300`}
    >
      {/* Background Image */}
      <Image
        src={data.image}
        alt={data.patient}
        fill
        unoptimized
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        sizes="(max-width: 768px) 100vw, 20vw"
      />

      {/* Play Icon Badge Overlay */}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 flex items-center justify-center transition-colors">
        <div className="w-11 h-11 rounded-full bg-[#5B328C]/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <FaPlay className="text-base ml-0.5" />
        </div>
      </div>

      {/* Purple Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#5B328C] via-[#5B328C]/80 to-transparent pointer-events-none" />

      {/* Text Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5 text-center flex flex-col items-center justify-end h-full pointer-events-none z-10">
        <h3 className="text-white font-bold text-xs lg:text-sm leading-tight mb-1 whitespace-pre-line drop-shadow-sm line-clamp-3">
          {data.treatment}
        </h3>
        <p className="text-purple-100 text-[11px] lg:text-xs font-medium drop-shadow-sm line-clamp-2">
          {data.patient}
        </p>
      </div>
    </motion.div>
  );
};

export default function PatientStories() {
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string } | null>(null);

  return (
    <section className="py-4 lg:py-8 bg-[#F8FBFF] overflow-hidden font-[Poppins]">
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20">

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
            <StoryCard data={stories[0]} heightClass="h-[280px]" delay={0.1} onSelect={setSelectedVideo} />
          </div>

          {/* Column 2 (Mid Left) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[1]} heightClass="h-[230px]" delay={0.2} onSelect={setSelectedVideo} />
            <StoryCard data={stories[3]} heightClass="h-[230px]" delay={0.3} onSelect={setSelectedVideo} />
          </div>

          {/* Column 3 (Center - Big One: WN162fuCtn4) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[2]} heightClass="h-[480px]" delay={0.4} onSelect={setSelectedVideo} />
          </div>

          {/* Column 4 (Mid Right) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[4]} heightClass="h-[230px]" delay={0.5} onSelect={setSelectedVideo} />
            <StoryCard data={stories[5]} heightClass="h-[230px]" delay={0.6} onSelect={setSelectedVideo} />
          </div>

          {/* Column 5 (Far Right) */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <StoryCard data={stories[6]} heightClass="h-[280px]" delay={0.7} onSelect={setSelectedVideo} />
          </div>

        </div>
      </div>

      {/* YOUTUBE VIDEO POPUP MODAL WITH CLOSE BUTTON */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-[380px] aspect-[9/16] max-h-[85vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              aria-label="Close video popup"
              className="cursor-pointer absolute top-3 right-3 z-30 bg-black/70 hover:bg-black text-white p-2.5 rounded-full transition-all duration-200 shadow-md border border-white/20"
            >
              <FaXmark className="w-5 h-5" />
            </button>

            {/* Embedded YouTube Player */}
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0`}
              title={selectedVideo.title}
              className="w-full h-full border-0 rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}