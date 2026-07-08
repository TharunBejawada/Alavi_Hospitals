"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { API_URL } from "../../config"; // Adjust the path based on your folder structure

const ContactForm = () => {
  const router = useRouter();
  
  // --- STATE ---
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    doctor: "",
    message: ""
  });

  // --- FETCH DOCTORS ON MOUNT ---
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors/getAllEnabledDoctors`);
        setDoctors(response.data.Items || []);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) return;

    setIsSubmitting(true);

    try {
      // Send data to the same robust form.ts backend
      await axios.post(`${API_URL}/api/forms/submit`, {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        doctor: formData.doctor || "No specific doctor",
        // Bundle location into the message field for the backend to catch
        message: `Location Preference: ${formData.location || "N/A"}\n\nMessage: ${formData.message}`,
        page: "Contact Us Page"
      });

      // Redirect to Thank You page
      const query = new URLSearchParams({
        name: formData.name,
        mobile: formData.mobile,
      }).toString();

      router.push(`/thank-you?${query}`);
      
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-4 lg:py-8 bg-[#FAFAFA] px-4 lg:px-12 flex justify-center font-[Poppins]">
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
              <form className="flex flex-col gap-4 lg:gap-6" onSubmit={handleSubmit}>
                
                {/* Full Name */}
                <div>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name*" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                  />
                  <input 
                    type="tel" 
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Phone Number*" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                  />
                </div>

                {/* Location & Doctor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Preferred Location" 
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300"
                  />
                  
                  {/* Dynamic Doctor Dropdown */}
                  <div className="relative">
                    <select
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className={`w-full bg-[#F8F6FA] px-6 py-4 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300 appearance-none cursor-pointer ${
                        formData.doctor ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      <option value="" disabled>Select a Doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc.doctorId} value={doc.name} className="text-gray-800">
                          {doc.name}
                        </option>
                      ))}
                    </select>
                    {/* Custom Dropdown Arrow to replace the default browser styling */}
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter Your Message*" 
                    rows={5}
                    required
                    className="w-full bg-[#F8F6FA] text-gray-800 placeholder-gray-400 px-6 py-5 rounded-xl outline-none border-2 border-transparent focus:border-[#5B328C]/30 focus:bg-white transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.mobile || !formData.message}
                  className="w-full flex justify-center items-center gap-2 bg-[#5B328C] text-white font-semibold text-[16px] py-4 rounded-xl shadow-md hover:bg-[#4a2873] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
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