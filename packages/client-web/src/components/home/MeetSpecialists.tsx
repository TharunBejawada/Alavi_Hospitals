"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"; 
import { API_URL } from "../../config"; 

export default function MeetSpecialists() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Carousel State & Refs ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch doctors on mount
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch(`${API_URL}/api/doctors/getAllEnabledDoctors`);
        const data = await response.json();
        setDoctors(data.Items || []);
      } catch (error) {
        console.error("Failed to fetch specialists:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  // --- Carousel Functions ---
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 0;
      const gap = 24; // gap-6 = 24px
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(index);
    }
  };

  const scrollToDoctor = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 0;
      const gap = 24;
      carouselRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 0;
      carouselRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0]?.clientWidth || 0;
      carouselRef.current.scrollBy({ left: (cardWidth + 24), behavior: 'smooth' });
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Determine if carousel controls are needed based on screen size approximations
  // (We use > 4 as the trigger for desktop, > 2 for tablet, > 1 for mobile automatically via CSS)
  const showControls = doctors.length > 4;

  return (
    <section className="py-4 lg:py-8 bg-white overflow-hidden font-[Poppins]">
      <div className="container mx-auto max-w-8xl px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0066A9] mb-4">
            Meet Our Specialists
          </h2>
          <p className="text-[#0C0200] text-xl font-medium leading-normal">
            Delivering trusted, high-quality care through experienced doctors focused on accurate diagnosis, advanced treatment and patient well-being.
          </p>
        </div>

        {/* Main Blue Container Block */}
        <div className="bg-[#0066A9] rounded-[30px] p-6 md:p-8 lg:p-10 shadow-xl min-h-[400px] flex flex-col justify-center relative">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-white mb-3" />
              <p className="text-white font-medium animate-pulse">Loading Specialists...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-lg font-medium">No specialists found at the moment.</p>
            </div>
          ) : (
            <div className="relative group/carousel">
              
              {/* Left Arrow (Only if > 4 doctors) */}
              {showControls && (
                <button 
                  onClick={scrollLeft}
                  className="cursor-pointer absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white text-[#0066A9] p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 hover:bg-[#F4F9FF]"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Dynamic Container: Flex row with scroll snap */}
              <motion.div 
                ref={carouselRef}
                onScroll={handleScroll}
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className={`flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4 pt-2 ${
                  doctors.length <= 4 ? "lg:justify-center" : ""
                }`}
              >
                {doctors.map((doctor) => {
                  const designationLines = Array.isArray(doctor.designations) 
                    ? doctor.designations 
                    : doctor.designation 
                      ? doctor.designation.split(",").map((d: string) => d.trim()) 
                      : [];

                  return (
                    <motion.div 
                      variants={cardVariants}
                      key={doctor.doctorId || doctor.id} 
                      // Width calculations: 1 on Mobile, 2 on Tablet, 4 on Desktop
                      className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] shrink-0 snap-start group bg-white rounded-2xl p-5 flex flex-col border-2 border-transparent hover:bg-[#004A85] hover:border-white transition-all duration-300 shadow-md hover:shadow-2xl"
                    >
                      
                      {/* Image Container with Purple Border */}
                      <div className="w-full bg-[#F4F9FF] rounded-[28px] border-[2px] border-[#663399] overflow-hidden aspect-square relative mb-5">
                        {doctor.image ? (
                          <Image 
                            src={doctor.image} 
                            alt={doctor.name} 
                            fill 
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 font-medium">
                            Alavi Hospitals
                          </div>
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col flex-1 text-center">
                        <h3 className="text-[18px] font-bold text-[#663399] group-hover:text-white transition-colors mb-2 line-clamp-1">
                          {doctor.name}
                        </h3>
                        
                        <div className="text-[15px] font-normal text-[#000000] group-hover:text-white/90 transition-colors leading-snug mb-6 flex-1">
                          {designationLines.map((line: string, idx: number) => (
                            <p key={idx}>{line}</p>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row gap-2 mt-auto">
                          <Link href={`/doctors/${doctor.url || doctor.doctorId}`} className="flex-1">
                            <button className="cursor-pointer w-full bg-[#005B9F] group-hover:bg-white text-white group-hover:text-[#005B9F] font-semibold text-[13px] lg:text-[14px] py-2.5 px-1 rounded transition-colors whitespace-nowrap shadow-sm">
                              Know More
                            </button>
                          </Link>
                          <Link href={`/contact?doctor=${encodeURIComponent(doctor.name)}`} className="flex-1">
                            <button className="cursor-pointer w-full bg-[#005B9F] group-hover:bg-white text-white group-hover:text-[#005B9F] font-semibold text-[13px] lg:text-[14px] py-2.5 px-1 rounded transition-colors whitespace-nowrap shadow-sm">
                              Book Appointment
                            </button>
                          </Link>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Right Arrow (Only if > 4 doctors) */}
              {showControls && (
                <button 
                  onClick={scrollRight}
                  className="cursor-pointer absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white text-[#0066A9] p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[#F4F9FF]"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Bottom Clickable Dots (Calculates how many "pages" are needed based on desktop 4-view) */}
              {showControls && (
                <div className="flex justify-center items-center gap-2.5 mt-6">
                  {/* Generate dots. We subtract 3 because the last 4 cards fit on one screen. */}
                  {Array.from({ length: Math.max(1, doctors.length - 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToDoctor(idx)}
                      className={`cursor-pointer rounded-full transition-all duration-300 ${
                        activeIndex === idx 
                          ? "w-3 h-3 bg-white" 
                          : "w-2 h-2 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          )}
          
        </div>
      </div>

      {/* Global CSS to hide the ugly native scrollbar but keep the scrolling functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}