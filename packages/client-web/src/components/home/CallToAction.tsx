"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarDays, FaPhone } from "react-icons/fa6";
import AppointmentPopup from "../AppointmentPopup";

const CallToAction = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <section className="py-4 lg:py-8 bg-[#FAFAFA] font-[Poppins]">
      {/* Changed to fluid max-w-[1440px] and matched the new Header/Footer padding */}
      <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 xl:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: 'linear-gradient(90deg, #0066A9 -128.06%, #663399 51.87%)' }}
          className="rounded-[24px] lg:rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch p-8 lg:p-14"
        >
          
          {/* LEFT SIDE: Logo */}
          <div className="w-full md:w-[45%] flex items-center justify-center md:justify-end md:pr-10 lg:pr-16 border-b-[3px] border-white md:border-b-0 md:border-r-[3px] pb-8 md:pb-0 mb-8 md:mb-0 shrink-0">
            {/* Added max-w-full so the logo scales down if needed */}
            <div className="relative w-[300px] h-[100px] lg:w-[410px] lg:h-[148px] max-w-full">
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
          <div className="w-full md:w-[55%] flex flex-col justify-center items-center md:items-start text-center md:text-left md:pl-10 lg:pl-16">
            
            <h2 className="text-3xl lg:text-[36px] font-semibold text-white mb-3 leading-normal">
              Your Journey to <br className="hidden md:block" />
              Better Health Begins Here
            </h2>
            
            <p className="text-white text-lg lg:text-xl font-medium leading-relaxed max-w-xl mb-8">
              Experience advanced medical care with trusted specialists dedicated to your complete wellbeing.
            </p>

            {/* Buttons Group */}
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              
              {/* Primary Button (Solid White) */}
                <button 
                onClick={() => setIsPopupOpen(true)}
                className="cursor-pointer w-full sm:w-[320px] lg:w-[358px] h-[60px] bg-white text-[#5B328C] hover:bg-gray-100 flex items-center justify-center gap-3 rounded-[9px] transition-colors shadow-sm"
              >
                <FaCalendarDays className="text-[20px] lg:text-[24px]" />
                <span className="font-['Poppins'] font-semibold text-[18px] lg:text-[21px] leading-none whitespace-nowrap">
                  Book an Appointment
                </span>
              </button>

              
              {/* Secondary Button (Outlined) */}
              <a href="tel:+919603911911" className="w-full sm:w-auto">
                <button className="cursor-pointer w-full sm:w-[320px] lg:w-[358px] h-[60px] bg-transparent border-2 border-white text-white hover:bg-white/10 flex items-center justify-center gap-3 rounded-[9px] transition-colors">
                  <FaPhone className="text-[20px] lg:text-[24px]" />
                  <span className="font-['Poppins'] font-semibold text-[18px] lg:text-[21px] leading-none whitespace-nowrap">
                    Call Now
                  </span>
                </button>
              </a>
              
            </div>

          </div>

        </motion.div>
      </div>
      <AppointmentPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />
    </section>
  );
};

export default CallToAction;