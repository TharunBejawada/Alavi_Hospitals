"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "../../config";
import { Speciality } from "../../../../core/src/types";

export default function SpecialitiesPage() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [urlMap, setUrlMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch specialities and speciality landing pages in parallel
        const [specRes, pagesRes] = await Promise.all([
          fetch(`${API_URL}/api/specialities/getAllEnabledSpecialities`),
          fetch(`${API_URL}/api/speciality-pages/getAll`)
        ]);

        const specData = await specRes.json();
        const pagesData = await pagesRes.json();
        
        // Sort by priority order (lowest number first, default to 99)
        const sorted = (specData.Items || []).sort((a: Speciality, b: Speciality) => 
          (Number(a.priorityOrder) || 99) - (Number(b.priorityOrder) || 99)
        );
        
        setSpecialities(sorted);

        // Map specialityId to the custom SEO URL slug
        const map: Record<string, string> = {};
        (pagesData.Items || []).forEach((page: any) => {
          if (page.specialityId && page.seoConfig?.url) {
            map[page.specialityId] = page.seoConfig.url;
          }
        });
        setUrlMap(map);

      } catch (error) {
        console.error("Failed to fetch specialities data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="font-[Poppins] min-h-screen bg-[#FAFAFA] pb-24">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[350px] md:h-[400px] lg:h-[450px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/specialities-banner.png" 
            alt="Medical Specialities" 
            fill 
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(90deg, #663399 40.13%, rgba(0, 102, 169, 0) 100%)' }}
        ></div>

        {/* Hero Content */}
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-12 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl text-white"
          >
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-semibold leading-tight mb-4">
              Compassionate Care Backed by Medical Excellence
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-normal pr-4 md:pr-10">
              Delivering quality healthcare with experienced specialists, advanced technology, and a commitment to patient wellbeing across all major specialties.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SPECIALITIES GRID SECTION --- */}
      <section className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 mt-16 md:mt-24">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-[#5B328C] mb-3" />
            <p className="text-[#5B328C] font-semibold animate-pulse">Loading specialities...</p>
          </div>
        ) : specialities.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Specialities Found</h3>
            <p className="text-gray-500">We are currently updating our speciality list.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {specialities.map((spec, index) => {
              // Get the mapped URL slug, fallback to specialityId if no landing page exists yet
              const targetUrl = urlMap[spec.specialityId] 
                ? `${urlMap[spec.specialityId]}` 
                : `/specialities/${spec.specialityId}`;

              return (
                <motion.div
                  key={spec.specialityId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <Link 
                    href={targetUrl} 
                    className="group relative flex flex-col h-full min-h-[320px] bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  >
                    
                    {/* --- HOVER BACKGROUND REVEAL --- */}
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                      {/* Background Image */}
                      {spec.image && (
                        <Image 
                          src={spec.image} 
                          alt={spec.specialityName} 
                          fill 
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
                        />
                      )}
                      {/* Darkening/Blend overlay to ensure gradient shows well */}
                      <div className="absolute inset-0 bg-[#5B328C]/20 mix-blend-multiply"></div>
                      {/* Custom Hover Gradient Overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(270.39deg, rgba(255, 255, 255, 0) -209.35%, #663399 69.26%)' }}
                      ></div>
                    </div>

                    {/* --- CONTENT AREA --- */}
                    <div className="relative z-10 p-8 lg:p-10 flex flex-col flex-grow">
                      
                      {/* Icon Container */}
                      <div className="w-[72px] h-[72px] rounded-full bg-[#EEF8FF] group-hover:bg-white flex items-center justify-center shrink-0 mb-6 transition-colors duration-500 shadow-sm p-4">
                        {spec.icon ? (
                          <div className="relative w-full h-full">
                            <Image src={spec.icon} alt="Icon" fill className="object-contain" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-[#5B328C] rounded-full opacity-50"></div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-[20px] md:text-[22px] font-semibold text-[#5B328C] group-hover:text-white uppercase tracking-wide mb-3 transition-colors duration-500">
                        {spec.specialityName}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 group-hover:text-white/90 text-sm md:text-[15px] leading-relaxed line-clamp-4 flex-grow transition-colors duration-500">
                        {spec.description}
                      </p>

                      {/* Action Link */}
                      <div className="mt-8 pt-4 flex items-center text-[#5B328C] group-hover:text-white font-medium text-sm transition-colors duration-500">
                        Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}