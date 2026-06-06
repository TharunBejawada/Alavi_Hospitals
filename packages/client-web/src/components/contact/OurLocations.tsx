"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaLocationDot, 
  FaQuoteLeft, 
  FaChevronLeft, 
  FaChevronRight, 
  FaUser, 
  FaStar 
} from "react-icons/fa6";

// --- STATIC DATA WITH EMBEDDED TESTIMONIALS ---
const locations = [
  {
    id: 1,
    name: "IDPL Branch",
    address: "12-234, Adarsh Nagar Main Road Adarsh Nagar, Opp. IDPL Colony Balanagar, Secunderabad Hyderabad, Telangana 500037",
    image: "/contact-location-idpl.png", // Replace with your actual path
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.321!2d78.435!3d17.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sin!4v1", // Replace with actual embed URL
    testimonials: [
      {
        id: 101,
        patient: "Jonnala Jyothi",
        text: "My new born baby was joined alavi hospital admitted in NICU due to prematured delivery. In NICU Dr.Pradeep sir and team was very excellent caring and Day by Day interaction,clear all the problems and supporting to parents. (Highly recommended Dr. Pradeep Reddy sir). Once again thanks to Dr.Pradeep Reddy sir. Children's best Doctor",
        rating: 5,
        isPurple: true, // Matches the design's left card
      },
      {
        id: 102,
        patient: "Vinod Kumar Artham",
        text: "Chandra shekar sir is one of the best doctors in Our premises. He quickly understands the patients issues. He is like our family doctor and our go to doctor for any medical related things. We know sir from 2013 and he is the best in treating diabetic patients and also in general medicine",
        rating: 5,
        isPurple: false, // Matches the design's right card
      }
    ]
  },
  {
    id: 2,
    name: "Chintal Branch",
    address: "5-120/2, Jeedimetla Main Road Opposite Asian Sha Theater Shiva Nagar, Chintal Hyderabad, Telangana 500054",
    image: "/contact-location-chintal.png", // Replace with your actual path
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.321!2d78.435!3d17.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sin!4v2", // Replace with actual embed URL
    testimonials: [
      {
        id: 201,
        patient: "Ummerumaan Syed",
        text: "My mother recently got admitted in Alavi hospital under Dr Chandra Sekhar sir with gas problem. Her symptoms got recovered in 24 hrs. We are thankful to Dr Chandra Sekhar for treating my mother with care and empathy.",
        rating: 5,
        isPurple: true,
      },
      {
        id: 202,
        patient: "Ram Charan",
        text: "I had an excellent experience at alavi Hospital , (chintal).Hospital was clean and we'll equipped.Doctors were knowledgeable and took time to explain everything clearly. We have visited numbers of Hospitals to cure diabetes and get solved by Dr. Chandra shekar garu Thank you sir! I highly recommend alavi hospital for quality health care services.",
        rating: 5,
        isPurple: false,
      }
    ]
  },
];

export default function OurLocations() {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const toggleMap = (id: number) => {
    setActiveLocation((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-[#FAFAFA] overflow-hidden min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-4 lg:px-8 xl:px-12 space-y-16">
        
        {locations.map((loc) => {
          const isMapOpen = activeLocation === loc.id;

          return (
            <div key={loc.id} className="flex flex-col gap-6">
              
              {/* TOP ROW: Location Card (Left) + Testimonials (Right) */}
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                
                {/* LEFT: Location Card */}
                <motion.div layout className="w-full lg:w-1/3 flex flex-col rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-[#5B328C] shrink-0">
                  {/* Building Image */}
                  <div className="relative w-full aspect-[4/3] bg-gray-200">
                    <Image
                      src={loc.image}
                      alt={loc.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Purple Details Box */}
                  <div className="p-6 flex flex-col flex-grow text-white">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <FaLocationDot className="text-[#5B328C] text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1.5">{loc.name}</h3>
                        <p className="text-white/80 text-[13px] leading-relaxed">
                          {loc.address}
                        </p>
                      </div>
                    </div>
                    
                    {/* View Map Button */}
                    <div className="mt-auto flex justify-center">
                      <button 
                        onClick={() => toggleMap(loc.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                          isMapOpen 
                            ? "bg-white text-[#5B328C] border-white shadow-md" 
                            : "bg-transparent text-white border-white/50 hover:bg-white/10"
                        }`}
                      >
                        <FaLocationDot /> {isMapOpen ? "Close Map" : "View on Map"}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT: Testimonials Section */}
                <motion.div layout className="w-full lg:w-2/3 flex flex-col">
                  
                  {/* Testimonials Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#5B328C]">
                      What Our Patient Says About Us
                    </h3>
                    <div className="hidden sm:flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-[#5B328C] text-white flex items-center justify-center hover:bg-[#4a2873] transition-colors shadow-sm">
                        <FaChevronLeft className="text-xs" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-[#5B328C] text-white flex items-center justify-center hover:bg-[#4a2873] transition-colors shadow-sm">
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>

                  {/* Testimonials Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                    {loc.testimonials.map((testi) => (
                      <div 
                        key={testi.id} 
                        className={`p-6 md:p-8 rounded-2xl flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md ${
                          testi.isPurple 
                            ? "bg-[#5B328C] text-white" 
                            : "bg-white text-gray-800 border border-gray-100"
                        }`}
                      >
                        <div>
                          <FaQuoteLeft className={`text-4xl mb-4 ${testi.isPurple ? "text-white/30" : "text-[#5B328C]/30"}`} />
                          <p className={`text-[13px] leading-relaxed line-clamp-6 ${testi.isPurple ? "text-white/90" : "text-gray-600"}`}>
                            {testi.text}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-current border-opacity-10">
                          <FaUser className={`text-4xl ${testi.isPurple ? "text-white/70" : "text-gray-300"}`} />
                          <div className="flex flex-col">
                            <span className="font-bold text-sm mb-1">{testi.patient}</span>
                            <div className="flex text-[#FBBF24] text-xs gap-0.5">
                              {[...Array(testi.rating)].map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              </div>

              {/* BOTTOM ROW: Expandable Map */}
              <AnimatePresence>
                {isMapOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full overflow-hidden"
                  >
                    <div className="w-full h-[350px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-lg border-4 border-white mt-2 relative bg-gray-200">
                      <iframe
                        src={loc.mapUrl}
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </section>
  );
}