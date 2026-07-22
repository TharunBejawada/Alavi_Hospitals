"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const leftNavItems = [
  { id: 1, title: "Find A Doctor", iconSrc: "/find-doctor.png", link: "/doctors" },
  { id: 2, title: "Health Packages", iconSrc: "/health-packages.png", link: "/packages" },
  { id: 3, title: "Get Second Opinion", iconSrc: "/patients.png", link: "/second-opinion" },
];

export default function FloatingSideNav() {
  const pathname = usePathname(); // ADD THIS

  // ADD THIS: If the URL starts with /admin, don't render the component
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <div className="hidden md:flex fixed left-0 top-1/3 flex flex-col gap-[8px] z-[90]">
      {leftNavItems.map((item) => (
        <motion.div
          key={item.id}
          initial="rest"
          whileHover="hover"
          animate="rest"
          variants={{
            rest: { width: "72px" },
            hover: { width: "227px" }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#663399] text-white overflow-hidden rounded-r-[11px] shadow-[5px_5px_15px_rgba(0,0,0,0.15)] cursor-pointer"
        >
          <Link href={item.link} className="flex items-center w-[227px] h-[69px] relative">
            
            {/* TEXT CONTAINER */}
            <motion.div 
              variants={{
                rest: { opacity: 0, x: -10 },
                hover: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-[20px] w-auto h-[27px] flex items-center"
            >
              <span className="whitespace-nowrap font-['Poppins'] font-medium text-[15px] xl:text-[18px] leading-[148%] text-white">
                {item.title}
              </span>
            </motion.div>

            {/* ICON CONTAINER */}
            <motion.div 
              variants={{
                rest: { left: "20px" },
                hover: { left: "180px" }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute flex justify-center items-center"
            >
              <div className="relative w-[31px] h-[31px]">
                <Image 
                  src={item.iconSrc} 
                  alt={item.title} 
                  fill 
                  className="object-contain" 
                />
              </div>
            </motion.div>

          </Link>
        </motion.div>
      ))}
    </div>
  );
}