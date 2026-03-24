"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";

const locations = [
  {
    id: 1,
    name: "Adarsh Nagar Branch",
    address: "12-234, Adarsh Nagar Main Road Adarsh Nagar, Opp. IDPL Colony Balanagar, Secunderabad Hyderabad, Telangana 500037",
    image: "/contact-location-idpl.png", // Replace with your actual path
    mapUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7610.988309181513!2d78.44868!3d17.483909!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb918a222a42af%3A0xafa78f054b05449b!2sAlavi%20Hospitals%20(Old%20Kodali%20Hospital)%20-%20Best%20Multispecialty%20Hospital%20in%20IDPL!5e0!3m2!1sen!2sin!4v1773231868377!5m2!1sen!2sin",
  },
  {
    id: 2,
    name: "Chintal Branch",
    address: "5-120/2, Jeedimetla Main Road Opposite Asian Sha Theater Shiva Nagar, Chintal Hyderabad, Telangana 500054",
    image: "/contact-location-chintal.png", // Replace with your actual path
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.9379408998548!2d78.44867518474558!3d17.49243047166674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9041c99f0541%3A0x22e515baf263a3f2!2sAlavi%20Hospital!5e0!3m2!1sen!2sin!4v1773231936327!5m2!1sen!2sin",
  },
];

const OurLocations = () => {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const activeMapUrl = locations.find((loc) => loc.id === activeLocation)?.mapUrl;

  const handleCardClick = (id: number) => {
    setActiveLocation((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-[#FAFAFA] px-4 lg:px-8 xl:px-16 overflow-hidden min-h-screen flex flex-col justify-center w-full">
      <div className="container mx-auto max-w-[1400px] w-full">
        
        <motion.div layout className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#5B328C]">
            Our Locations
          </h2>
        </motion.div>

        {/* Dynamic Main Grid */}
        <motion.div 
          layout 
          className={`grid gap-6 lg:gap-8 transition-all duration-500 ease-in-out w-full items-stretch ${
            activeLocation !== null 
              ? "grid-cols-1 lg:grid-cols-12" // Split Layout (Map + Stacked Cards)
              : "grid-cols-1" // Single full-width layout when map is closed
          }`}
        >
          {/* MAP CONTAINER (Left Side) */}
          <AnimatePresence>
            {activeLocation !== null && (
              <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95, position: "absolute" }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7 w-full h-[400px] lg:h-auto rounded-[20px] overflow-hidden shadow-2xl relative z-10 bg-gray-200"
              >
                <iframe
                  src={activeMapUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CARDS CONTAINER */}
          <motion.div 
            layout
            className={`grid w-full gap-6 lg:gap-8 ${
              activeLocation !== null 
                ? "lg:col-span-5 grid-cols-1" // Stacked on the right
                : "grid-cols-1 md:grid-cols-2" // Beautifully span 50/50 across the full screen
            }`}
          >
            {locations.map((loc) => {
              const isActive = activeLocation === loc.id;

              return (
                <motion.div
                  layout
                  key={loc.id}
                  onClick={() => handleCardClick(loc.id)}
                  className={`w-full bg-white rounded-[20px] overflow-hidden cursor-pointer border-2 transition-all duration-300 group flex flex-col ${
                    isActive 
                      ? "border-[#5B328C] shadow-xl z-20 bg-purple-50/30" 
                      : "border-transparent shadow-md hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  {/* Image Section 
                      - Removed fixed heights (h-[...])
                      - Added aspect-[16/10]: Forces the height to scale perfectly with the width.
                  */}
                  <motion.div 
                    layout 
                    className="relative w-full aspect-[4/3] md:aspect-[16/10] shrink-0 bg-gray-100 overflow-hidden transition-all duration-500"
                  >
                    <Image
                      src={loc.image}
                      alt={loc.name}
                      fill
                      // object-cover ensures it fills the width and height entirely without letterboxing
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </motion.div>

                  {/* Content Section */}
                  <motion.div layout className="p-5 lg:p-8 flex gap-4 lg:gap-6 flex-grow border-t border-gray-100">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-[#F3E8FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#5B328C] transition-colors duration-300">
                      <FaLocationDot className="text-[#5B328C] text-lg lg:text-2xl group-hover:text-white transition-colors duration-300" />
                    </div>

                    <div className="flex flex-col justify-center">
                      <h3 className="text-[#5B328C] text-lg lg:text-2xl font-bold mb-2">
                        {loc.name}
                      </h3>
                      <p className="text-gray-600 text-[13px] lg:text-[15px] leading-relaxed line-clamp-3">
                        {loc.address}
                      </p>
                      
                      <span className={`text-[12px] font-bold mt-3 tracking-wide uppercase transition-colors ${isActive ? 'text-[#5B328C]' : 'text-gray-400 group-hover:text-[#5B328C]'}`}>
                        {isActive ? "— Close Map" : "+ View on Map"}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
          
        </motion.div>
      </div>
    </section>
  );
};

export default OurLocations;