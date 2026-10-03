"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutConclusion: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#FAFCFF] border border-[#E9F2FA] shadow-sm flex flex-col lg:flex-row items-center min-h-[340px] lg:min-h-[380px]"
        >
          {/* Left Text Content Area */}
          <div className="w-full lg:w-[56%] p-6 sm:p-10 lg:p-12 z-20 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#5B328C] leading-tight mb-4 sm:mb-5">
              Caring Beyond Hospital Walls
            </h2>

            <p className="text-gray-800 text-sm sm:text-base lg:text-[16px] leading-relaxed font-medium mb-4">
              Through regular health camps, awareness programs, and preventive healthcare initiatives, we strive to build healthier communities.
            </p>

            <p className="text-gray-600 text-sm sm:text-base lg:text-[16px] leading-relaxed">
              At Alavi Hospitals, we believe healthcare is about more than treatment. It is about building trust, improving lives, and caring for every patient with dedication and compassion.
            </p>
          </div>

          {/* Right Image Area using high-res caring_beyond_image.png */}
          <div className="relative w-full lg:w-[48%] h-[260px] sm:h-[320px] lg:h-[380px] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 z-10 overflow-hidden">
            {/* Soft left gradient fade for seamless integration */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#FAFCFF] via-[#FAFCFF]/80 to-transparent z-10 pointer-events-none" />

            <Image
              src="/caring_beyond_image.png"
              alt="Caring Beyond Hospital Walls - Alavi Hospitals Nurse caring for senior patient"
              fill
              className="object-cover object-center lg:object-right"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutConclusion;