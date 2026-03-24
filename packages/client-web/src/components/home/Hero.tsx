"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const heroSlides = [
  { id: 1, image: "/hero-banner.png" }, 
  // { id: 2, image: "/hero-banner.png" },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const isSlider = heroSlides.length > 1;

  // Auto-slide logic
  useEffect(() => {
    if (!isSlider) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isSlider]);

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative w-full"
        >
          {/* Using an aspect-ratio wrapper to ensure the image 
              always fits the screen width perfectly.
              Adjust 'aspect-[21/9]' or 'aspect-[16/6]' to match your banner's dimensions.
          */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/7] lg:aspect-[21/6]">
            <Image
              src={heroSlides[current].image}
              alt={`Banner ${heroSlides[current].id}`}
              fill
              className="object-contain lg:object-fill"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots - Only visible if more than one image */}
      {isSlider && (
        <div className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index 
                  ? "w-10 h-2 bg-[#5B328C]" 
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;