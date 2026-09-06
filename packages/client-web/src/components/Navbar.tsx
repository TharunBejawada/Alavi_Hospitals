"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";

const navLinks: {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}[] = [
  { name: "HOME", href: "/" },
  { name: "ABOUT US", href: "/about" },
  { name: "SPECIALITIES", href: "/specialities" },
  { name: "DOCTORS", href: "/doctors" },
  { name: "SECOND OPINION", href: "/second-opinion" },
  { name: "HEALTH PACKAGES", href: "/health-packages" },
  { name: "BLOG", href: "/blog" },
  {
    name: "FOR PATIENTS",
    href: "/patients",
    children: [
      { name: "Patient Rights & Responsibilities", href: "/patients" },
      { name: "Insurance & TPA", href: "/insurance" },
      { name: "Vaccination", href: "/vaccinations" },
      { name: "Patient and Visitor Guidelines", href: "/patient-visitor-guidelines" },
      { name: "News & Media", href: "/news-media" },
      { name: "Gallery", href: "/gallery" },
      { name: "Virtual Tour", href: "/virtual-tour" },
    ],
  },
  { name: "CONTACT US", href: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`w-full z-50 transition-all duration-300 ${isScrolled ? "fixed top-0 bg-white shadow-lg" : "relative bg-white"}`}>
      
      {/* --- TOP SECTION (Logo & Purple Contact Pill) --- */}
      {/* Increased padding: px-8 md:px-12 xl:px-16 and py-5 */}
      <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 xl:px-16 py-5 flex justify-between items-center">
        
        {/* Added min-w-[220px] to strictly prevent logo shrinking */}
        <Link href="/" className="flex-shrink-0 min-w-[220px] mr-4">
          <Image 
            src="/logo-alavi.png" 
            alt="Alavi Hospitals" 
            width={220} 
            height={65} 
            priority 
          />
        </Link>

        {/* Desktop Header Content */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          <div className="bg-[#5B328C] text-white rounded-full px-6 xl:px-8 py-3 flex items-center gap-4 xl:gap-8 text-[13px] xl:text-[14px] font-semibold whitespace-nowrap">
            <div className="flex items-center gap-2 border-r border-purple-400/50 pr-4 xl:pr-6">
              <span className="text-purple-200 font-normal">IDPL :</span>
              <a href="tel:9603911911" className="flex items-center gap-2 hover:text-purple-200">
                <FaPhoneAlt size={12} className="text-white" /> 
                9603 911 911
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-200 font-normal">Chintal :</span>
              <a href="tel:9533121257" className="flex items-center gap-2 hover:text-purple-200">
                <FaPhoneAlt size={12} className="text-white" />
                9533 1212 57
              </a>
            </div>
          </div>

          {/* Language Selector */}
          <button className="flex items-center gap-2 bg-[#5B328C] text-white px-5 xl:px-6 py-3 rounded-full text-[13px] xl:text-[14px] font-semibold hover:bg-[#4a2873] transition-all">
            English <HiChevronDown size={18} />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button className="lg:hidden text-[#5B328C] p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={32} /> : <HiMenuAlt3 size={32} />}
        </button>
      </div>

      {/* --- DESKTOP NAVIGATION BAR --- */}
      <nav className="hidden lg:block border-y border-gray-100 bg-white">
        {/* Increased padding: px-8 md:px-12 xl:px-16 */}
        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 xl:px-16">
          <ul className="flex justify-center items-center gap-4 lg:gap-6 xl:gap-10 py-4">
            {navLinks.map((link) => {
              const isChildActive = link.children?.some((child) => child.href === pathname);
              const isActive = pathname === link.href || isChildActive;

              if (link.children) {
                return (
                  <li
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1 text-[11px] lg:text-[12px] xl:text-[13px] font-extrabold tracking-wider transition-all duration-300 hover:text-[#5B328C] relative group whitespace-nowrap ${
                        isActive ? "text-[#5B328C]" : "text-gray-800"
                      }`}
                    >
                      {link.name}
                      <HiChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`}
                      />
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5B328C] transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`}></span>
                    </button>

                    <AnimatePresence>
                      {openDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
                        >
                          <ul className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-[260px]">
                            {link.children.map((child) => (
                              <li key={child.name}>
                                <Link
                                  href={child.href}
                                  className={`block px-5 py-2.5 text-[13px] font-semibold hover:bg-[#F3E8FF] hover:text-[#5B328C] transition-colors whitespace-nowrap ${
                                    pathname === child.href ? "text-[#5B328C] bg-[#F3E8FF]" : "text-gray-700"
                                  }`}
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-[11px] lg:text-[12px] xl:text-[13px] font-extrabold tracking-wider transition-all duration-300 hover:text-[#5B328C] relative group whitespace-nowrap ${
                      isActive ? "text-[#5B328C]" : "text-gray-800"
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5B328C] transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`}></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* --- MOBILE DRAWER  --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl p-6 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <Image src="/logo-alavi.png" alt="Logo" width={140} height={40} />
                <button onClick={() => setIsOpen(false)} className="text-[#5B328C]"><HiX size={30} /></button>
              </div>

              <ul className="flex flex-col gap-6 overflow-y-auto flex-grow">
                {navLinks.map((link) => {
                  if (link.children) {
                    const isExpanded = mobileExpanded === link.name;
                    return (
                      <li key={link.name} className="border-b border-gray-50 pb-3">
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(isExpanded ? null : link.name)}
                          className={`flex items-center justify-between w-full text-[16px] font-bold ${
                            isExpanded || link.children.some((c) => c.href === pathname) ? "text-[#5B328C]" : "text-gray-700"
                          }`}
                        >
                          {link.name}
                          <HiChevronDown size={18} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden flex flex-col gap-4 pt-4 pl-4"
                            >
                              {link.children.map((child) => (
                                <li key={child.name}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-[14px] font-semibold ${pathname === child.href ? "text-[#5B328C]" : "text-gray-600"}`}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  return (
                    <li key={link.name} className="border-b border-gray-50 pb-3">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-[16px] font-bold ${pathname === link.href ? "text-[#5B328C]" : "text-gray-700"}`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto p-5 bg-purple-50 rounded-2xl space-y-4">
                <p className="text-[#5B328C] font-black text-xs tracking-widest uppercase">Quick Contact</p>
                <a href="tel:9603911911" className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <FaPhoneAlt className="text-[#5B328C]" /> IDPL
                </a>
                <a href="tel:9533121257" className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <FaPhoneAlt className="text-[#5B328C]" /> Chintal
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;