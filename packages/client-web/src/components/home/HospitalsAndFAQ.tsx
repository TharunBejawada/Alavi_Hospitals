"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

// --- Data Configuration ---
const hospitals = [
  {
    name: "IDPL",
    image: "/hospital-idpl.jpg", 
    showLabel: true,
  },
  {
    name: "Chintal",
    image: "/hospital-chintal.jpg", 
    showLabel: true, 
  },
];

const faqs = [
  {
    question: "Where is Alavi Multi Speciality Hospital located?",
    answer: "Alavi Multi Speciality Hospital is located in Balanagar, Secunderabad (Opp. IDPL Colony) and Jeedimetla Main Road, Chinthal, Hyderabad. We are easily accessible from surrounding areas in Hyderabad and Secunderabad.",
  },
  {
    question: "What specialties are available at Alavi Multi Speciality Hospital?",
    answer: "We offer a comprehensive range of specialties including Gynecology, Pediatrics, Cardiology, Neurology, Orthopedics, General Surgery, and more, all supported by advanced technology.",
  },
  {
    question: "Is Alavi Hospital a good hospital for women's health in Hyderabad?",
    answer: "Yes, we have a highly specialized department for Obstetrics, Gynecology & Fertility, offering expert care from routine checkups to advanced maternal and reproductive health solutions.",
  },
  {
    question: "Do you provide pediatric and newborn care services?",
    answer: "Absolutely. Our Pediatrics and Neonatology department is equipped with advanced neonatal support to provide expert care for infants, newborns, and children.",
  },
  {
    question: "Does Alavi Hospital provide surgical services?",
    answer: "Yes, we specialize in both general and minimally invasive laparoscopic surgeries, ensuring faster recovery times and better patient outcomes.",
  },
];

const HospitalsAndFAQ = () => {
  // Set the first FAQ as open by default to match the design
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-white px-4 lg:px-12 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Our Hospitals */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
              Our Hospitals
            </h2>
            
            <div className="grid grid-cols-2 gap-4 h-[350px] lg:h-[450px]">
              {hospitals.map((hospital, index) => (
                <div key={index} className="relative w-full h-full flex flex-col shadow-md rounded-sm overflow-hidden group">
                  <div className="relative w-full h-full flex-grow">
                    <Image
                      src={hospital.image}
                      alt={`${hospital.name} Branch`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Purple Banner (Rendered only if showLabel is true) */}
                  {hospital.showLabel && (
                    <div className="absolute bottom-0 w-full bg-[#5B328C] py-4 text-center z-10">
                      <h3 className="text-white text-xl font-bold tracking-wider">
                        {hospital.name}
                      </h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: FAQ's */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
              FAQ's
            </h2>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={index} className="flex flex-col">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleFaq(index)}
                      className={`flex items-center gap-4 w-full text-left p-4 lg:px-6 transition-colors duration-300 ${
                        isOpen 
                          ? "bg-[#5B328C] text-white" 
                          : "bg-white text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex-shrink-0 text-xl font-bold">
                        {isOpen ? <FiMinus /> : <FiPlus className="text-[#5B328C]" />}
                      </span>
                      <span className="font-bold text-[15px] lg:text-[16px] leading-tight">
                        {faq.question}
                      </span>
                    </button>

                    {/* Accordion Content (Animated) */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden bg-[#F4F7FA]"
                        >
                          <div className="p-5 lg:px-8 lg:py-6 text-gray-800 text-[14px] leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HospitalsAndFAQ;