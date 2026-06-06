"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// --- STATIC DATA STRUCTURE (Ready for Dynamic API Replacement later) ---
const specialistsData = [
  {
    id: "dr-m-chandra-sekhar",
    name: "Dr. M. Chandra Sekhar",
    designations: ["Consultant General Physician", "& Diabetologist", "Managing Director"],
    image: "/doctors/chandra-sekhar.png", // Replace with your actual paths
  },
  {
    id: "dr-m-pradeep-reddy",
    name: "Dr. M. Pradeep Reddy",
    designations: ["Consultant Pediatrician"],
    image: "/doctors/pradeep-reddy.png",
  },
  {
    id: "dr-b-kalyani",
    name: "Dr. B. Kalyani",
    designations: ["Consultant Obstetrician,", "Gynaecologist &", "Infertility Specialist"],
    image: "/doctors/kalyani.png",
  },
  {
    id: "dr-srinivasa-rao",
    name: "Dr. Srinivasa Rao Mallampati",
    designations: ["Consultant Rheumatologist"],
    image: "/doctors/srinivasa-rao.png",
  },
];

export default function MeetSpecialists() {
  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-8 lg:py-16 bg-white overflow-hidden">
      <div className="container mx-auto max-w-8xl px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Using a rich blue to match the title in the design */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#005B9F] mb-4">
            Meet Our Specialists
          </h2>
          <p className="text-gray-900 text-base md:text-lg font-medium leading-relaxed">
            Delivering trusted, high-quality care through experienced doctors focused on accurate diagnosis, advanced treatment and patient well-being.
          </p>
        </div>

        {/* Main Blue Container Block */}
        <div className="bg-[#005B9F] rounded-[32px] md:rounded-[40px] p-6 md:p-8 lg:p-10 shadow-xl">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {specialistsData.map((doctor) => (
              <motion.div 
                variants={cardVariants}
                key={doctor.id} 
                // The 'group' class enables the hover state cascade (Card turns blue, buttons turn white)
                className="group bg-white rounded-2xl p-5 flex flex-col border-2 border-transparent hover:bg-[#004A85] hover:border-white transition-all duration-300 shadow-md hover:shadow-2xl"
              >
                
                {/* Image Container with Purple Border */}
                <div className="w-full bg-[#F4F9FF] rounded-[28px] border-[2px] border-[#5B328C] overflow-hidden aspect-square relative mb-5">
                  {doctor.image ? (
                    <Image 
                      src={doctor.image} 
                      alt={doctor.name} 
                      fill 
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      No Image
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1 text-center">
                  <h3 className="text-[17px] font-bold text-[#5B328C] group-hover:text-white transition-colors mb-2 line-clamp-1">
                    {doctor.name}
                  </h3>
                  
                  {/* Designations mapped to handle multiple lines neatly */}
                  <div className="text-[12px] font-medium text-gray-800 group-hover:text-white/90 transition-colors leading-snug mb-6 flex-1">
                    {doctor.designations.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-2 mt-auto">
                    <Link href={`/doctors/${doctor.id}`} className="flex-1">
                      <button className="cursor-pointer w-full bg-[#005B9F] group-hover:bg-white text-white group-hover:text-[#005B9F] font-semibold text-[11px] py-2.5 px-1 rounded transition-colors whitespace-nowrap shadow-sm">
                        Know More
                      </button>
                    </Link>
                    <Link href={`/contact?doctor=${encodeURIComponent(doctor.name)}`} className="flex-1">
                      <button className="cursor-pointer w-full bg-[#005B9F] group-hover:bg-white text-white group-hover:text-[#005B9F] font-semibold text-[11px] py-2.5 px-1 rounded transition-colors whitespace-nowrap shadow-sm">
                        Book Appointment
                      </button>
                    </Link>
                  </div>
                </div>

              </motion.div>
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}