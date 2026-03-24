"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const talks = [
  {
    title: "Living with PCOD | What Every Woman Should Know",
    doctor: "Dr. Kalyani",
    specialty: "Gynecologist and laparoscopic surgeon",
    image: "/talk-1.jpg", // Replace with your actual thumbnail paths
  },
  {
    title: "Understanding Your Newborn: Essential Care Tips",
    doctor: "Dr. Aruna",
    specialty: "Consultant - Pediatrician and neonatologist",
    image: "/talk-2.jpg",
  },
  {
    title: "Signs & Symptoms of Dengue: When to Seek Help",
    doctor: "Dr. Phani krishna",
    specialty: "Consultant pediatrician and neonatologist",
    image: "/talk-3.jpg",
  },
];

const DoctorTalks = () => {
  // Sets the middle card (index 1) as the default highlighted card
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <section className="py-20 bg-[#F4F7F9] px-4 lg:px-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Doctor Talks
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {talks.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                // Interactive hover state updates the active card
                onMouseEnter={() => setActiveIndex(index)}
                className={`relative rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer shadow-lg ${
                  isActive 
                    ? "bg-[#5B328C] text-white lg:-translate-y-4 lg:shadow-2xl" 
                    : "bg-white text-gray-900 hover:shadow-xl"
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative w-full h-[220px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-col min-h-[200px]">
                  <h3 className={`text-[18px] lg:text-[20px] font-bold leading-snug mb-8 transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-900"
                  }`}>
                    {item.title}
                  </h3>

                  {/* Doctor Info Footer */}
                  <div className="mt-auto flex items-center gap-4">
                    {/* Circular 'Dr' Badge */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] transition-colors duration-300 flex-shrink-0 ${
                      isActive ? "bg-white text-[#5B328C]" : "bg-[#5B328C] text-white"
                    }`}>
                      Dr
                    </div>
                    
                    {/* Name & Specialty */}
                    <div className="flex flex-col">
                      <span className="font-bold text-[15px]">
                        {item.doctor}
                      </span>
                      <span className={`text-[12px] lg:text-[13px] font-medium leading-tight mt-0.5 ${
                        isActive ? "text-purple-200" : "text-gray-500"
                      }`}>
                        {item.specialty}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Slider Pagination Dots */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center items-center gap-3 mt-14"
        >
          {[0, 1, 2].map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setActiveIndex(dotIndex)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                activeIndex === dotIndex 
                  ? "w-12 bg-[#5B328C]" 
                  : "w-8 bg-[#c4b5d6] hover:bg-[#a38cc4]"
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default DoctorTalks;