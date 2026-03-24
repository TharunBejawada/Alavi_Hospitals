"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const reasons = [
  {
    title: "Expert Specialists:",
    description: "Experienced doctors delivering precise diagnosis and advanced treatment.",
  },
  {
    title: "Complete Care Under One Roof:",
    description: "Comprehensive multispecialty services for all your healthcare needs.",
  },
  {
    title: "Patient-First Approach:",
    description: "Compassionate, personalized care focused on your comfort and recovery.",
  },
  {
    title: "Modern Technology:",
    description: "Advanced diagnostics and state-of-the-art medical infrastructure.",
  },
  {
    title: "24/7 Emergency Support:",
    description: "Round-the-clock emergency, lab, and pharmacy services you can trust.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#5B328C] px-4 lg:px-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* LEFT COLUMN: Heading & Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col w-full"
          >
            {/* Heading */}
            <h2 className="text-white text-3xl lg:text-4xl leading-tight mb-4">
              <span className="font-semibold block">Why Choose</span>
              <span className="font-bold block mt-1">Alavi Multispecialty Hospitals?</span>
            </h2>

            {/* Faded Divider Line */}
            <div className="w-full h-[1px] bg-white/30 mb-8"></div>

            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] rounded-[24px] overflow-hidden shadow-2xl">
              <Image
                src="/why-choose-us.jpg" // Replace with your actual image path
                alt="Doctor consulting with patient"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Features List */}
          <div className="flex flex-col space-y-8 lg:space-y-10">
            {reasons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                className="flex flex-col"
              >
                <h3 className="text-white text-[18px] lg:text-[20px] font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-white/90 text-[15px] lg:text-[16px] leading-relaxed tracking-wide">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;