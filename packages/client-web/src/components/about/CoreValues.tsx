"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaHandHoldingHeart, FaAward, FaScaleBalanced, FaUsers, FaHandshake } from "react-icons/fa6";

const values = [
  {
    title: "Compassion",
    description: "Caring for every patient with empathy, respect and understanding.",
    icon: <FaHandHoldingHeart />,
  },
  {
    title: "Excellence",
    description: "Delivering the highest standards of medical expertise and treatment.",
    icon: <FaAward />,
  },
  {
    title: "Integrity",
    description: "Practicing ethical and transparent healthcare.",
    icon: <FaScaleBalanced />,
  },
  {
    title: "Patient-Centered Care",
    description: "Prioritizing the health, comfort and dignity of every patient.",
    icon: <FaUsers />,
  },
  {
    title: "Community Commitment",
    description: "Promoting healthier communities through outreach programs and preventive care initiatives.",
    icon: <FaHandshake />,
  },
];

const CoreValues = () => {
  return (
    <section className="py-16 bg-[#FAFAFA] px-4 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#5B328C] text-2xl lg:text-3xl font-bold mb-4"
          >
            Our Core Values
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-800 text-[15px] lg:text-[16px]"
          >
            The foundation of Alavi Hospitals is built on values that guide every decision and every patient interaction.
          </motion.p>
        </div>

        {/* Values Flex Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {values.map((val, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // w-full on mobile, roughly 31% on desktop to fit 3 in a row, letting the last 2 center automatically
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-6 rounded-[16px] shadow-sm flex gap-5 border border-purple-50"
            >
              <div className="w-14 h-14 rounded-full bg-[#5B328C] text-white flex items-center justify-center shrink-0 text-2xl shadow-md">
                {val.icon}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[#5B328C] font-bold text-[16px] mb-1.5">{val.title}</h3>
                <p className="text-gray-600 text-[13px] leading-relaxed">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreValues;