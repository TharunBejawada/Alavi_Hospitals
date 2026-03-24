"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// These specific Tabler icons closely match the thin-line style in your image
import { TbCalendarTime, TbClipboardHeart, TbUsersGroup } from "react-icons/tb";
import { FaUserMd } from "react-icons/fa";

const actions = [
  {
    // Using \n forces the exact line breaks shown in your design
    title: "Book an\nAppointment",
    href: "/book-appointment",
    icon: <TbCalendarTime size={46} strokeWidth={1.5} />,
  },
  {
    title: "Second\nOpinion",
    href: "/second-opinion",
    icon: <TbUsersGroup size={46} strokeWidth={1.5} />,
  },
  {
    title: "Book health\nCheck Up",
    href: "/health-packages",
    icon: <TbClipboardHeart size={46} strokeWidth={1.5} />,
  },
  {
    title: "Know Our\nDoctors",
    href: "/doctors",
    icon: <FaUserMd size={42} />, // Solid icon matching the 4th block in your image
  },
];

const ActionGrid = () => {
  return (
    <section className="bg-white relative w-full z-30 p-4 lg:p-12">
      <div className="container mx-auto max-w-7xl">
        
        {/* The Grid: Ensures equal gaps and distinct individual blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {actions.map((item, index) => (
            <Link key={index} href={item.href} className="block w-full h-full outline-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                // Strict Alavi Purple, large rounded corners, and exact aspect ratio styling
                className="bg-[#5B328C] rounded-[24px] flex flex-col items-center justify-center p-8 lg:py-10 shadow-lg hover:shadow-2xl hover:bg-[#4a2873] hover:-translate-y-1 transition-all duration-300 group"
              >
                
                {/* Icon Container */}
                <div className="text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                {/* Text Container: whitespace-pre-line respects the \n for perfect two-line text */}
                <h3 className="text-white text-[16px] lg:text-[17px] font-medium leading-[1.3] text-center whitespace-pre-line tracking-wide">
                  {item.title}
                </h3>
                
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ActionGrid;