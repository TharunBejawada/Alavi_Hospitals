"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight, FaPlay, FaXmark } from "react-icons/fa6";

const talks = [
  {
    id: 1,
    title: "Why are Children becoming overweight at young age",
    doctor: "Dr. Ch. Phani Krishna",
    specialty: "Consultant – Pediatrician & Pediatric Intensivist",
    youtubeUrl: "https://youtube.com/shorts/ZsntijjIMj0",
    videoId: "ZsntijjIMj0",
    image: "https://img.youtube.com/vi/ZsntijjIMj0/hqdefault.jpg",
  },
  {
    id: 2,
    title: "Baby Crying all the time? Here's why",
    doctor: "Dr. N. Aruna Devi",
    specialty: "Consultant Pediatrician & Neonatologist",
    youtubeUrl: "https://youtube.com/shorts/RR1o0S0N2Us",
    videoId: "RR1o0S0N2Us",
    image: "https://img.youtube.com/vi/RR1o0S0N2Us/hqdefault.jpg",
  },
  {
    id: 3,
    title: "Are you using right ORS?",
    doctor: "Dr. Vaishnav Dharmapuri",
    specialty: "Consultant General Physician & Diabetologist",
    youtubeUrl: "https://youtube.com/shorts/oWxb3McL9lc",
    videoId: "oWxb3McL9lc",
    image: "https://img.youtube.com/vi/oWxb3McL9lc/hqdefault.jpg",
  },
];

const DoctorTalks = () => {
  // State for active popup video
  const [selectedVideo, setSelectedVideo] = useState<{ videoId: string; title: string } | null>(null);

  return (
    <section className="py-20 bg-[#F4F7F9] overflow-hidden font-[Poppins]">
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-16 xl:px-20">

        {/* Main Grid Layout: Text on Left, Cards on Right */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-8">

          {/* LEFT COLUMN: Title, Description, & Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/4 flex flex-col justify-center text-center lg:text-left pt-4 pl-0 lg:pl-6"
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#663399] mb-4">
              Doctor Talks
            </h2>
            <p className="text-2xl lg:text-3xl font-semibold text-[#0066A9] leading-[43px] mb-8">
              Expert insights from our doctors
            </p>

            <div className="flex justify-center lg:justify-start">
              <button className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#0066A9] text-[#0066A9] font-semibold hover:bg-[#0066A9] hover:text-white transition-colors duration-300">
                View all Videos <FaArrowRight className="text-sm font-light" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Cards Grid */}
          <div className="w-full lg:w-3/4 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6">
              {talks.map((item, index) => {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    onClick={() => setSelectedVideo({ videoId: item.videoId, title: item.title })}
                    className="group relative rounded-[24px] overflow-hidden bg-white text-gray-900 hover:bg-[#0066A9] hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-2xl border border-gray-100 flex flex-col lg:hover:-translate-y-2"
                  >
                    {/* Thumbnail Image with Play Button Overlay */}
                    <div className="relative w-full h-[220px] lg:h-[240px] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Play Icon Badge */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/20">
                        <div className="w-12 h-12 rounded-full bg-[#0066A9] group-hover:bg-white text-white group-hover:text-[#0066A9] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                          <FaPlay className="text-lg ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 lg:p-7 flex flex-col flex-grow min-h-[190px]">
                      <h3 className="text-[16px] lg:text-[18px] font-bold leading-snug mb-6 text-gray-900 group-hover:text-white transition-colors duration-300 line-clamp-3">
                        {item.title}
                      </h3>

                      {/* Doctor Info Footer */}
                      <div className="mt-auto flex items-center gap-3">
                        {/* Circular 'Dr' Badge */}
                        <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center font-bold text-[14px] bg-[#0066A9] text-white group-hover:bg-white group-hover:text-[#0066A9] transition-colors duration-300 flex-shrink-0">
                          Dr
                        </div>

                        {/* Name & Specialty */}
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] lg:text-[15px] text-gray-900 group-hover:text-white transition-colors duration-300">
                            {item.doctor}
                          </span>
                          <span className="text-[11px] lg:text-[12px] font-medium leading-tight mt-0.5 text-gray-500 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                            {item.specialty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
};

export default DoctorTalks;