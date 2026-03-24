"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa6";

const socialLinks = [
  { icon: <FaFacebookF />, href: "https://www.facebook.com/alavihosp?rdid=7zrQqR1vGfCsB0U1&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17VZsRjRx6%2F#" },
  { icon: <FaInstagram />, href: "https://www.instagram.com/alavihospitals_?igsh=OTYxb3llZmZ4OXh5" },
  { icon: <FaXTwitter />, href: "https://x.com/alavihospitals" },
  { icon: <FaYoutube />, href: "https://www.youtube.com/@alavihospitals" },
  { icon: <FaWhatsapp />, href: "https://wa.me/9160606108" },
];

const ContactHero = () => {
  return (
    <section className="relative w-full bg-[#5B328C] pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* Social Icons Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-6 mb-8 text-white text-xl"
          >
            {socialLinks.map((social, index) => (
              <Link 
                key={index} 
                href={social.href}
                target="_blank"
                className="hover:text-purple-300 hover:scale-110 transition-all duration-300"
              >
                {social.icon}
              </Link>
            ))}
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-wide mb-6">
              Get in Touch With Us
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-white/90 text-[16px] lg:text-[18px] font-medium leading-relaxed">
              Reach out to us through the contact form or visit one of our<br className="hidden md:block" /> hospital locations.
            </p>
          </motion.div>

        </div>
      </div>

      {/* One Perfect Mathematical Sine Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0">
        <svg 
          className="relative block w-full h-[60px] md:h-[90px] lg:h-[120px]" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
        >
          {/* M0,192: Starts low on the left.
            Q360,0 720,192: Sweeps smoothly UP to a peak, then DOWN to the center.
            T1440,192: Symmetrically sweeps DOWN to a trough, then UP to the right edge.
          */}
          <path 
            fill="#ffffff" 
            d="M0,192 Q360,0 720,192 T1440,192 L1440,320 L0,320 Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default ContactHero;