"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, ShieldCheck, ClipboardList, Search, UserCheck } from "lucide-react";
import { API_URL } from "../../config";
import type { HealthPackage } from "../../../../core/src/types";
import AppointmentPopup from "../../components/AppointmentPopup";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const WHY_CHOOSE_ITEMS = [
  { icon: ShieldCheck, title: "Accurate & Reliable", description: "Get your health parameters assessed through reliable laboratory testing." },
  { icon: ClipboardList, title: "Comprehensive Screening", description: "Our packages bring together important health tests in one convenient checkup." },
  { icon: Search, title: "Early Detection", description: "Regular health screening can help identify potential health concerns at an early stage." },
  { icon: UserCheck, title: "Expert Guidance", description: "Get professional guidance to understand your health results and take the right next steps." },
];

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function PackageCard({ pkg }: { pkg: HealthPackage }) {
  const savedAmount = Math.max(0, (pkg.originalPrice || 0) - (pkg.discountedPrice || 0));
  const savedPercent = pkg.originalPrice ? Math.round((savedAmount / pkg.originalPrice) * 100) : 0;

  return (
    <motion.div variants={fadeUp} className="bg-[#F6FBFF] rounded-3xl shadow-[0px_1px_6.8px_-3px_rgba(0,0,0,0.43)] overflow-hidden flex flex-col">
      <div className="relative h-[190px] bg-gradient-to-r from-[#663399] to-[#9062bf] p-5 flex flex-col justify-between text-white overflow-hidden">
        {pkg.cardImage && (
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-80">
            <Image src={pkg.cardImage} alt={pkg.cardTitle} fill className="object-cover" />
          </div>
        )}
        <div className="relative z-10">
          <p className="font-bold text-sm uppercase tracking-wide max-w-[65%]">{pkg.cardTitle}</p>
          <p className="text-xs font-medium mt-1">Screens {pkg.diseasesScreened}</p>
        </div>
        <div className="relative z-10">
          <div className="flex items-baseline gap-2">
            <span className="text-xs line-through opacity-80">{formatCurrency(pkg.originalPrice)}</span>
            <span className="text-2xl font-bold">{formatCurrency(pkg.discountedPrice)}</span>
          </div>
          {savedAmount > 0 && (
            <span className="inline-block mt-1 bg-[#7e57a8] text-[10px] font-semibold px-2 py-1 rounded">
              SAVE {formatCurrency(savedAmount)} ({savedPercent}%)
            </span>
          )}
          <p className="text-xs font-extrabold mt-2">{pkg.testsCountLabel}</p>
          {pkg.recommendedFor && <p className="text-[11px] mt-1">Recommended for: {pkg.recommendedFor}</p>}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-[#000407] leading-relaxed mb-4">{pkg.cardDescription}</p>

        <div className="space-y-3 mb-6 flex-1">
          {(pkg.testGroups || []).map((group, idx) => (
            <div key={group.id ?? idx}>
              <p className="text-[10px] font-bold text-[#663399] mb-1">{group.title}</p>
              <ul className="text-[9px] text-[#000407] space-y-0.5">
                {group.tests.map((test, tIdx) => (
                  <li key={tIdx}>• {test}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <a href="tel:+919603911911" className="flex-1">
            <button className="w-full bg-[#663399] text-white text-xs font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity">
              Book Now
            </button>
          </a>
          <Link href={`/health-packages/${pkg.seoConfig?.url}`} className="flex-1">
            <button className="w-full border border-[#663399] text-[#663399] text-xs font-semibold py-2.5 rounded-md hover:bg-[#F3E8FF] transition-colors">
              Know More
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function HealthPackagesPage() {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await axios.get(`${API_URL}/api/health-packages/getAllEnabled`);
        setPackages(res.data.Items || []);
      } catch (error) {
        console.error("Failed to fetch health packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[420px] flex items-center overflow-hidden bg-[#663399] font-['Inter']">
        <div className="max-w-[1453px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-6 lg:px-16 py-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-[30px] md:text-[40px] font-bold text-white leading-tight mb-4 max-w-[440px] uppercase">
              Preventive Health Checkups
            </h1>
            <p className="text-[16px] md:text-[18px] font-medium text-white/90 max-w-[500px] leading-relaxed mb-8">
              Choose from our range of carefully designed health packages for routine health monitoring, early detection and better preventive care.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-[#7e57a8] text-white font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Book your Test
              </button>
              <a href="tel:+919603911911">
                <button className="bg-[#7e57a8] text-white font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                  Call Now
                </button>
              </a>
            </div>
          </motion.div>
          <div className="relative w-full h-[220px] md:h-[280px]">
            <img src="/assets/health-packages-hero.png" alt="Family choosing preventive health checkups" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* --- 2. OUR HEALTH PACKAGES --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={fadeUp}
        className="py-16 max-w-[1300px] w-full mx-auto px-6 lg:px-12"
      >
        <h2 className="text-2xl md:text-[32px] font-bold text-[#663399] text-center mb-12">Our Health Packages</h2>

        {loadingPackages ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16 text-gray-500">Health packages will be available here soon.</div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg.healthPackageId} pkg={pkg} />
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* --- 3. WHY CHOOSE ALAVI HEALTH PACKAGES --- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
        className="py-16 bg-[#F5FBFF]"
      >
        <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-[26px] font-bold text-[#663399] text-center mb-12">Why Choose Alavi Health Packages?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#E9F3FF] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#663399]" />
                  </div>
                  <p className="text-[#663399] font-semibold text-lg">{item.title}</p>
                  <p className="text-sm text-black/80 max-w-[220px]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* --- 4. BOTTOM CTA --- */}
      <section className="py-16 bg-[#663399]">
        <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3 max-w-[560px]">
              Your health is your greatest wealth. Don&rsquo;t wait for symptoms to take action.
            </h2>
            <p className="text-white/90 text-lg max-w-[560px]">
              Book your health checkup at <span className="font-bold">Alavi Hospitals</span> and make preventive healthcare a part of your routine.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a href="tel:+919603911911">
              <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                Call Now
              </button>
            </a>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="border-2 border-white bg-[#663399] text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Book your Test Now
            </button>
          </div>
        </div>
      </section>

      <AppointmentPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
