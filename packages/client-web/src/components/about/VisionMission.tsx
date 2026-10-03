"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Search } from "lucide-react";

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
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-[#663399] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 lg:p-10 text-white flex items-center gap-5 sm:gap-6 shadow-md"
          >
            {/* Eye Icon Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <div className="relative flex items-center justify-center">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.573 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35"
                  />
                </svg>
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
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="bg-[#F4EFFC] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 lg:p-10 text-[#5B328C] flex items-center gap-5 sm:gap-6 shadow-sm border border-[#E9DCFA]"
          >
            {/* Target Icon Circle */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#E5D5FA] flex items-center justify-center shrink-0">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-[#5B328C] stroke-[2]" />
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