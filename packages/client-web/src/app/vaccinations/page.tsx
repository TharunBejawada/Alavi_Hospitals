"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Baby,
  User,
  UserRound,
  HeartHandshake,
  Plane,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { API_URL } from "../../config";
import type { VaccineInfo } from "../../../../core/src/types";
import AppointmentPopup from "../../components/AppointmentPopup";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const VACCINES_AVAILABLE_FOR = [
  { icon: Baby, title: "Children", subtitle: "(0–18 years)" },
  { icon: User, title: "Adults", subtitle: "" },
  { icon: UserRound, title: "Senior Citizens", subtitle: "" },
  { icon: HeartHandshake, title: "Pregnant Women", subtitle: "" },
  { icon: Plane, title: "Travellers", subtitle: "" },
  { icon: ShieldAlert, title: "Special Risk Groups", subtitle: "" },
];

const VACCINATION_SERVICES = [
  { title: "Child Immunisation", description: "Age-appropriate vaccinations for children as per recommended immunisation schedules." },
  { title: "Adult Immunisation", description: "Recommended vaccinations for adults based on age, health profile, and individual risk factors." },
  { title: "Travel Vaccination", description: "Vaccination guidance based on your destination, itinerary, and travel requirements." },
  { title: "Flu & seasonal vaccines", description: "Protection against influenza and other vaccine-preventable seasonal infections." },
  { title: "Pre-exposure & post-exposure vaccination", description: "Vaccination support following specific exposures or for individuals at increased risk." },
  { title: "Vaccination certificates", description: "Vaccination documentation and certificates provided as applicable." },
];

export default function VaccinationsPage() {
  const [vaccines, setVaccines] = useState<VaccineInfo[]>([]);
  const [loadingVaccines, setLoadingVaccines] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function fetchVaccines() {
      try {
        const res = await axios.get(`${API_URL}/api/vaccines/getAllEnabled`);
        setVaccines(res.data.Items || []);
      } catch (error) {
        console.error("Failed to fetch vaccines:", error);
      } finally {
        setLoadingVaccines(false);
      }
    }
    fetchVaccines();
  }, []);

  const selectedVaccine = vaccines[selectedIdx];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[560px] flex items-center overflow-hidden bg-[#663399] font-['Inter']">
        <div className="max-w-[1453px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch relative z-10">

          {/* Left Image */}
          <div className="relative w-full h-[280px] lg:h-auto lg:min-h-[560px] order-2 lg:order-1">
            <img src="/assets/vaccination-hero.jpg" alt="Child receiving a vaccination" className="w-full h-full object-cover" />
          </div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="px-6 lg:px-16 py-14 lg:py-0 order-1 lg:order-2"
          >
            <h1 className="text-[34px] font-bold text-white leading-[138%] mb-3">Vaccination</h1>
            <h2 className="text-[24px] font-semibold text-white leading-[149%] mb-4 max-w-[341px]">
              Protect yourself. Protect your loved ones.
            </h2>
            <p className="text-[16px] font-semibold text-white leading-[149%] mb-8 max-w-[434px]">
              Vaccination is one of the most effective ways to protect against serious and preventable diseases.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+919603911911">
                <button className="w-[153px] h-[39px] border-2 border-white text-white font-semibold rounded-[3px] hover:bg-white/10 transition-colors">
                  Call Now
                </button>
              </a>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-[271px] h-[41px] bg-white text-[#663399] font-semibold rounded-[3px] hover:opacity-90 transition-opacity"
              >
                Book an Appointment
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. VACCINES AVAILABLE FOR --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="py-16 max-w-[1453px] w-full mx-auto px-6 lg:px-12"
      >
        <h2 className="text-2xl md:text-[26px] font-semibold text-[#663399] text-center mb-10">Vaccines available for</h2>
        <div className="bg-[rgba(245,235,255,0.28)] rounded-2xl py-10 px-6">
          <div className="flex flex-wrap justify-center divide-x divide-[#663399]/[0.38]">
            {VACCINES_AVAILABLE_FOR.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-3 px-6 md:px-8 w-1/2 sm:w-1/3 lg:w-auto mb-8 lg:mb-0">
                  <Icon className="w-10 h-10 text-[#663399]" strokeWidth={1.5} />
                  <p className="text-[16px] font-medium text-[#663399] text-center leading-[149%]">
                    {item.title}{item.subtitle && <><br />{item.subtitle}</>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* --- 3. OUR VACCINATION SERVICES --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="py-16 bg-[#F5FBFF]"
      >
        <div className="max-w-[1131px] w-full mx-auto px-6 lg:px-0">
          <h2 className="text-2xl md:text-[26px] font-semibold text-[#663399] text-center mb-10">Our vaccination services</h2>
          <div className="bg-white rounded-[36px] grid grid-cols-1 md:grid-cols-3 shadow-sm overflow-hidden">
            {VACCINATION_SERVICES.map((service, idx) => (
              <div
                key={idx}
                className={`p-8 lg:p-10 ${idx % 3 !== 2 ? "md:border-r" : ""} ${idx < 3 ? "border-b" : ""} border-[rgba(126,87,168,0.91)]/40`}
              >
                <h3 className="text-lg font-semibold text-[#663399] mb-3">{service.title}</h3>
                <p className="text-sm font-medium text-[#0A0013] leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* --- 4. TYPES OF VACCINES (dynamic) --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="py-20 max-w-[1453px] w-full mx-auto px-6 lg:px-12"
      >
        <h2 className="text-2xl md:text-[26px] font-semibold text-[#663399] text-center mb-4">Types of vaccines</h2>
        <p className="text-center text-black text-[18px] font-medium max-w-[856px] mx-auto mb-14">
          Explore commonly recommended vaccines and learn who may need them and when they are generally advised.
        </p>

        {loadingVaccines ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
          </div>
        ) : vaccines.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Vaccine information will be available here soon.</div>
        ) : (
          <div className="flex flex-col lg:flex-row bg-[rgba(231,216,245,0.21)] rounded-2xl overflow-hidden max-w-[1140px] mx-auto">
            <div className="lg:w-[300px] shrink-0 flex flex-col">
              {vaccines.map((v, idx) => (
                <button
                  key={v.vaccineId}
                  onClick={() => setSelectedIdx(idx)}
                  className={`text-left px-6 py-4 font-semibold text-[18px] leading-[149%] transition-colors border-b border-white/40 last:border-b-0 ${
                    idx === selectedIdx ? "bg-[#663399] text-white" : "text-[#663399] hover:bg-[#663399]/10"
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
            <div className="flex-1 p-8 lg:p-10">
              {selectedVaccine && (
                <div
                  className="prose max-w-none text-[#0A0013] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: (selectedVaccine.description || "").replace(/&nbsp;/g, " ") }}
                />
              )}
            </div>
          </div>
        )}
      </motion.section>

      {/* --- 5. BOTTOM CTA --- */}
      <section className="relative w-full h-[400px] md:h-[318px] bg-[#663399] overflow-hidden font-['Inter']">
        <div className="absolute right-0 top-0 h-full w-full md:w-[55%]">
          <img src="/assets/vaccination-cta.jpg" alt="Vaccination vial" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, #663399 0%, rgba(102, 51, 153, 0) 55%)' }}
          />
        </div>

        <div className="relative z-10 max-w-[1453px] w-full h-full mx-auto flex flex-col justify-center px-6 lg:px-16 py-10 md:py-0">
          <div className="max-w-[553px]">
            <h2 className="text-[26px] font-bold text-white leading-[149%] mb-3">Walk in or pre-book your vaccination</h2>
            <p className="text-[21px] font-medium text-white leading-[149%] mb-5">Planning a vaccination for yourself or your family?</p>
            <p className="text-[16px] md:text-[18px] font-medium text-white leading-[149%] mb-8 max-w-[500px]">
              Walk in for available vaccination services or pre-book your appointment for a convenient experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:+919603911911">
                <button className="w-[153px] h-[39px] border-2 border-white text-white font-semibold rounded-[3px] hover:bg-white/10 transition-colors">
                  Call Now
                </button>
              </a>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-[271px] h-[41px] bg-white text-[#663399] font-semibold rounded-[3px] hover:opacity-90 transition-opacity"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      <AppointmentPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
