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
  { id: 3, title: "Get Second Opinion", iconSrc: "/patients.png", link: "/second-opinion" },
];

const bottomNavItems = [
  { title: "Book an Appointment", link: "/contact" },
  { title: "Second Opinion", link: "/second-opinion" },
  { title: "Book health Check", link: "/packages" },
  { title: "Know Our Doctors", link: "/doctors" },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[750px] overflow-hidden bg-gray-900 flex items-end font-[Poppins]">
      
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
      <div className="fixed left-0 top-1/3 flex flex-col gap-[8px] z-50">
      {leftNavItems.map((item) => (
        <motion.div
          key={item.id}
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={{
            rest: { width: "72px" },
            hover: { width: "227px" }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#663399] text-white overflow-hidden rounded-r-[11px] shadow-[5px_5px_15px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          <Link href={item.link} className="flex items-center w-[227px] h-[69px] relative">
            
            {/* TEXT CONTAINER */}
            <motion.div 
              variants={{
                rest: { opacity: 0, x: -10 },
                hover: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-[20px] w-[126px] h-[27px] flex items-center"
            >
              <span className="whitespace-nowrap font-['Poppins'] font-medium text-[18px] leading-[148%] text-white">
                {item.title}
              </span>
            </motion.div>

            {/* ICON CONTAINER */}
            {/* FIX: Changed to motion.div and used variants to slide it to 157px on hover */}
            <motion.div 
              variants={{
                rest: { left: "20px" },
                hover: { left: "180px" }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute flex justify-center items-center"
            >
              <div className="relative w-[31px] h-[31px]">
                <Image 
                  src={item.iconSrc} 
                  alt={item.title} 
                  fill 
                  className="object-contain" 
                />
              </div>
            </motion.div>

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
        <div className="flex flex-col md:flex-row bg-[#0066A9] backdrop-blur-md rounded-[24px] md:rounded-[40px] shadow-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/20 border border-white/10">
          {bottomNavItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.link}
              className="flex-1 group flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 hover:bg-white/10 transition-colors duration-300"
            >
              <span className="text-white font-semibold text-lg lg:text-lg whitespace-nowrap">
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