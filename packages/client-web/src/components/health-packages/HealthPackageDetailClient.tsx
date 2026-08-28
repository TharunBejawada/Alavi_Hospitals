"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, Phone } from "lucide-react";
import { API_URL } from "../../config";
import type { HealthPackage } from "../../../../core/src/types";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const formatCurrency = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function HealthPackageDetailClient({ healthPackage }: { healthPackage: HealthPackage }) {
  const router = useRouter();
  const pkg = healthPackage;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const savedAmount = Math.max(0, (pkg.originalPrice || 0) - (pkg.discountedPrice || 0));
  const savedPercent = pkg.originalPrice ? Math.round((savedAmount / pkg.originalPrice) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name,
        mobile,
        email,
        speciality: pkg.pageTitle,
        date: preferredDate,
        message: preferredTime ? `Preferred Time: ${preferredTime}` : "",
        page: `Health Package - ${pkg.pageTitle}`
      });

      const query = new URLSearchParams({ name, mobile, department: pkg.pageTitle, date: preferredDate }).toString();
      router.push(`/thank-you?${query}`);
    } catch (error) {
      console.error("Failed to submit appointment request:", error);
      alert("Something went wrong. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-['Poppins'] min-h-screen bg-white pb-20">

      {/* --- 1. HERO --- */}
      <section className="relative w-full bg-[#663399] font-['Inter'] py-10 lg:py-14">
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col lg:flex-row gap-8 items-start">
            {pkg.heroImage && (
              <div className="relative w-full lg:w-[260px] h-[220px] shrink-0 rounded-2xl overflow-hidden">
                <Image src={pkg.heroImage} alt={pkg.pageTitle} fill className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-[26px] md:text-[34px] font-bold text-white leading-tight mb-3 uppercase">{pkg.pageTitle}</h1>
              {pkg.pageSubtitle && <p className="text-white font-semibold text-base mb-3">{pkg.pageSubtitle}</p>}
              {pkg.heroDescription && <p className="text-white/90 text-sm mb-6 max-w-[420px]">{pkg.heroDescription}</p>}

              <div className="flex flex-wrap items-center gap-4 bg-white/10 rounded-xl p-4">
                <div>
                  <p className="text-white/70 text-xs font-semibold">Package Price</p>
                  <p className="text-white text-lg font-bold line-through opacity-70">{formatCurrency(pkg.originalPrice)}</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold">Discounted Price</p>
                  <p className="text-white text-2xl font-extrabold">{formatCurrency(pkg.discountedPrice)}</p>
                </div>
                {savedAmount > 0 && (
                  <div>
                    <p className="text-white/70 text-xs font-semibold">You Save</p>
                    <p className="text-white text-lg font-bold">{savedPercent}% ({formatCurrency(savedAmount)})</p>
                  </div>
                )}
                <a href="tel:+919603911911">
                  <button className="flex items-center gap-2 bg-white text-[#663399] font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                    <Phone className="w-4 h-4" /> Call Now
                  </button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Booking form */}
          <div className="bg-white rounded-2xl p-6 shadow-xl h-fit">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full h-[42px] bg-white border border-[#663399] rounded-md px-3 text-sm text-black outline-none focus:ring-1 focus:ring-[#663399]/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Mobile Number:</label>
                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required
                  className="w-full h-[42px] bg-white border border-[#663399] rounded-md px-3 text-sm text-black outline-none focus:ring-1 focus:ring-[#663399]/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Email Address:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[42px] bg-white border border-[#663399] rounded-md px-3 text-sm text-black outline-none focus:ring-1 focus:ring-[#663399]/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Preferred Date:</label>
                <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full h-[42px] bg-white border border-[#663399] rounded-md px-3 text-sm text-black outline-none focus:ring-1 focus:ring-[#663399]/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black mb-1">Preferred Time:</label>
                <input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full h-[42px] bg-white border border-[#663399] rounded-md px-3 text-sm text-black outline-none focus:ring-1 focus:ring-[#663399]/50" />
              </div>
              <button type="submit" disabled={isSubmitting}
                className="w-full h-[46px] bg-[#663399] text-white font-semibold rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book My Appointment"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- 2. WHAT DOES THIS PACKAGE INCLUDE --- */}
      {(pkg.testGroups?.length || 0) > 0 && (
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} className="py-16 max-w-[1300px] w-full mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-[28px] font-bold text-[#663399] mb-10">What Does This Package Include?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pkg.testGroups.map((group, idx) => (
              <div key={group.id ?? idx} className="relative bg-[#663399] rounded-2xl p-6 min-h-[240px] overflow-hidden">
                {group.image && (
                  <div className="absolute inset-0 opacity-20">
                    <Image src={group.image} alt={group.title} fill className="object-cover" />
                  </div>
                )}
                <div className="relative z-10">
                  <h3 className="text-white font-semibold text-lg mb-4">{group.title}</h3>
                  <ul className="text-white text-sm space-y-2">
                    {group.tests.map((test, tIdx) => (
                      <li key={tIdx}>• {test}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* --- 3. WHO IS THIS PACKAGE FOR --- */}
      {(pkg.whoIsThisFor?.list?.length || 0) > 0 && (
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} className="py-16 bg-[#F5FBFF]">
          <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12">
            <h2 className="text-2xl md:text-[28px] font-bold text-[#663399] mb-6">Who Is This Package For?</h2>
            {pkg.whoIsThisFor.intro && <p className="text-lg font-medium text-black mb-4">{pkg.whoIsThisFor.intro}</p>}
            <ul className="text-black text-lg space-y-3">
              {pkg.whoIsThisFor.list.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </motion.section>
      )}

      {/* --- 4. WHAT DOES IT HELP ASSESS --- */}
      {(pkg.assessmentItems?.length || 0) > 0 && (
        <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={fadeUp} className="py-16 max-w-[1300px] w-full mx-auto px-6 lg:px-12">
          <h2 className="text-2xl md:text-[32px] font-bold text-[#663399] text-center mb-4">What Does It Help Assess?</h2>
          {pkg.detailSummary && (
            <p className="text-center text-black text-lg max-w-[750px] mx-auto mb-12">{pkg.detailSummary}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pkg.assessmentItems.map((item, idx) => (
              <div key={item.id ?? idx} className="bg-[#7e57a8] rounded-2xl p-6 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full bg-white shrink-0 overflow-hidden flex items-center justify-center">
                  {item.icon && <Image src={item.icon} alt={item.title} fill className="object-contain p-2" />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                  <p className="text-white text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* --- 5. BOTTOM CTA --- */}
      <section className="max-w-[1300px] mx-auto px-6 lg:px-12 py-8">
        <div className="bg-[#663399] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Stay Ahead of Your Health</h2>
            <p className="text-white/90">Know your important health parameters. Make preventive screening part of your routine.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a href="tel:+919603911911">
              <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                Call Now
              </button>
            </a>
            <a href="#top">
              <button className="bg-white text-[#663399] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                Book Now
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
