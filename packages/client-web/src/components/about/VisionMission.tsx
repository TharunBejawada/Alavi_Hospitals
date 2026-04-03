"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaEye, FaBullseye } from "react-icons/fa6";

const VisionMission = () => {
  return (
    <section className="py-16 bg-[#F6FBFF] px-4 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row w-full rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
        >
          
          {/* Vision Section (Purple) */}
          <div className="bg-[#5B328C] text-white p-10 lg:p-16 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <FaEye className="text-4xl" />
              <h2 className="text-2xl lg:text-3xl font-bold">Our Vision</h2>
            </div>
            <p className="text-white/90 leading-relaxed text-[15px] lg:text-[17px]">
              To become a leading and trusted multi-specialty healthcare institution, recognized for excellence in medical care, innovation in treatment and dedication to improving the health of the communities we serve.
            </p>
          </div>

          {/* Mission Section (White) */}
          <div className="bg-white text-gray-800 p-10 lg:p-16 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <FaBullseye className="text-[#5B328C] text-4xl" />
              <h2 className="text-[#5B328C] text-2xl lg:text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-[15px] lg:text-[17px]">
              Our mission is to provide high-quality, compassionate and accessible healthcare by combining advanced medical technology, experienced specialists and a patient-first approach that prioritizes safety, comfort and well-being.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default VisionMission;