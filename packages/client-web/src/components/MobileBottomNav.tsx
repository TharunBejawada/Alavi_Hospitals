"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    // md:hidden ensures this ONLY shows on mobile
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] z-[999] flex w-full h-[68px] pb-2 items-end">
      
      {/* 1. Find Doctor */}
      <Link href="/doctors" className="flex flex-col items-center justify-end w-[20%] gap-1.5 pb-1">
          <div 
            className="w-6 h-6 bg-[#5B328C]" 
            style={{ 
              WebkitMask: "url('/find-doctor.png') center/contain no-repeat", 
              mask: "url('/find-doctor.png') center/contain no-repeat" 
            }} 
          />
          <span className="text-[10px] font-semibold text-gray-700 leading-none">Doctors</span>
        </Link>

      {/* 2. Health Packages */}
      <Link href="/packages" className="flex flex-col items-center justify-end w-[20%] gap-1.5 pb-1">
          <div 
            className="w-6 h-6 bg-[#5B328C]" 
            style={{ 
              WebkitMask: "url('/health-packages.png') center/contain no-repeat", 
              mask: "url('/health-packages.png') center/contain no-repeat" 
            }} 
          />
          <span className="text-[10px] font-semibold text-gray-700 leading-none">Health Packages</span>
        </Link>

      {/* 3. Elevated Center Chat Button */}
      <div className="w-[20%] flex flex-col justify-end items-center relative h-full">
        <a 
          href="https://wa.me/9603911911" 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute -top-7 flex flex-col items-center"
        >
          {/* White outer ring with shadow */}
          <div className="bg-white p-1.5 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.15)]">
            {/* Inner colored circle */}
            <div className="bg-gradient-to-tr from-[#25D366] to-[#128C7E] w-12 h-12 rounded-full flex items-center justify-center text-white">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
          </div>
          <span className="text-[10px] text-gray-800 font-bold mt-1">Chat</span>
        </a>
      </div>

      {/* 4. Second Opinion */}
      <Link href="/second-opinion" className="flex flex-col items-center justify-end w-[20%] gap-1.5 pb-1">
          <div 
            className="w-6 h-6 bg-[#5B328C]" 
            style={{ 
              WebkitMask: "url('/patients.png') center/contain no-repeat", 
              mask: "url('/patients.png') center/contain no-repeat" 
            }} 
          />
          <span className="text-[10px] font-semibold text-gray-700 leading-none text-center">Second Opinion</span>
        </Link>

      {/* 5. Call Us */}
      <a href="tel:+919603911911" className="w-[20%] flex flex-col items-center justify-center gap-1.5 pb-1 cursor-pointer">
        <div className="w-6 h-6 flex items-center justify-center text-[#5B328C]">
          <Phone className="w-5 h-5 fill-current" />
        </div>
        <span className="text-[10px] text-gray-600 font-semibold leading-tight text-center">Call Us</span>
      </a>

    </div>
  );
}