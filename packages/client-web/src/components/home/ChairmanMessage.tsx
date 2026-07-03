"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ChairmanMessage = () => {
  // Framer Motion Variants
  const fadeLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
  };

  return (
    <section className="bg-[#F6FBFF] py-4 lg:py-8 overflow-hidden font-[Poppins]">
      <div className="container mx-auto max-w-8xl px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Text Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeLeft}
            className="lg:col-span-7 flex flex-col"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#5B328C] mb-8">
              Chairman’s Message
            </h2>
            
            <div className="space-y-5 text-[15px] md:text-[16px] text-gray-800 leading-relaxed font-normal">
              <p>
                At <span className="text-[#5B328C] font-bold">Alavi Multispecialty Hospitals</span>, our mission is to provide <span className="text-[#5B328C] font-bold">compassionate, ethical, and high-quality healthcare</span> that truly impacts lives. From the very beginning, our focus has been to build a place where patients feel safe, respected, and confident in every aspect of their care.
              </p>
              
              <p>
                I strongly believe that healthcare is not just about treating illness, it is about understanding the patient as a whole. My philosophy has always been centered on <span className="text-[#5B328C] font-bold">early diagnosis, preventive care, and guiding patients with the right knowledge to make informed health decisions.</span> Every patient deserves time, attention, honesty, and a treatment plan tailored to their individual needs.
              </p>
              
              <p>
                With years of experience in <span className="text-[#5B328C] font-bold">General Medicine</span> and <span className="text-[#5B328C] font-bold">Diabetology</span>, I have witnessed how timely care and continuous monitoring can transform long-term health outcomes. This belief continues to shape the care we deliver at Alavi.
              </p>
              
              <p>
                We will continue to grow with one goal, to serve with integrity and put patients first, always.
              </p>
            </div>

            {/* Signature & Name Block */}
            <div className="mt-8">
              <div className="relative w-72 h-24 mb-4 ml-12">
                <Image 
                  src="/signature.png" 
                  alt="Chairman Signature" 
                  fill 
                  className="object-contain object-left" 
                />
              </div>
              
              <div className="inline-block bg-[#5B328C] text-white px-6 py-2.5 font-bold text-lg shadow-sm">
                Dr. M. Chandra Sekhar
              </div>
              <p className="mt-3 font-semibold text-gray-900 ml-1">
                Chairman & Managing Director
              </p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Image with Custom Frame */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeRight}
            className="lg:col-span-5 flex justify-center lg:justify-end mt-8 lg:mt-0"
          >
            <div className="bg-[#5B328C] p-5 rounded-tl-[80px] rounded-br-[80px] w-full max-w-[420px] shadow-xl">
              
              {/* The Inner Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-tl-[80px] rounded-br-[80px] overflow-hidden bg-gray-200">
                <Image 
                  src="/chairman-photo.png" 
                  alt="Dr. M. Chandra Sekhar" 
                  fill 
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ChairmanMessage;