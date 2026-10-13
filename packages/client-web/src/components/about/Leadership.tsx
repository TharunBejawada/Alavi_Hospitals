"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../config";

interface Doctor {
  doctorId: string;
  name: string;
  department?: string;
  designation?: string;
  designations?: string[];
  qualification?: string;
  experience?: string;
  image?: string;
  url?: string;
}

function formatExperience(exp: string | undefined | null): string {
  if (!exp) return "";
  const numMatch = exp.trim().match(/\d+/);
  return numMatch ? `${numMatch[0]}+` : exp.trim();
}

const Leadership: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/doctors/getAllEnabledDoctors`
        );
        setDoctors(response.data.Items || []);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const [featured, ...rest] = doctors;

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#F3E8FF] border-t-[#5B328C] rounded-full animate-spin" />
            <p className="text-[#5B328C] font-semibold animate-pulse">Loading Doctors...</p>
          </div>
        )}

        {!isLoading && doctors.length > 0 && (
          <>
            {/* Featured Doctor Card */}
            {featured && (() => {
              const designationText =
                featured.designations && featured.designations.length > 0
                  ? featured.designations.join(" | ")
                  : featured.designation;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="w-full bg-[#FAF8FE] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 border border-[#F0E8FA] shadow-sm flex flex-col lg:flex-row items-center gap-6 lg:gap-10"
                >
                  {/* Left: Doctor Photo */}
                  <div className="relative w-full lg:w-[320px] shrink-0 aspect-[4/4] rounded-[20px] bg-[#EFE8FC] overflow-hidden flex items-end justify-center">
                    <div className="absolute inset-x-4 bottom-0 top-6 bg-[#E3D6F8] rounded-t-full z-0" />
                    {featured.image ? (
                      <Image
                        src={featured.image}
                        alt={featured.name}
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

                  {/* Center: Content */}
                  <div className="flex-1 text-left">
                    <Link href={`/doctors/${featured.url || featured.doctorId}`}>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#5B328C] mb-2 hover:underline underline-offset-4">
                        {featured.name}
                      </h3>
                    </Link>

                    {featured.department && (
                      <span className="inline-block bg-[#0066A9] text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                        {featured.department}
                      </span>
                    )}

                    {designationText && (
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3">
                        <strong className="text-[#5B328C]">{featured.name}</strong> — {designationText}
                      </p>
                    )}

                    {featured.qualification && (
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        <span className="font-semibold text-[#5B328C]">Qualifications:</span> {featured.qualification}
                      </p>
                    )}

                    <Link href={`/doctors/${featured.url || featured.doctorId}`}>
                      <button className="mt-5 cursor-pointer bg-[#5B328C] text-white text-sm font-medium py-2.5 px-6 rounded hover:opacity-90 transition-opacity">
                        View Profile
                      </button>
                    </Link>
                  </div>

                  {/* Right: Experience Badge */}
                  {featured.experience && (
                    <div className="w-full lg:w-auto flex lg:flex-col items-center justify-between lg:justify-center pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-purple-200/60 lg:pl-8 min-w-[160px]">
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#5B328C] leading-none mb-1 lg:mb-2">
                        {formatExperience(featured.experience)}
                      </div>
                      <div className="text-xs font-bold text-[#5B328C] tracking-wider text-right lg:text-center uppercase leading-tight max-w-[130px]">
                        YEARS OF MEDICAL EXPERIENCE
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {/* Remaining Doctors Grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {rest.map((doc, index) => {
                  const designationText =
                    doc.designations && doc.designations.length > 0
                      ? doc.designations.join(" | ")
                      : doc.designation;

                  return (
                    <motion.div
                      key={doc.doctorId}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                      className="bg-[#FAF8FE] rounded-[24px] p-5 sm:p-6 flex flex-col border border-[#F0E8FA] shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-[4/3] rounded-[20px] bg-[#EFE8FC] overflow-hidden mb-5 flex items-end justify-center">
                        <div className="absolute inset-x-4 bottom-0 top-6 bg-[#E3D6F8] rounded-t-full z-0" />

                        {doc.image ? (
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            fill
                            className="object-cover object-top z-10"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        ) : (
                          <div className="relative z-10 w-full h-full flex items-center justify-center text-[#5B328C] font-semibold text-sm">
                            Alavi Hospitals
                          </div>
                        )}

                        {/* Experience callout */}
                        {doc.experience && (
                          <div className="absolute top-3 right-3 z-20 flex flex-col items-end text-right">
                            <span className="text-2xl sm:text-3xl font-extrabold text-[#5B328C] leading-none">
                              {formatExperience(doc.experience)}
                            </span>
                            <span className="text-[9px] font-extrabold text-[#5B328C] tracking-wider uppercase leading-tight text-right max-w-[90px]">
                              YEARS OF MEDICAL EXPERIENCE
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Doctor Details */}
                      <Link href={`/doctors/${doc.url || doc.doctorId}`}>
                        <h3 className="text-xl font-bold text-[#5B328C] mb-2 hover:underline underline-offset-4">
                          {doc.name}
                        </h3>
                      </Link>

                      {doc.department && (
                        <div className="mb-3">
                          <span className="inline-block bg-[#E8DCF8] text-[#5B328C] text-xs font-semibold px-3 py-1 rounded-full">
                            {doc.department}
                          </span>
                        </div>
                      )}

                      {designationText && (
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 line-clamp-2">
                          {designationText}
                        </p>
                      )}

                      {doc.qualification && (
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                          {doc.qualification}
                        </p>
                      )}

                      <Link
                        href={`/doctors/${doc.url || doc.doctorId}`}
                        className="mt-auto"
                      >
                        <button className="w-full cursor-pointer border border-[#5B328C] text-[#5B328C] text-sm font-medium py-2 px-4 rounded hover:bg-[#5B328C] hover:text-white transition-colors">
                          View Profile
                        </button>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && doctors.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-medium">
            Unable to load doctors at this time. Please try again later.
          </div>
        )}

      </div>
    </section>
  );
};

export default Leadership;