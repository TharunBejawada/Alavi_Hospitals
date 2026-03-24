"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2D1B3E] text-white pt-16 font-sans">
      <div className="container mx-auto px-4 lg:px-12">
        {/* Adjusted to 3 Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pb-16">
          
          {/* Column 1: Hospital Details (Increased Logo Size) */}
          <div className="space-y-8">
            <div>
              <Image 
                src="/logo-alavi.png" 
                alt="Alavi Hospitals" 
                width={280} // Increased size
                height={90} 
                className="brightness-100 object-contain" 
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2">
                About Alavi Multi Speciality Hospital
              </h3>
              <p className="text-[15px] leading-relaxed text-gray-300 text-justify">
                Established in March 2024, Alavi Multi Speciality Hospital (formerly Kodali Hospital) 
                is committed to delivering expert and compassionate healthcare. We specialize in 
                women's health, pediatrics and a wide range of medical conditions.
              </p>
            </div>
          </div>

          {/* Column 2: Our Services */}
          <div className="lg:pl-10">
            <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2 mb-8">
              Our Services
            </h3>
            <ul className="grid grid-cols-1 gap-4 text-[15px] text-gray-300">
              {[
                "General Medicine", "Gynaecology & Obstetrics", "General & Laparoscopic Surgery",
                "Pediatrics & Neonatology", "Orthopedics", "Cardiology", "Neurology", 
                "Pulmonology", "Physiotherapy"
              ].map((service) => (
                <li key={service} className="hover:text-white transition-colors cursor-pointer flex items-center gap-3">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Address Details */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2 mb-8">
              Contact Us
            </h3>
            
            {/* Phones */}
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-[#5B328C] p-2.5 rounded-full">
                <FaPhoneAlt className="text-white text-xs" />
              </div>
              <div className="text-[15px] space-y-1 font-medium">
                <p>95331 21257 | 9160 606 108</p>
                <p>040-49 99 49 49</p>
              </div>
            </div>

            <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2 mb-8">
              Address
            </h3>

            {/* Address Blocks */}
            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-lg" />
                <p className="text-[14px] text-gray-300 leading-snug">
                  <span className="font-bold text-white block text-base mb-1">IDPL</span>
                  Branch 1: 12, 234, Adarsh Nagar, Adjeetpura Nagar, Opp: IDPL Colony, Balanagar, Secunderabad, Hyderabad, Telangana - 500037
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-lg" />
                <p className="text-[14px] text-gray-300 leading-snug">
                  <span className="font-bold text-white block text-base mb-1">Chinthal</span>
                  Branch 2: 5-120/2, Jeedimetla Main Road, HMT Road, Opp: Asian Sha Theater, Shiva Nagar, Chinthal, Hyderabad, Telangana -500054
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- BOTTOM COPYRIGHT BAR --- */}
      <div className="bg-[#5B328C] py-5 text-center border-t border-white/10">
        <p className="text-[13px] font-bold tracking-[0.1em] uppercase">
          Copyright © {currentYear} . ALAVI HOSPITALS . All Rights Reserved
        </p>
        <a className="text-sm font-medium justify-center hover:text-[#E59A1D] transition-colors flex gap-1.5 mt-3" title="Admin Dashboard Login" href="/admin/login"><svg className="w-4 h-4 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Admin Portal</a>
      </div>
    </footer>
  );
};

export default Footer;