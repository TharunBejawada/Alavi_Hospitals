"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutConclusion = () => {
  return (
    <section className="py-16 pb-24 bg-[#FAFAFA] px-4 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        
        {/* Commitment to Community Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 bg-[#E7D8F5]/20 w-full p-4 lg:p-8 rounded-[8px]">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#5B328C] text-2xl lg:text-3xl font-bold mb-6">
              Commitment to Community Health
            </h2>
            <p className="text-gray-800 leading-relaxed text-[15px] lg:text-[16px] mb-6">
              At Alavi Hospitals, our responsibility extends beyond hospital walls. We actively contribute to the health and well-being of the community through regular health awareness programs and medical camps.
            </p>
            <p className="text-gray-800 leading-relaxed text-[15px] lg:text-[16px]">
              Through these initiatives, we strive to ensure that quality healthcare remains accessible and beneficial to the broader community.
            </p>
          </motion.div>

          {/* Right Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="bg-white p-6 lg:p-8 rounded-[16px] shadow-sm border border-purple-50">
              <h3 className="text-[#5B328C] font-bold text-[17px] mb-2">Free Gynecology Camp</h3>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                Conducted on the 9th of every month, providing accessible women's healthcare.
              </p>
            </div>
            
            <div className="bg-white p-6 lg:p-8 rounded-[16px] shadow-sm border border-purple-50">
              <h3 className="text-[#5B328C] font-bold text-[17px] mb-2">Multi-Specialty Health Camps</h3>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                Regular community camps promoting preventive healthcare and early diagnosis.
              </p>
            </div>
          </motion.div>
          
        </div>

        {/* Building a Healthier Future Together Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto bg-[#F6FBFF] w-full p-4 lg:p-8 rounded-[8px]"
        >
          <h2 className="text-[#5B328C] text-2xl lg:text-3xl font-bold mb-6">
            Building a Healthier Future Together
          </h2>
          <p className="text-gray-800 leading-relaxed text-[15px] lg:text-[16px] mb-6">
            At Alavi Hospitals, we believe healthcare is about more than treatment, it is about building trust, improving lives, and creating healthier communities. With experienced doctors, modern facilities and a strong commitment to patient care, we continue to grow as a reliable healthcare partner for families and individuals.
          </p>
          <p className="text-gray-800 leading-relaxed text-[15px] lg:text-[16px]">
            As we look toward the future, Alavi Hospitals remains dedicated to expanding its services, advancing medical technologies and strengthening its commitment to delivering exceptional healthcare for every patient who walks through our doors.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutConclusion;