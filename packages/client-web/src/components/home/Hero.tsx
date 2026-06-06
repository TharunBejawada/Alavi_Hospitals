"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRightCircle } from "react-icons/fi";

// 1. Updated to use iconSrc for your custom PNG paths
const leftNavItems = [
  { id: 1, title: "Find A Doctor", iconSrc: "/find-doctor.png", link: "/doctors" },
  { id: 2, title: "Health Packages", iconSrc: "/health-packages.png", link: "/packages" },
  { id: 3, title: "Patients", iconSrc: "/patients.png", link: "/patients" },
];

const bottomNavItems = [
  { title: "Book an Appointment", link: "/contact" },
  { title: "Second Opinion", link: "/second-opinion" },
  { title: "Book health Check", link: "/packages" },
  { title: "Know Our Doctors", link: "/doctors" },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[750px] overflow-hidden bg-gray-900 flex items-end">
      
      {/* 1. Background Image & Custom PNG Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image */}
        <Image 
          src="/hero-banner.png" 
          alt="Advanced Operating Room" 
          fill 
          className="object-cover" 
          priority 
        />
        
        {/* Custom PNG Gradient Overlay */}
        <Image 
          src="/hero-gradient.png"
          alt="Gradient Overlay"
          fill
          className="object-cover mix-blend-multiply opacity-90" // Adjust opacity or remove mix-blend if your PNG already has transparency baked in perfectly
          priority
        />
      </div>

      {/* 2. Left Floating Interactive Bar */}
      <div className="absolute left-0 top-1/3 flex flex-col gap-[4px] z-30">
        {leftNavItems.map((item) => (
          <motion.div
            key={item.id}
            initial="rest"
            whileHover="hover"
            animate="rest"
            // Start at 64px width (showing just the icon), expand to 200px on hover
            variants={{
              rest: { width: "64px" },
              hover: { width: "200px" }
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-[#5B328C] text-white overflow-hidden rounded-r-xl shadow-[5px_5px_15px_rgba(0,0,0,0.2)] cursor-pointer flex items-center justify-end"
          >
            <Link href={item.link} className="flex items-center justify-between w-[200px] h-[64px] px-5">
              <motion.span 
                variants={{
                  rest: { opacity: 0, x: -10 },
                  hover: { opacity: 1, x: 0 }
                }}
                className="whitespace-nowrap font-medium text-[15px]"
              >
                {item.title}
              </motion.span>
              <div className="shrink-0 flex justify-center w-[24px] h-[24px] relative">
                {/* Replaced FontAwesome with your custom PNG icons */}
                <Image 
                  src={item.iconSrc} 
                  alt={item.title} 
                  fill 
                  className="object-contain" 
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 3. Bottom Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-30 w-[95%] lg:w-[90%] max-w-7xl mx-auto mb-10 lg:mb-16"
      >
        <div className="flex flex-col md:flex-row bg-[#275997]/90 backdrop-blur-md rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/20 border border-white/10">
          {bottomNavItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.link}
              className="flex-1 group flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 hover:bg-white/10 transition-colors duration-300"
            >
              <span className="text-white font-semibold text-sm lg:text-[15px] whitespace-nowrap">
                {item.title}
              </span>
              <FiArrowRightCircle className="text-white/60 text-[26px] font-light group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </motion.div>

    </section>
  );
};

export default Hero;