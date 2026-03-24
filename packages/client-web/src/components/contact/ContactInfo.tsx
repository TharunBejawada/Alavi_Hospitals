"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone } from "react-icons/fa6";

const ContactInfo = () => {
  return (
    <section className="py-12 bg-[#FAFAFA] px-4 lg:px-12 flex justify-center w-full">
      <div className="container mx-auto max-w-7xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Matches the soft, floating card aesthetic of the previous form
          className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 lg:p-12 w-full"
        >
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            {/* LEFT SIDE: Email Section (Takes up about 1/3 width on desktop) */}
            <div className="flex gap-5 lg:w-1/3">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                <FaEnvelope className="text-[#5B328C] text-xl" />
              </div>
              
              {/* Content */}
              <div className="flex flex-col">
                <h3 className="text-[#5B328C] text-xl font-bold mb-2">
                  Email
                </h3>
                <a 
                  href="mailto:info@alavihospitals.com" 
                  className="text-gray-600 font-medium underline decoration-gray-300 underline-offset-4 hover:text-[#5B328C] hover:decoration-[#5B328C] transition-colors duration-300 mb-3"
                >
                  info@alavihospitals.com
                </a>
                <p className="text-gray-500 text-[14px] leading-relaxed pr-4">
                  Need support? Drop us an email anytime and our team will respond shortly.
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: Phone Section (Takes up the remaining 2/3 width) */}
            <div className="flex gap-5 lg:w-2/3">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                <FaPhone className="text-[#5B328C] text-xl" />
              </div>
              
              {/* Content */}
              <div className="flex flex-col w-full">
                <h3 className="text-[#5B328C] text-xl font-bold mb-6">
                  Phone Numbers
                </h3>
                
                {/* Numbers Grid: Stacks on mobile, side-by-side on tablet/desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
                  
                  {/* Number 1 */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[14px] font-medium mb-1.5">
                      General Enquiries
                    </span>
                    <a href="tel:9533121257" className="text-[#5B328C] text-[17px] font-bold hover:opacity-80 transition-opacity">
                      95331 21257
                    </a>
                  </div>

                  {/* Number 2 */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[14px] font-medium mb-1.5">
                      Appointments & Support
                    </span>
                    <a href="tel:9160606108" className="text-[#5B328C] text-[17px] font-bold hover:opacity-80 transition-opacity">
                      9160 606 108
                    </a>
                  </div>

                  {/* Number 3 */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-[14px] font-medium mb-1.5">
                      Hospital Landline
                    </span>
                    <a href="tel:04049994949" className="text-[#5B328C] text-[17px] font-bold hover:opacity-80 transition-opacity">
                      040-49 99 49 49
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default ContactInfo;