"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config"; // Adjust path if your config is located elsewhere

interface AppointmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSpeciality?: string;
  defaultDoctor?: string;
}

export default function AppointmentPopup({ isOpen, onClose, defaultSpeciality = "", defaultDoctor = "" }: AppointmentPopupProps) {
  const router = useRouter();
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  // Form States for Validation
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [speciality, setSpeciality] = useState(defaultSpeciality);
  const [date, setDate] = useState("");
  const [agreement, setAgreement] = useState(false);

  // Calculate if the form is valid based on mandatory fields
  const isFormValid = name.trim() !== "" && mobile.trim() !== "" && speciality !== "" && date !== "" && agreement === true;

  // Get today's date in YYYY-MM-DD format to disable past dates
  const today = new Date().toISOString().split("T")[0];

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Optional: Reset form states when opened if you want a clean slate each time
      // setName(""); setMobile(""); setDate(""); setAgreement(false); setSpeciality(defaultSpeciality);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, defaultSpeciality]);

  // Dynamically fetch specialities and doctors
  useEffect(() => {
    if (isOpen) {
      axios.get(`${API_URL}/api/specialities/getAllEnabledSpecialities`)
        .then(res => setSpecialities(res.data.Items || []))
        .catch(err => console.error("Failed to load specialities:", err));

      axios.get(`${API_URL}/api/doctors/getAllEnabledDoctors`)
        .then(res => setDoctors(res.data.Items || []))
        .catch(err => console.error("Failed to load doctors:", err));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>

          {/* Popup Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            // Mandatory styling applied: 824px max-width, 23px border-radius, #FFFFFF bg
            className="relative w-full max-w-[824px] bg-[#FFFFFF] rounded-[23px] p-6 lg:p-8 shadow-2xl h-[80vh] flex flex-col font-['Poppins'] overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Texts */}
            <div className="text-center shrink-0 mb-4 flex flex-col items-center">
              <h2 className="font-semibold text-[21px] leading-[156%] text-[#663399] mb-2">
                Book an Appointment
              </h2>
              <p className="font-normal text-[16px] leading-[24px] text-[#000000] max-w-[702px] w-full">
                Schedule Your Consultation at Alavi Hospitals. Fill in your details below and our team will get in touch with you to confirm your appointment.
              </p>
            </div>

            {/* Form - Flex spread to fit exact container space automatically */}
            <form onSubmit={(e) => { e.preventDefault(); // Build the query string with the captured form data
    const query = new URLSearchParams({
      name: name,
      mobile: mobile,
      department: speciality,
      date: date
    }).toString();

    // Redirect to the new page with the data
    router.push(`/thank-you?${query}`);
    
    // Close the popup modal
    onClose();
  }}
            className="max-w-[712px] w-full mx-auto flex flex-col flex-1 justify-between min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-2">
              
              {/* Row 1: Name */}
              <div>
                <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Your Name:</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Full Name"
                  className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000] placeholder:text-[#807090]" 
                />
              </div>

              {/* Row 2: Mobile & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Mobile Number:</label>
                  <input 
                    type="tel" 
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your contact number"
                    className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000] placeholder:text-[#807090]" 
                  />
                </div>
                <div>
                  <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Email Address:</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email address (optional)"
                    className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000] placeholder:text-[#807090]" 
                  />
                </div>
              </div>

              {/* Row 3: Department & Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Department / Specialty*:</label>
                  <select 
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000]"
                  >
                    <option value="" disabled>Select Specialty</option>
                    {specialities.map((spec) => (
                      <option key={spec.specialityId} value={spec.specialityName}>{spec.specialityName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Choose Doctor:</label>
                  <select 
                    defaultValue={defaultDoctor}
                    className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000]"
                  >
                    <option value="" disabled>Any Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.doctorId} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Appointment Date */}
              <div>
                <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Preferred Appointment Date*:</label>
                <input 
                  type="date" 
                  min={today} // Prevents selection of past dates
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-[52px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000]" 
                />
              </div>

              {/* Row 5: Reason for Visit */}
              <div>
                <label className="block font-medium text-[16px] leading-[24px] text-[#000000] mb-1">Reason for Visit:</label>
                <textarea 
                  placeholder="Briefly describe your health concern (optional)"
                  className="w-full h-[128px] bg-[rgba(217,217,217,0.33)] rounded-[14px] p-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-[#000000] placeholder:text-[#807090] resize-none" 
                ></textarea>
              </div>

              {/* Row 6: Agreement Checkbox */}
              <div className="flex items-start gap-3 mt-2">
                <input 
                  type="checkbox" 
                  id="agreement" 
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  className="mt-1 w-[17px] h-[17px] border border-[#000000] rounded-sm accent-[#663399] cursor-pointer shrink-0" 
                />
                <label htmlFor="agreement" className="font-normal text-[16px] leading-[24px] text-[#000000] cursor-pointer select-none">
                  I agree to receive appointment updates and healthcare information from Alavi Hospitals.
                </label>
              </div>

              {/* Row 7: Submit Button */}
              <button 
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-[64px] bg-[linear-gradient(90deg,#0066A9_0%,#663399_100%)] rounded-[14px] text-[#FFFFFF] font-semibold text-[21px] flex items-center justify-center transition-all shadow-md mt-2 shrink-0 ${
                  isFormValid ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
                }`}
              >
                Book Appointment
              </button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}