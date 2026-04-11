"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Importing the specific icons from the Hi (Heroicons) and Fa (Font Awesome) sets
import { HiMenuAlt3, HiX, HiChevronDown } from "react-icons/hi";
import { FaPhoneAlt } from "react-icons/fa";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT US", href: "/about" },
  { name: "SPECIALTIES", href: "/specialties" },
  { name: "DOCTORS", href: "/doctors" },
  { name: "SECOND OPINION", href: "/second-opinion" },
  { name: "HEALTH PACKAGES", href: "/health-packages" },
  { name: "BLOG", href: "/blog" },
  { name: "CONTACT US", href: "/contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`w-full z-50 transition-all duration-300 ${isScrolled ? "fixed top-0 bg-white shadow-lg" : "relative bg-white"}`}>
      
      {/* --- TOP SECTION (Logo & Purple Contact Pill) --- */}
      <div className="container mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="/logo-alavi.png" 
            alt="Alavi Hospitals" 
            width={220} 
            height={65} 
            // className="h-auto w-auto"
            priority 
          />
        </Link>

        {/* Desktop Header Content */}
        <div className="hidden lg:flex items-center gap-5">
          {/* The Contact Pill from the design */}
          <div className="bg-[#5B328C] text-white rounded-full px-8 py-3 flex items-center gap-8 text-[14px] font-semibold">
            <div className="flex items-center gap-2 border-r border-purple-400/50 pr-6">
              <span className="text-purple-200 font-normal">IDPL :</span>
              <a href="tel:9160606108" className="flex items-center gap-2 hover:text-purple-200">
        <FaPhoneAlt size={12} className="text-white" /> 
        91 6060 6108
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
          <button className="flex items-center gap-2 bg-[#5B328C] text-white px-6 py-3 rounded-full text-[14px] font-semibold hover:bg-[#4a2873] transition-all">
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
        <div className="container mx-auto">
          <ul className="flex justify-center items-center gap-10 py-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href}
                  className={`text-[13px] font-extrabold tracking-wider transition-all duration-300 hover:text-[#5B328C] relative group ${
                    pathname === link.href ? "text-[#5B328C]" : "text-gray-800"
                  }`}
                >
                  {link.name}
                  {/* Underline animation on hover */}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5B328C] transition-all duration-300 group-hover:w-full ${pathname === link.href ? "w-full" : ""}`}></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* --- MOBILE DRAWER  --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            {/* Drawer */}
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
                {navLinks.map((link) => (
                  <li key={link.name} className="border-b border-gray-50 pb-3">
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className={`text-[16px] font-bold ${pathname === link.href ? "text-[#5B328C]" : "text-gray-700"}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Contact Footer */}
              <div className="mt-auto p-5 bg-purple-50 rounded-2xl space-y-4">
                <p className="text-[#5B328C] font-black text-xs tracking-widest uppercase">Quick Contact</p>
                <a href="tel:9160606108" className="flex items-center gap-3 text-sm font-bold text-gray-700">
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