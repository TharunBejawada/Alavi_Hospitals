"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarDays, FaPhone } from "react-icons/fa6";

const CallToAction = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#FAFAFA] px-4 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#5B328C] rounded-[24px] lg:rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row items-center p-8 lg:p-14"
        >
          
          {/* LEFT SIDE: Logo */}
          <div className="w-full md:w-[45%] flex justify-center md:justify-end md:pr-10 lg:pr-16 border-b border-white md:border-b-0 md:border-r pb-8 md:pb-0 mb-8 md:mb-0">
            <div className="relative w-[220px] h-[100px] lg:w-[280px] lg:h-[124px]">
              {/* Replace '/alavi-logo-white.png' with your actual white logo path */}
              <Image 
                src="/alavi-logo-white.png" 
                alt="Alavi Hospitals Logo" 
                fill 
                className="object-contain"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Text & Buttons */}
          <div className="w-full md:w-[55%] flex flex-col items-center md:items-start text-center md:text-left md:pl-10 lg:pl-16">
            
            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold text-white mb-3 leading-tight">
              Your Journey to <br className="hidden md:block" />
              Better Health Begins Here
            </h2>
            
            <p className="text-white/90 text-sm lg:text-base font-medium leading-relaxed max-w-md mb-8">
              Experience advanced medical care with trusted specialists dedicated to your complete wellbeing.
            </p>

            {/* Buttons Group */}
            <div className="flex flex-col sm:flex-col gap-4 w-full sm:w-auto">
              {/* Primary Button (Solid White) */}
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="cursor-pointer w-full bg-white text-[#5B328C] hover:bg-gray-100 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg font-bold text-[15px] transition-colors shadow-sm">
                  <FaCalendarDays className="text-lg" />
                  Book an Appointment
                </button>
              </Link>
              
              {/* Secondary Button (Outlined) */}
              <a href="tel:+919160606108" className="w-full sm:w-auto">
                <button className="cursor-pointer w-full bg-transparent border-2 border-white text-white hover:bg-white/10 flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg font-bold text-[15px] transition-colors">
                  <FaPhone className="text-lg" />
                  Call Now
                </button>
              </a>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;