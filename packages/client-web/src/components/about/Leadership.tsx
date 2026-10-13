"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../config";

// ─── Static text data (original, unchanged) ───────────────────────────────────

interface StaticDoctor {
  name: string;
  role: string;
  intro: string;
  detail: string;
  /** fallback experience if doctor not found in API */
  fallbackExperience: string;
}

const FEATURED_DOCTOR: StaticDoctor = {
  name: "Dr. M. Chandra Sekhar",
  role: "Managing Director",
  intro:
    "Dr. M. Chandra Sekhar, the Managing Director, is an experienced General Physician and Diabetologist with over 19 years of medical expertise.",
  detail:
    "Holding qualifications including MBBS, PGDHSc, PG Diploma in Clinical Endocrinology & Diabetes, and Post Graduation in Diabetology, he has dedicated his career to advancing patient care and managing complex medical conditions.",
  fallbackExperience: "19+",
};

const BOTTOM_DOCTORS: StaticDoctor[] = [
  {
    name: "Dr. M. Pradeep Reddy",
    role: "Director",
    intro:
      "Director, is a specialist in Pediatrics and Neonatology with 16 years of experience in child healthcare.",
    detail:
      "Holding qualifications of MBBS and MD in Pediatrics, he is dedicated to ensuring the healthy growth and development of infants and children.",
    fallbackExperience: "19+",
  },
  {
    name: "Dr. B. Kalyani",
    role: "Director",
    intro:
      "Director at Alavi Hospitals, is a renowned Obstetrician, Gynecologist, and Infertility Specialist with 13 years of experience in women's healthcare.",
    detail:
      "She holds qualifications including MBBS, DGO, DRM (Germany), Fellowship in Reproductive Medicine (IMA), and Fellowship in Laparoscopy. Dr. Kalyani is widely respected for her dedication to maternal health and fertility care.",
    fallbackExperience: "13+",
  },
  {
    name: "Dr. Srinivasa Rao Mallampati",
    role: "Director",
    intro:
      "Director, specializes in Functional Medicine and Rheumatology and brings 18 years of clinical experience to the institution.",
    detail:
      "With qualifications including MBBS and PGDHSc, he focuses on improving metabolic health and managing complex chronic conditions.",
    fallbackExperience: "18+",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatExperience(exp: string | undefined | null): string {
  if (!exp) return "";
  const numMatch = exp.trim().match(/\d+/);
  return numMatch ? `${numMatch[0]}+` : exp.trim();
}

/**
 * Extract significant name tokens — strips "dr" prefix and single-letter
 * initials so "Dr. M. Chandra Sekhar" → ["chandra","sekhar"]
 * and "Dr. B. Kalyani" → ["kalyani"].
 * This makes matching robust regardless of how initials are stored in the DB.
 */
function getTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1 && w !== "dr");
}

interface ApiDoctor {
  name: string;
  image?: string;
  experience?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Leadership: React.FC = () => {
  const [apiDoctors, setApiDoctors] = useState<ApiDoctor[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/doctors/getAllEnabledDoctors`)
      .then((res) => setApiDoctors(res.data.Items || []))
      .catch(() => {/* silently ignore errors */ });
  }, []);

  /**
   * Find the best-matching API doctor for a given static name.
   * Strategy: pick the API entry with the most token overlap.
   * At least one significant token (length ≥ 5) must match to avoid
   * false positives on short common words.
   */
  const getApiData = (staticName: string): { image?: string; experience?: string } => {
    const needleTokens = getTokens(staticName);

    let bestMatch: ApiDoctor | null = null;
    let bestScore = 0;

    for (const d of apiDoctors) {
      const apiTokens = getTokens(d.name);
      const matched = needleTokens.filter((t) => apiTokens.includes(t));
      const score = matched.length;
      // Require at least one long token (≥5 chars) to match, to avoid
      // accidentally matching on short words like "rao"
      const hasSignificantMatch = matched.some((t) => t.length >= 5);
      if (score > bestScore && hasSignificantMatch) {
        bestScore = score;
        bestMatch = d;
      }
    }

    return bestMatch ? { image: bestMatch.image, experience: bestMatch.experience } : {};
  };

  // Resolve image & experience for each doctor (image from API only)
  const featuredApi = getApiData(FEATURED_DOCTOR.name);
  const featuredImage = featuredApi.image ?? null;
  const featuredExp = featuredApi.experience
    ? formatExperience(featuredApi.experience)
    : FEATURED_DOCTOR.fallbackExperience;

  return (
    <section className="py-12 sm:py-16 bg-white px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#5B328C] mb-3 leading-tight">
            Expert Leadership Driving Excellence
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
            The foundation of Alavi Hospitals is built on the expertise and vision of its Board of Directors, who bring decades of medical experience and leadership to the institution.
          </p>
        </div>

        {/* ── Featured Doctor (Dr. M. Chandra Sekhar) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full bg-[#FAF8FE] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 border border-[#F0E8FA] shadow-sm flex flex-col lg:flex-row items-center gap-6 lg:gap-10"
        >
          {/* Left: Doctor Photo (API only) */}
          <div className="relative w-full lg:w-[320px] shrink-0 aspect-[4/3] lg:aspect-[4/4] rounded-[20px] bg-[#EFE8FC] overflow-hidden flex items-end justify-center">
            <div className="absolute inset-x-4 bottom-0 top-6 bg-[#E3D6F8] rounded-t-full z-0" />
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={FEATURED_DOCTOR.name}
                fill
                className="object-cover object-top z-10"
                priority
              />
            ) : (
              <div className="relative z-10 w-full h-full flex items-center justify-center text-[#5B328C] font-semibold text-sm">
                Alavi Hospitals
              </div>
            )}
          </div>

          {/* Center: Static Content */}
          <div className="flex-1 text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#5B328C] mb-2">
              {FEATURED_DOCTOR.name}
            </h3>
            <span className="inline-block bg-[#0066A9] text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {FEATURED_DOCTOR.role}
            </span>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
              <strong className="text-[#5B328C]">{FEATURED_DOCTOR.name}</strong>, the Managing Director, is an experienced General Physician and Diabetologist with over 19 years of medical expertise.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Holding qualifications including MBBS, PGDHSc, PG Diploma in Clinical Endocrinology &amp; Diabetes, and Post Graduation in Diabetology, he has dedicated his career to advancing patient care and managing complex medical conditions.
            </p>
          </div>

          {/* Right: Experience Badge (from API) */}
          <div className="w-full lg:w-auto flex lg:flex-col items-center justify-between lg:justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-purple-200/60 lg:pl-8 min-w-[160px]">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#5B328C] leading-none mb-1 lg:mb-2">
              {featuredExp}
            </div>
            <div className="text-xs font-bold text-[#5B328C] tracking-wider text-right lg:text-center uppercase leading-tight max-w-[130px]">
              YEARS OF MEDICAL EXPERIENCE
            </div>
          </div>
        </motion.div>

        {/* ── Bottom Row: 3 Director Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BOTTOM_DOCTORS.map((doc, index) => {
            const apiData = getApiData(doc.name);
            const image = apiData.image ?? null;
            const exp = apiData.experience
              ? formatExperience(apiData.experience)
              : doc.fallbackExperience;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#FAF8FE] rounded-[24px] p-5 sm:p-6 flex flex-col border border-[#F0E8FA] shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image Container (API only) */}
                <div className="relative w-full aspect-[4/3] rounded-[20px] bg-[#EFE8FC] overflow-hidden mb-5 flex items-end justify-center">
                  <div className="absolute inset-x-4 bottom-0 top-6 bg-[#E3D6F8] rounded-t-full z-0" />

                  {image ? (
                    <Image
                      src={image}
                      alt={doc.name}
                      fill
                      className="object-cover object-top z-10"
                    />
                  ) : (
                    <div className="relative z-10 w-full h-full flex items-center justify-center text-[#5B328C] font-semibold text-sm">
                      Alavi Hospitals
                    </div>
                  )}

                  {/* Experience callout (from API) */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col items-end text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#5B328C] leading-none">
                      {exp}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#5B328C] tracking-wider uppercase leading-tight text-right max-w-[90px]">
                      YEARS OF MEDICAL EXPERIENCE
                    </span>
                  </div>
                </div>

                {/* Static Doctor Details */}
                <h3 className="text-xl font-bold text-[#5B328C] mb-2">
                  {doc.name}
                </h3>

                <div className="mb-3">
                  <span className="inline-block bg-[#E8DCF8] text-[#5B328C] text-xs font-semibold px-3 py-1 rounded-full">
                    {doc.role}
                  </span>
                </div>

                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3">
                  <strong className="text-[#5B328C]">{doc.name}</strong>, {doc.intro}
                </p>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {doc.detail}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Leadership;