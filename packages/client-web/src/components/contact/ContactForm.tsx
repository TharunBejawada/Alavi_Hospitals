"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ContactForm = () => {
  return (
    <section className="py-8 lg:py-16 bg-[#FAFAFA] px-4 lg:px-12 flex justify-center">
      <div className="container mx-auto max-w-7xl">
        
        {/* Main Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-[32px] shadow-[0_10px_40px_rgb(0,0,0,0.06)] p-8 lg:p-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT SIDE: Text and Image */}
            <div className="flex flex-col items-center text-center max-w-md mx-auto lg:mx-0">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#5B328C] mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-500 text-[15px] lg:text-[16px] leading-relaxed mb-10">
                If you have any questions about our services, doctors or appointments, please fill out the form below. Our team will get back to you as soon as possible.
              </p>
              
              {/* Image Container with shadow to match the design */}
              <div className="relative w-full max-w-[320px] aspect-square rounded-[24px] overflow-hidden shadow-2xl">
                <Image
                  src="/contact-reception.png" // Replace with your actual image path
                  alt="Customer Support Representative"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="w-full">
              <form className="flex flex-col gap-4 lg:gap-6" onSubmit={(e) => e.preventDefault()}>
                
                {/* Full Name - Full Width */}
                <div>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                    required
                  />
                </div>

                {/* Email & Phone - Side by Side on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                    required
                  />
                </div>

                {/* Location & Doctor - Side by Side on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {/* Note: Built as text inputs to match visual design perfectly, 
                      but can easily be changed to <select> tags when wiring up backend */}
                  <input 
                    type="text" 
                    placeholder="Preferred Location" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                  />
                  <input 
                    type="text" 
                    placeholder="Select a Doctor" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <textarea 
                    placeholder="Enter Your Message" 
                    rows={5}
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full bg-[#5B328C] text-white font-semibold text-[16px] py-4 rounded-xl shadow-md hover:bg-[#4a2873] hover:shadow-lg active:scale-[0.98] transition-all duration-300 mt-2"
                >
                  Submit
                </button>

              </form>
            </div>

          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default ContactForm;