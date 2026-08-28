"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { API_URL } from "../../config";
import type { InsurancePartner, InsuranceProcessInfo } from "../../../../core/src/types";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
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

  const renderPartnerLogo = (partner: InsurancePartner, className: string) => {
    const content = (
      <div className={className}>
        {partner.image && <Image src={partner.image} alt={partner.title} fill className="object-contain" />}
      </div>
    );
    return partner.websiteUrl ? (
      <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">{content}</a>
    ) : content;
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins']">

      {/* --- 1. HERO --- */}
      <section
        className="relative w-full min-h-[300px] flex items-center overflow-hidden font-['Inter']"
        style={{ background: "linear-gradient(90deg, #F1E9FA 0%, #FFFFFF 100%)" }}
      >
        <div className="max-w-[1453px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-6 lg:px-16 py-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-[26px] md:text-[32px] font-bold text-[#663399] leading-tight mb-3">
              Medical Insurance &amp; TPA Partners
            </h1>
            <p className="text-[16px] font-bold text-black mb-3">Your insurance. Your care. Your support.</p>
            <p className="text-[14px] md:text-[15px] font-medium text-black max-w-[420px] leading-relaxed">
              Explore our empanelled insurance companies and TPA partners for cashless hospitalization.
            </p>
          </motion.div>
          <div className="relative w-full h-[180px] md:h-[220px]">
            <img src="/assets/insurance-hero.png" alt="Medical insurance for your family" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#663399]" />
        </div>
      ) : (
        <>
          {/* --- 2. OUR INSURANCE & TPA PARTNERS --- */}
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeUp}
            className="py-16 max-w-[1453px] w-full mx-auto px-6 lg:px-12"
          >
            <h2 className="text-2xl md:text-[26px] font-bold text-[#663399] text-center mb-10">Our Insurance &amp; TPA Partners</h2>

            {/* Government-linked, highlighted */}
            {govtPartners.length > 0 && (
              <div className="flex flex-wrap gap-6 mb-10 justify-center">
                {govtPartners.map((p) => (
                  <div
                    key={p.partnerId}
                    className="flex items-center gap-4 bg-[#663399] rounded-2xl p-5 w-full md:w-[calc(50%-12px)] max-w-[560px]"
                  >
                    <div className="relative w-16 h-16 rounded-full bg-white shrink-0 overflow-hidden">
                      {p.image && <Image src={p.image} alt={p.title} fill className="object-contain p-1.5" />}
                    </div>
                    <div className="text-white">
                      <div
                        className="text-sm leading-snug [&_strong]:font-bold"
                        dangerouslySetInnerHTML={{ __html: (p.description || "").replace(/&nbsp;/g, " ") }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Private partners grid */}
            {privatePartners.length > 0 && (
              <div className="flex flex-wrap gap-5 justify-center">
                {privatePartners.map((p) => (
                  <div
                    key={p.partnerId}
                    className="flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl p-5 w-[190px] h-[130px]"
                  >
                    {renderPartnerLogo(p, "relative w-full h-14")}
                    <p className="text-xs font-medium text-gray-600 text-center">{p.title}</p>
                  </div>
                ))}
              </div>
            )}

            {govtPartners.length === 0 && privatePartners.length === 0 && (
              <div className="text-center py-10 text-gray-500">Partner information will be available here soon.</div>
            )}
          </motion.section>

          {/* --- 3. CASHLESS PROCESS --- */}
          {processInfo.length > 0 && (
            <motion.section
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="py-16 bg-[#F5F1FA]"
            >
              <div className="max-w-[1140px] w-full mx-auto px-6 lg:px-0">
                <h2 className="text-xl md:text-2xl font-bold text-[#663399] text-center mb-10 max-w-[700px] mx-auto">
                  Get hassle-free cashless hospitalization with our empanelled insurance &amp; TPA partners.
                </h2>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {processInfo.map((tab, idx) => (
                    <button
                      key={tab.processId}
                      onClick={() => setSelectedTabIdx(idx)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                        idx === selectedTabIdx ? "bg-white text-[#663399] shadow-sm" : "text-gray-600 hover:text-[#663399]"
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
