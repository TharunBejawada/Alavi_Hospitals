"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutIntro = () => {
  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT SIDE: Circular Image with Geometric Accent */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-[450px] lg:max-w-[550px]"
          >
            {/* The Bold Purple Background Accent Shape */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#5B328C] rounded-bl-[100px] z-0 translate-x-[-10%] translate-y-[10%]" />
            
            {/* Circular Image Container */}
            <div className="relative z-10 aspect-square rounded-full border-[1px] border-white shadow-2xl overflow-hidden bg-gray-100">
              <Image
                src="/doctor-consultation.png" // Replace with your actual path
                alt="Doctor consulting a senior patient"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* RIGHT SIDE: Content Text */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:w-1/2 space-y-6"
          >
            <div className="space-y-4 text-gray-800 text-[15px] lg:text-[16px] leading-relaxed">
              <p>
                <strong>Alavi Hospitals</strong> is a rapidly growing multi-specialty healthcare institution committed to delivering compassionate, ethical and high-quality medical care to the community. Established on March 20, 2024, the hospital was founded with a vision to redefine modern healthcare by integrating advanced medical practices with a patient-centered approach.
              </p>
              
              <p>
                With a capacity of <strong>60 beds</strong> and supported by skilled healthcare professionals, Alavi Hospitals provides advanced medical services designed to meet the diverse healthcare needs of the community. In a short span of time, the hospital has successfully treated over <strong>one lakh patients</strong> and performed <strong>1000+ surgeries</strong> and major procedures, reflecting the growing confidence patients place in our care.
              </p>
              
              <p>
                Equipped with modern medical technology and a team of experienced specialists, Alavi Hospitals ensures that every patient receives accurate diagnosis, effective treatment and compassionate support throughout their healthcare journey.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutIntro;