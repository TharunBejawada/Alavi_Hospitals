"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2, ExternalLink } from "lucide-react";
import { API_URL } from "../../config";
import type { InsurancePartner, InsuranceProcessInfo } from "../../../../core/src/types";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function InsurancePage() {
  const [govtPartners, setGovtPartners] = useState<InsurancePartner[]>([]);
  const [privatePartners, setPrivatePartners] = useState<InsurancePartner[]>([]);
  const [processInfo, setProcessInfo] = useState<InsuranceProcessInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [govtRes, privateRes, processRes] = await Promise.all([
          axios.get(`${API_URL}/api/insurance-partners/getAllEnabled`, { params: { type: "government" } }),
          axios.get(`${API_URL}/api/insurance-partners/getAllEnabled`, { params: { type: "private" } }),
          axios.get(`${API_URL}/api/insurance-process/getAllEnabled`),
        ]);
        setGovtPartners(govtRes.data.Items || []);
        setPrivatePartners(privateRes.data.Items || []);
        setProcessInfo(processRes.data.Items || []);
      } catch (error) {
        console.error("Failed to fetch insurance page data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedTab = processInfo[selectedTabIdx];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section className="relative w-full min-h-[360px] md:h-[440px] flex items-center overflow-hidden font-['Inter'] bg-[#F1E9FA] py-10 md:py-0">

        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0 opacity-40 md:opacity-100">
          <img
            src="/assets/insurance-hero.png"
            alt="Medical insurance for your family"
            className="w-full h-full object-cover md:object-right object-center"
          />
        </div>

        {/* Content Container */}
        <div className="max-w-full w-full mx-auto px-6 sm:px-10 md:px-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[531px] flex flex-col"
          >
            <h1 className="text-2xl sm:text-3xl md:text-[44px] font-bold text-[#663399] leading-tight sm:leading-[138%] mb-3 sm:mb-[16px] uppercase">
              MEDICAL INSURANCE & TPA PARTNERS
            </h1>

            <p className="text-base sm:text-lg md:text-[21px] font-semibold text-black leading-snug mb-2 sm:mb-[14px]">
              Your insurance. Your care. Our support.
            </p>

            <p className="text-sm sm:text-base md:text-[18px] font-medium text-black leading-relaxed max-w-[478px]">
              Explore our empanelled insurance companies and TPA partners for cashless hospitalization.
            </p>
          </motion.div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
        </div>
      ) : (
        <>
          {/* --- 2. OUR INSURANCE & TPA PARTNERS --- */}
          <section className="py-16 sm:py-20 w-full mx-auto px-6 sm:px-10 md:px-20">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="text-center max-w-[800px] mx-auto mb-12 sm:mb-14"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#663399]/10 text-[#663399] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
                Empanelled Network
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-[#663399] leading-tight mb-3">
                Our Insurance &amp; TPA Partners
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-[640px] mx-auto">
                We partner with leading government health schemes, insurance companies, and TPAs to ensure a smooth and seamless cashless hospitalization experience.
              </p>
            </motion.div>

            {/* Government-linked, highlighted (centered in middle) */}
            {govtPartners.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
                className="flex flex-wrap justify-center gap-6 mb-12"
              >
                {govtPartners.map((p) => {
                  const CardContent = (
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ y: -5, scale: 1.015 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="group relative flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gradient-to-br from-[#663399] via-[#592b87] to-[#461e6d] rounded-2xl p-6 sm:p-7 shadow-[0_8px_24px_rgba(102,51,153,0.2)] hover:shadow-[0_16px_36px_rgba(102,51,153,0.35)] transition-all duration-300 text-white overflow-hidden border border-[#8E54D4]/30 w-full max-w-[720px]"
                    >
                      {/* Decorative ambient background glow */}
                      <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white shrink-0 p-3 shadow-md flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        {p.image ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              sizes="(max-width: 640px) 112px, 128px"
                              className="object-contain p-1"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="flex-1 text-center sm:text-left z-10">
                        <div
                          className="text-lg sm:text-xl font-bold leading-snug mb-1 [&_strong]:font-bold text-white group-hover:text-purple-100 transition-colors"
                          dangerouslySetInnerHTML={{ __html: (p.title || "").replace(/&nbsp;/g, " ") }}
                        />
                        <div
                          className="text-xs sm:text-sm text-purple-100/90 leading-relaxed [&_strong]:font-bold"
                          dangerouslySetInnerHTML={{ __html: (p.description || "").replace(/&nbsp;/g, " ") }}
                        />
                      </div>

                      {p.websiteUrl && (
                        <div className="absolute top-4 right-4 p-2 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  );

                  return p.websiteUrl ? (
                    <a
                      key={p.partnerId}
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-[720px] flex justify-center focus:outline-none"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div key={p.partnerId} className="w-full max-w-[720px] flex justify-center">
                      {CardContent}
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Private partners grid */}
            {privatePartners.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.05 }}
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 items-stretch"
              >
                {privatePartners.map((p) => {
                  const CardContent = (
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ y: -6, scale: 1.025 }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      className="group relative flex flex-col items-center justify-between bg-white border border-gray-200/80 hover:border-[#663399]/40 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_32px_rgba(102,51,153,0.12)] transition-all duration-300 cursor-pointer overflow-hidden min-h-[190px] sm:min-h-[205px] h-full"
                    >
                      {/* Top accent bar on hover */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#663399] via-[#9F65D6] to-[#663399] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Subtle hover background tint */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#663399]/[0.02] to-[#663399]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* External link indicator */}
                      {p.websiteUrl && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#663399]">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Logo Container - Generous size so logos are large, clear and sharp */}
                      <div className="relative w-full flex-1 flex items-center justify-center p-2 z-10 min-h-[80px]">
                        {p.image ? (
                          <div className="relative w-full h-[75px] sm:h-[85px] transition-transform duration-300 group-hover:scale-110">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 240px"
                              className="object-contain p-1 drop-shadow-sm"
                            />
                          </div>
                        ) : (
                          <div className="text-gray-400 font-medium text-xs sm:text-sm text-center">
                            {p.title}
                          </div>
                        )}
                      </div>

                      {/* Partner Title - Full name with no truncation */}
                      <div className="w-full pt-2.5 border-t border-gray-100 group-hover:border-[#663399]/20 transition-colors duration-300 z-10 mt-auto">
                        <p className="text-xs sm:text-[13px] font-semibold text-gray-700 group-hover:text-[#663399] text-center leading-snug transition-colors duration-300">
                          {p.title}
                        </p>
                      </div>
                    </motion.div>
                  );

                  return p.websiteUrl ? (
                    <a
                      key={p.partnerId}
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-full block focus:outline-none"
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div key={p.partnerId} className="h-full block">
                      {CardContent}
                    </div>
                  );
                })}
              </motion.div>
            )}

            {govtPartners.length === 0 && privatePartners.length === 0 && (
              <div className="text-center py-10 text-gray-500">Partner information will be available here soon.</div>
            )}
          </section>

          {/* --- 3. CASHLESS PROCESS --- */}
          {processInfo.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="py-16 bg-[#F5F1FA]"
            >
              <div className="max-w-[1550px] w-full mx-auto px-6 sm:px-10 md:px-24 lg:px-28 xl:px-36 2xl:px-44">
                <h2 className="text-xl md:text-2xl font-bold text-[#663399] text-center mb-10 max-w-[900px] mx-auto">
                  Get hassle-free cashless hospitalization with our empanelled insurance &amp; TPA partners.
                </h2>

                <div className="flex flex-col lg:flex-row w-full gap-3 mb-8">
                  {processInfo.map((tab, idx) => (
                    <button
                      key={tab.processId}
                      onClick={() => setSelectedTabIdx(idx)}
                      className={`flex-1 px-4 py-3.5 rounded-full text-xl font-semibold transition-colors ${idx === selectedTabIdx ? "bg-white text-[#663399] shadow-sm" : "text-gray-600 hover:text-[#663399]"
                        }`}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {selectedTab && (
                  <div className="bg-white border border-[#663399]/30 rounded-2xl p-8 lg:p-10">
                    <div
                      className="prose max-w-none text-black leading-relaxed [&_strong]:text-[#663399] [&_ul]:list-disc [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{ __html: (selectedTab.content || "").replace(/&nbsp;/g, " ") }}
                    />
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </>
      )}
    </div>
  );
}
