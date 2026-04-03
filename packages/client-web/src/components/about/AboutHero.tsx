"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-white"
    >
      {/* 1. Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: "url('/about-hero-bg.png')", // Replace with your actual path
        }}
      />

      {/* 2. Brand Purple Color Overlay
          Using the specific Alavi Purple (#5B328C) at high opacity
          to replicate the design's effect.
      */}
      <div 
        className="absolute inset-0 bg-[#5B328C]/90 z-10" 
        aria-hidden="true"
      />

      {/* 3. Text Content Container */}
      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-4xl">
          
          {/* Animated Main Heading: Slides up and fades in */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8"
          >
            About Alavi Hospitals
          </motion.h1>

          {/* Animated Description: Fades in with a slight delay */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-white text-lg md:text-xl font-medium leading-relaxed max-w-3xl"
          >
            A rapidly growing multi-specialty healthcare institution committed to delivering compassionate, ethical and high-quality medical care to the community.
          </motion.p>
          
        </div>
      </div>
    </section>
  );
};

export default AboutHero;