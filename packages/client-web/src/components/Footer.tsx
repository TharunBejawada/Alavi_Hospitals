"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { API_URL } from "../config"; // Adjust path as needed

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // --- STATE FOR SPECIALITIES ---
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [urlMap, setUrlMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // --- FETCH SPECIALITIES ON MOUNT ---
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
        
        setSpecialities(specData.Items || []);

        // Map specialityId to the custom SEO URL slug
        const map: Record<string, string> = {};
        (pagesData.Items || []).forEach((page: any) => {
          if (page.specialityId && page.seoConfig?.url) {
            map[page.specialityId] = page.seoConfig.url;
          }
        });
        setUrlMap(map);

      } catch (error) {
        console.error("Failed to fetch specialities data for footer:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <footer className="bg-[#2D1B3E] text-white pt-20 font-sans">
      
      <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 xl:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 pb-12 lg:pb-16">
          
          {/* COLUMN 1: About */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <Image 
                src="/logo-alavi-old.png" 
                alt="Alavi Hospitals" 
                width={280} 
                height={90} 
                className="brightness-100 object-contain max-w-full h-auto" 
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2">
                About Alavi Multi Speciality Hospital
              </h3>
              <p className="text-[14px] xl:text-[15px] leading-relaxed text-gray-300 text-justify">
                Established in March 2024, Alavi Multi Speciality Hospital (formerly Kodali Hospital) 
                is committed to delivering expert and compassionate healthcare. We specialize in 
                women's health, pediatrics and a wide range of medical conditions.
              </p>
            </div>
          </div>

          {/* COLUMN 2: Dynamic Specialities */}
          <div className="lg:pl-8 xl:pl-10">
            <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2 mb-6 lg:mb-8">
              Our Specialities
            </h3>
            
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <>
                {/* <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 xl:gap-4 text-[14px] xl:text-[15px] text-gray-300">
                  {specialities.slice(0, 8).map((spec) => (
                    <li key={spec.specialityId || spec.specialityName} className="hover:text-white transition-colors cursor-pointer flex items-center gap-3">
                      <Link href={`/specialities/${spec.url || spec.specialityId}`} className="w-full">
                        {spec.specialityName}
                      </Link>
                    </li>
                  ))}
                </ul> */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 xl:gap-4 text-[14px] xl:text-[15px] text-gray-300">
                  {specialities.slice(0, 8).map((spec) => {
                    // Get the mapped URL slug, fallback to specialityId if no landing page exists yet
                    const targetUrl = urlMap[spec.specialityId] 
                      ? `${urlMap[spec.specialityId]}` 
                      : `/specialities/${spec.specialityId}`;

                    return (
                      <li key={spec.specialityId || spec.specialityName} className="hover:text-white transition-colors cursor-pointer flex items-center gap-3">
                        <Link href={targetUrl} className="w-full">
                          {spec.specialityName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                
                {/* View More Link (Shows only if there are more than 8 specialities) */}
                {specialities.length > 8 && (
                  <Link 
                    href="/specialities" 
                    className="inline-block mt-6 text-[14px] font-semibold text-[#E59A1D] hover:text-white transition-colors group"
                  >
                    View All Specialities 
                    <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* COLUMN 3: Contact & Address */}
          <div className="space-y-6 lg:space-y-8 md:col-span-2 lg:col-span-1">
            
            <div>
              <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2 mb-6 lg:mb-8">
                Contact Us
              </h3>
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-[#5B328C] p-2.5 rounded-full shrink-0">
                  <FaPhoneAlt className="text-white text-xs" />
                </div>
                <div className="text-[14px] xl:text-[15px] space-y-1 font-medium">
                  <p>95331 21257 | 9603 911 911</p>
                  <p>040-49 99 49 49</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold border-b border-purple-500/30 pb-2 mb-6 lg:mb-8">
                Address
              </h3>
              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-lg" />
                  <p className="text-[13px] xl:text-[14px] text-gray-300 leading-snug">
                    <span className="font-bold text-white block text-base mb-1">IDPL</span>
                    Branch 1: 12, 234, Adarsh Nagar, Adjeetpura Nagar, Opp: IDPL Colony, Balanagar, Secunderabad, Hyderabad, Telangana - 500037
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-lg" />
                  <p className="text-[13px] xl:text-[14px] text-gray-300 leading-snug">
                    <span className="font-bold text-white block text-base mb-1">Chinthal</span>
                    Branch 2: 5-120/2, Jeedimetla Main Road, HMT Road, Opp: Asian Sha Theater, Shiva Nagar, Chinthal, Hyderabad, Telangana -500054
                  </p>
                </div>
              </div>
            </div>
            
          </div>

        </div>
      </div>

      {/* --- BOTTOM COPYRIGHT BAR --- */}
      <div className="bg-[#5B328C] py-5 text-center border-t border-white/10">
        <p className="text-[12px] md:text-[13px] font-bold tracking-[0.1em] uppercase px-4">
          Copyright © {currentYear} . ALAVI HOSPITALS . All Rights Reserved
        </p>
        <Link className="text-sm font-medium justify-center hover:text-[#E59A1D] transition-colors flex gap-1.5 mt-3" title="Admin Dashboard Login" href="/admin/login">
          <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          Admin Portal
        </Link>
      </div>
    </footer>
  );
};

export default Footer;