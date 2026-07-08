"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRightCircle } from "react-icons/fi";
import AppointmentPopup from "../../components/AppointmentPopup";

// Added isPopup flag to the first item
const bottomNavItems = [
  { title: "Book an Appointment", link: "#", isPopup: true }, 
  { title: "Second Opinion", link: "/second-opinion" },
  { title: "Book health Check", link: "/packages" },
  { title: "Know Our Doctors", link: "/doctors" },
];

const Hero = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[750px] overflow-hidden bg-gray-900 flex items-end font-[Poppins]">
      
      {/* 1. Background Image & Custom PNG Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-banner.png" 
          alt="Advanced Operating Room" 
          fill 
          className="object-cover" 
          priority 
        />
        <Image 
          src="/hero-gradient.png"
          alt="Gradient Overlay"
          fill
          className="object-cover mix-blend-multiply opacity-90"
          priority
        />
      </div>

      {/* 2. Bottom Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-30 w-[95%] lg:w-[90%] max-w-7xl mx-auto mb-10 lg:mb-16"
      >
        <div className="flex flex-col md:flex-row bg-[#0066A9] backdrop-blur-md rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/20 border border-white/10">
          {bottomNavItems.map((item, index) => {
            // Extracted the inner content to avoid duplicating code
            const itemContent = (
              <>
                <span className="text-white font-semibold text-lg lg:text-lg whitespace-nowrap text-left">
                  {item.title}
                </span>
                <FiArrowRightCircle className="text-white/60 text-[26px] font-light group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </>
            );

            // If it's the popup item, render a button. Otherwise, render a Next.js Link.
            return item.isPopup ? (
              <button
                key={index}
                onClick={() => setIsPopupOpen(true)}
                className="w-full flex-1 group flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 hover:bg-white/10 transition-colors duration-300 cursor-pointer"
              >
                {itemContent}
              </button>
            ) : (
              <Link 
                key={index} 
                href={item.link}
                className="flex-1 group flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 hover:bg-white/10 transition-colors duration-300"
              >
                {itemContent}
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* 3. Render the Popup */}
      <AppointmentPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />

    </section>
  );
};

export default Hero;