"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const VisionMission: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* Card 1: Our Vision (Dark Purple) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" as const }}
            className="bg-[#663399] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 lg:p-10 text-white flex items-center gap-5 sm:gap-6 shadow-md"
          >
            {/* Eye Icon Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/15 flex items-center justify-center shrink-0 p-3 sm:p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/assets/about-us/OUR VISION.png"
                  alt="Our Vision"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
                Our Vision
              </h2>
              <p className="text-white/95 text-sm sm:text-base leading-relaxed font-normal">
                To become a trusted multi-specialty healthcare institution recognized for medical excellence, innovation, and healthier communities.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Our Mission (Light Purple Tint) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.1 }}
            className="bg-[#F4EFFC] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 lg:p-10 text-[#5B328C] flex items-center gap-5 sm:gap-6 shadow-sm border border-[#E9DCFA]"
          >
            {/* Target Icon Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#E5D5FA] flex items-center justify-center shrink-0 p-3 sm:p-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/assets/about-us/OUR MISSION.png"
                  alt="Our Mission"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5B328C] mb-2 sm:mb-3">
                Our Mission
              </h2>
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed font-normal">
                To deliver accessible, high-quality healthcare through advanced technology, experienced specialists, and compassionate, patient-centered care.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default VisionMission;