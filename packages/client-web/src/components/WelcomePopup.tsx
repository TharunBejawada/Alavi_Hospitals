"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config";

const SESSION_KEY = "welcomePopupShown";
const SHOW_DELAY_MS = 2500;

export default function WelcomePopup() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const [isOpen, setIsOpen] = useState(false);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasScheduled = useRef(false);

  const isFormValid = name.trim() !== "" && mobile.trim() !== "";

  // Show once per browser session, a couple of seconds after the first page loads.
  useEffect(() => {
    if (isAdminRoute || hasScheduled.current) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    hasScheduled.current = true;
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isAdminRoute]);

  // Deliberately doesn't lock body scroll: the page should stay fully
  // scrollable/visible behind the popup. Closing (X, or a click outside the
  // card) is still required before interacting with the page underneath.
  useEffect(() => {
    if (isOpen) {
      axios.get(`${API_URL}/api/specialities/getAllEnabledSpecialities`)
        .then((res) => setSpecialities(res.data.Items || []))
        .catch((err) => console.error("Failed to load specialities:", err));
      axios.get(`${API_URL}/api/doctors/getAllEnabledDoctors`)
        .then((res) => setDoctors(res.data.Items || []))
        .catch((err) => console.error("Failed to load doctors:", err));
    }
  }, [isOpen]);

  const filteredDoctors = speciality
    ? doctors.filter((doc) => doc.department === speciality || doc.speciality === speciality)
    : doctors;

  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name,
        mobile,
        speciality,
        doctor: selectedDoctor,
        page: "Welcome Popup",
      });

      const query = new URLSearchParams({ name, mobile, department: speciality }).toString();
      setIsOpen(false);
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Something went wrong while booking. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdminRoute) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-[Poppins]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitting ? handleClose : undefined}
            className="absolute inset-0 bg-black/10"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-[720px] max-h-[54vh] bg-[#FAFAFA] rounded-[24px] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
          >
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute top-4 right-4 p-2 bg-white hover:bg-gray-100 text-gray-600 rounded-full transition-colors z-20 disabled:opacity-50 shadow-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT: Logo, copy, form */}
            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
              {/* <Image
                src="/welcome-popup-logo.png"
                alt="Alavi Hospitals"
                width={176}
                height={118}
                className="mb-4 h-auto w-[140px] md:w-[160px] object-contain origin-left scale-x-125"
              /> */}

              <h2 className="text-[32px] md:text-[38px] leading-[1.15] font-bold mb-3">
                <span className="text-black">Book Your </span>
                <br />
                <span className="text-[#663399]">Appointment</span>
              </h2>
              <p className="text-[16px] md:text-[18px] font-medium text-black mb-6">
                Get expert care from our specialists.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[8px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-black/40"
                />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Phone Number"
                  required
                  className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[8px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black placeholder:text-black/40"
                />
                <select
                  value={speciality}
                  onChange={(e) => {
                    setSpeciality(e.target.value);
                    setSelectedDoctor("");
                  }}
                  className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[8px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black/40 focus:text-black"
                >
                  <option value="">Department / Specialty</option>
                  {specialities.map((spec) => (
                    <option key={spec.specialityId} value={spec.specialityName} className="text-black">
                      {spec.specialityName}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full h-[52px] bg-white border border-[#663399]/40 rounded-[8px] px-5 outline-none focus:ring-2 focus:ring-[#663399]/50 transition-all text-black/40 focus:text-black"
                >
                  <option value="">Select Doctor</option>
                  {filteredDoctors.map((doc) => (
                    <option key={doc.doctorId} value={doc.name} className="text-black">
                      {doc.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full h-[52px] bg-[#663399] rounded-[8px] text-white font-semibold text-[18px] flex items-center justify-center gap-3 transition-all shadow-md tracking-wide ${
                    isFormValid && !isSubmitting ? "hover:opacity-90" : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      BOOK APPOINTMENT
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-[14px] md:text-[15px] font-medium text-black mt-4">
                Our team will contact you shortly to confirm your appointment.
              </p>
            </div>

            {/* RIGHT: Doctor photo over a soft brand-gradient backdrop */}
            <div className="hidden md:block relative bg-[#FAFAFA] overflow-hidden">
              <div
                className="absolute -right-[350px] top-1/2 -translate-y-1/2 w-[678.12px] h-[778.12px] rounded-full"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, #663399 147.98%)" }}
              />
              <Image
                src="/welcome-popup-doctor.webp"
                alt="Alavi Hospitals specialist"
                fill
                className="object-cover object-top"
                sizes="500px"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
