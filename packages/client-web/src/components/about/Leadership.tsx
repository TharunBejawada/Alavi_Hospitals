"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

const leaders = [
  {
    name: "Dr. M. Chandra Sekhar",
    role: "Managing Director",
    image: "/dr-chandra-sekhar.jpg",
    alignment: "left",
    content: (
      <>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          <strong className="text-[#5B328C]">Dr. M. Chandra Sekhar</strong>, the Managing Director, is an experienced General Physician and Diabetologist with over 19 years of medical expertise.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          Holding qualifications including MBBS, PGDHSc, PG Diploma in Clinical Endocrinology & Diabetes, and Post Graduation in Diabetology, he has dedicated his career to advancing patient care and managing complex medical conditions.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px]">
          His philosophy, <span className="text-[#5B328C] font-semibold">“Redefining Care, Inspiring Wellness,”</span> reflects his commitment to improving patient outcomes and promoting healthier lifestyles through quality medical care.
        </p>
      </>
    ),
  },
  {
    name: "Dr. B. Kalyani",
    role: "Director",
    image: "/dr-kalyani.jpg",
    alignment: "right",
    content: (
      <>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          <strong className="text-[#5B328C]">Dr. B. Kalyani</strong>, Director at Alavi Hospitals, is a renowned Obstetrician, Gynecologist, and Infertility Specialist with 19 years of experience in women’s healthcare.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          She holds qualifications including MBBS, DGO, DRM (Germany), Fellowship in Reproductive Medicine (IMA), and Fellowship in Laparoscopy. Dr. Kalyani is widely respected for her dedication to maternal health and fertility care.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px]">
          Her motto, <span className="text-[#5B328C] font-semibold">“Compassionate Care for Every Stage of Womanhood,”</span> reflects her commitment to supporting women’s health at every stage of life.
        </p>
      </>
    ),
  },
  {
    name: "Dr. Srinivasa Rao Mallampati",
    role: "Director",
    image: "/dr-srinivasa.jpg",
    alignment: "left",
    content: (
      <>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          <strong className="text-[#5B328C]">Dr. Srinivasa Rao Mallampati</strong>, Director, specializes in Functional Medicine and Rheumatology and brings 18 years of clinical experience to the institution.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          With qualifications including MBBS and PGDHSc, he focuses on improving metabolic health and managing complex chronic conditions.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px]">
          His guiding principle, <span className="text-[#5B328C] font-semibold">“Optimising Metabolism... For Good Health,”</span> reflects his holistic approach to long-term wellness and disease management.
        </p>
      </>
    ),
  },
  {
    name: "Dr. M. Pradeep Reddy",
    role: "Director",
    image: "/dr-pradeep.jpg",
    alignment: "right",
    content: (
      <>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          <strong className="text-[#5B328C]">Dr. M. Pradeep Reddy</strong>, Director, is a specialist in Pediatrics and Neonatology with 16 years of experience in child healthcare.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px] mb-4">
          Holding qualifications of MBBS and MD in Pediatrics, he is dedicated to ensuring the healthy growth and development of infants and children.
        </p>
        <p className="text-gray-800 leading-relaxed text-[14px] lg:text-[15px]">
          His commitment to pediatric care ensures that young patients receive specialized treatment in a safe and supportive environment.
        </p>
      </>
    ),
  },
];

const Leadership = () => {
  return (
    <section className="py-20 bg-white px-4 lg:px-12 overflow-hidden">
      <div className="container mx-auto max-w-[1100px]">
        
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-[#5B328C] text-2xl lg:text-3xl font-bold mb-4">
            Expert Leadership Driving Excellence
          </h2>
          <p className="text-gray-800 leading-relaxed text-[15px] lg:text-[16px]">
            The foundation of Alavi Hospitals is built on the expertise and vision of its Board of Directors, who bring decades of medical experience and leadership to the institution.
          </p>
        </div>

        {/* Leadership Cards */}
        <div className="space-y-10 lg:space-y-12">
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: leader.alignment === "left" ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col ${
                leader.alignment === "right" ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-8 lg:gap-14 bg-[#FCFAFF] p-8 lg:p-10 rounded-[20px] shadow-[0_4px_20px_rgba(91,50,140,0.06)]`}
            >
              
              {/* Image Section */}
              <div className="flex flex-col items-center shrink-0 w-full max-w-[220px]">
                {/* Fixed aspect ratio box perfectly matches the portrait style in the design */}
                <div className="relative w-full aspect-[4/5] rounded-[16px] overflow-hidden border border-[#5B328C] mb-4 bg-white">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="text-[#5B328C] font-bold text-[15px] text-center">{leader.name}</h3>
                <p className="text-gray-600 text-[13px] font-medium text-center">{leader.role}</p>
              </div>

              {/* Text Section */}
              <div className="flex-grow w-full">
                
                {/* Top Quote & Line */}
                <div className="flex items-center gap-4 mb-6">
                  <FaQuoteLeft className="text-[#5B328C] text-2xl lg:text-3xl shrink-0" />
                  <div className="h-[2px] bg-[#5B328C] flex-grow" />
                </div>
                
                {/* Formatted Content */}
                <div className="px-2 lg:px-4">
                  {leader.content}
                </div>

                {/* Bottom Line & Quote */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="h-[2px] bg-[#5B328C] flex-grow" />
                  <FaQuoteRight className="text-[#5B328C] text-2xl lg:text-3xl shrink-0" />
                </div>

              </div>
              
            </motion.div>
          ))}
        </div>

        {/* Closing Vision Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <p className="text-gray-800 font-medium text-[15px] lg:text-[16px] leading-relaxed">
            Together, the leadership team of Alavi Hospitals works with a shared vision to create a healthcare environment where expertise, compassion and innovation come together to deliver the best outcomes for patients.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default Leadership;