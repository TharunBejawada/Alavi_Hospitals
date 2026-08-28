"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";

interface HealthPackageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageTitle: string;
}

export default function HealthPackageBookingModal({ isOpen, onClose, packageTitle }: HealthPackageBookingModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = name.trim() !== "" && mobile.trim() !== "";

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setMobile("");
    setEmail("");
    setPreferredDate("");
    setPreferredTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name,
        mobile,
        email,
        speciality: packageTitle,
        date: preferredDate,
        message: preferredTime ? `Preferred Time: ${preferredTime}` : "",
        page: `Health Package - ${packageTitle}`
      });

      const query = new URLSearchParams({ name, mobile, department: packageTitle, date: preferredDate }).toString();
      resetForm();
      onClose();
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Something went wrong while booking. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[560px] bg-white rounded-[23px] p-6 lg:p-8 shadow-2xl max-h-[90vh] flex flex-col font-['Poppins'] overflow-hidden"
          >
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-10 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center shrink-0 mb-4 flex flex-col items-center">
              <h2 className="font-semibold text-[21px] leading-[156%] text-[#663399] mb-2">
                Book Your Health Checkup
              </h2>
              <p className="font-normal text-[15px] leading-[24px] text-black w-full">
                Fill in your details below and our team will get in touch to confirm your appointment.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-2"
            >
              <div>
                <label className="block font-medium text-[14px] leading-[24px] text-black mb-1">Health Package:</label>
                <input
                  type="text"
                  value={packageTitle}
                  readOnly
                  className="w-full h-[48px] bg-[#E7DEF0] rounded-[14px] px-5 outline-none text-black cursor-not-allowed"
                />
              </div>

              <div className="mt-4">
                <label className="block font-medium text-[14px] leading-[24px] text-black mb-1">Your Name*:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Your Full Name"
                  required
                  className="w-full h-[48px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-medium text-[14px] leading-[24px] text-black mb-1">Mobile Number*:</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your contact number"
                    required
                    className="w-full h-[48px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[14px] leading-[24px] text-black mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address (optional)"
                    className="w-full h-[48px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-[#807090]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-medium text-[14px] leading-[24px] text-black mb-1">Preferred Date:</label>
                  <input
                    type="date"
                    min={today}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-[48px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[14px] leading-[24px] text-black mb-1">Preferred Time:</label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full h-[48px] bg-[rgba(217,217,217,0.33)] rounded-[14px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full h-[58px] bg-[linear-gradient(90deg,#0066A9_0%,#663399_100%)] rounded-[14px] text-white font-semibold text-[18px] flex items-center justify-center transition-all shadow-md mt-6 shrink-0 ${
                  isFormValid && !isSubmitting ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Book My Appointment"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
