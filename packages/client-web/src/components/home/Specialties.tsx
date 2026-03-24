"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const specialties = [
  {
    title: "General Medicine\n& Diabetology",
    description: "Comprehensive care for acute and chronic illnesses with expert diabetes management and preventive health guidance.",
    image: "/gen-med.jpg",
  },
  {
    title: "Obstetrics, Gynecology\n& Fertility",
    description: "Complete women's health care including pregnancy, advanced gynecology treatments and fertility solutions.",
    image: "/obgyn.jpg",
  },
  {
    title: "Pediatrics &\nNeonatology",
    description: "Specialized medical care for infants, newborns and children with advanced neonatal support.",
    image: "/pediatrics.jpg",
  },
  {
    title: "Cardiology",
    description: "Advanced heart care with modern diagnostics, interventional procedures and preventive cardiology.",
    image: "/cardiology.jpg",
  },
  {
    title: "Neurology &\nNeurosurgery",
    description: "Expert care for brain, spine and nervous system disorders with medical and surgical excellence.",
    image: "/neurology.jpg",
  },
  {
    title: "Orthopedics, Joint\nReplacement & Sports\nInjury",
    description: "Comprehensive bone and joint care including joint replacement and sports injury rehabilitation.",
    image: "/orthopedics.jpg",
  },
  {
    title: "General & Laparoscopic\nSurgery",
    description: "Minimally invasive and advanced surgical procedures for faster recovery and better outcomes.",
    image: "/surgery.jpg",
  },
  {
    title: "Physiotherapy &\nRehabilitation",
    description: "Structured rehabilitation programs designed to enhance mobility, strength and quality of life.",
    image: "/physio.jpg",
  },
  {
    title: "Oncology",
    description: "Integrated cancer care with chemotherapy, surgical expertise and individualized treatment planning.",
    image: "/oncology.jpg",
  },
];

const Specialties = () => {
  return (
    // The soft background color matching the design
    <section className="py-20 bg-[#F8FAFC] px-4 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[#5B328C]">
            Specialties
          </h2>
        </motion.div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // Staggered delay so they appear one after another
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link href="/specialties" className="block h-full outline-none">
                <div className="bg-white rounded-2xl p-5 flex items-center gap-5 h-full border-2 border-transparent hover:border-[#5B328C] transition-all duration-300 shadow-sm hover:shadow-lg group">
                  
                  {/* Image Container */}
                  <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-inner">
                    <Image
                      src={item.image}
                      alt={item.title.replace('\n', ' ')}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col justify-center">
                    <h3 className="text-[#5B328C] text-[15px] lg:text-[16px] font-bold leading-snug mb-2 whitespace-pre-line">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-[12px] lg:text-[13px] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/all-specialties">
            <button className="bg-[#5B328C] text-white px-10 py-3 rounded-full text-[16px] font-medium hover:bg-[#4a2873] hover:shadow-lg transition-all duration-300 active:scale-95">
              View More
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Specialties;