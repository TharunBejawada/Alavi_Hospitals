"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6"; // Added for the button

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
      <div className="container mx-auto max-w-[1400px]">
        
        {/* Main Grid Layout: Text on Left, Cards on Right */}
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-8">
          
          {/* LEFT COLUMN: Title, Description, & Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/4 flex flex-col justify-center text-center lg:text-left pt-4"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#5B328C] mb-4">
              Doctor Talks
            </h2>
            <p className="text-2xl lg:text-3xl font-bold text-[#275997] leading-tight mb-8">
              Expert insights from our doctors
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <button className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#5B328C] text-[#5B328C] font-semibold hover:bg-[#5B328C] hover:text-white transition-colors duration-300">
                View all Videos <FaArrowRight className="text-sm font-light" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Interactive Cards Grid */}
          <div className="w-full lg:w-3/4 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6">
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
                    className={`relative rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer shadow-md border border-gray-100 ${
                      isActive 
                        ? "bg-[#5B328C] text-white lg:-translate-y-4 lg:shadow-xl" 
                        : "bg-white text-gray-900 hover:shadow-lg"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-[200px] lg:h-[220px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content Container */}
                    <div className="p-6 lg:p-8 flex flex-col flex-grow min-h-[200px]">
                      <h3 className={`text-[17px] lg:text-[19px] font-bold leading-snug mb-8 transition-colors duration-300 line-clamp-3 ${
                        isActive ? "text-white" : "text-gray-900"
                      }`}>
                        {item.title}
                      </h3>

                      {/* Doctor Info Footer */}
                      <div className="mt-auto flex items-center gap-3">
                        {/* Circular 'Dr' Badge */}
                        <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center font-bold text-[14px] transition-colors duration-300 flex-shrink-0 ${
                          isActive ? "bg-white text-[#5B328C]" : "bg-[#5B328C] text-white"
                        }`}>
                          Dr
                        </div>
                        
                        {/* Name & Specialty */}
                        <div className="flex flex-col">
                          <span className="font-bold text-[14px] lg:text-[15px]">
                            {item.doctor}
                          </span>
                          <span className={`text-[11px] lg:text-[12px] font-medium leading-tight mt-0.5 line-clamp-2 ${
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
              className="flex justify-center items-center gap-3 mt-10 lg:mt-12"
            >
              {[0, 1, 2].map((dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setActiveIndex(dotIndex)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    activeIndex === dotIndex 
                      ? "w-10 bg-[#5B328C]" 
                      : "w-6 bg-[#c4b5d6] hover:bg-[#a38cc4]"
                  }`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DoctorTalks;