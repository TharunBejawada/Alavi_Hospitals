"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative w-full bg-[#663399] overflow-hidden flex items-center h-full">
      {/* Building Image - Constrained to right side to avoid overlapping text */}
      <div className="absolute right-0 bottom-0 top-0 w-full sm:w-[85%] md:w-[70%] lg:w-[52%] xl:w-[48%] flex justify-end items-end pointer-events-none z-0">
        <Image
          src="/About_Us_Banner.png"
          alt="Alavi Hospitals Building"
          width={900}
          height={500}
          className="h-full w-full object-contain object-bottom-right"
          priority
        />
      </div>

      {/* Mobile/Tablet gradient overlay for smooth text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#663399] via-[#663399]/90 to-transparent lg:hidden z-0 pointer-events-none" />

      {/* Left Content Container */}
      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-8 sm:py-10 lg:py-12 relative z-10 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="w-full lg:w-[50%] xl:w-[52%] max-w-xl lg:max-w-2xl text-white"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-bold leading-[1.18] tracking-tight text-white mb-4 sm:mb-5">
            Care That Goes Beyond <br className="hidden sm:inline" />
            Treatment
          </h1>
          <p className="text-white/95 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl">
            At Alavi Hospitals, we believe healthcare is about more than medicine. It&apos;s about understanding people, building trust, and caring for our community.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
