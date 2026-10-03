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
    { name: "SPECIALTIES", href: "/specialities" },
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
        { name: "Admission Guidelines", href: "/admission-guidelines" },
        { name: "News & Media", href: "/news-media" },
        { name: "Gallery", href: "/gallery" },
        { name: "Virtual Tour", href: "/virtual-tour" },
      ],
    },
    { name: "CONTACT US", href: "/contact" },
  ];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "te", label: "Telugu" },
  { code: "hi", label: "Hindi" },
];

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Google Translate Setup ---
  useEffect(() => {
    if (isAdminRoute) return;
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,te,hi", autoDisplay: false },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
    if (match) setCurrentLang(match[1]);
  }, [isAdminRoute]);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsLangOpen(false);

    if (langCode === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
    }

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  return (
    <header className={`w-full z-50 sticky top-0 bg-white transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}>

      {/* --- TOP LIGHT GREY BAR (Logo & Phone / Language Pills) --- */}
      <div className="w-full bg-[#EFEFEF] border-b border-gray-200">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 xl:px-16 py-3 flex justify-between items-center">

          {/* Alavi Logo */}
          <Link href="/" className="flex-shrink-0 min-w-[200px]">
            <Image
              src="/logo-alavi.png"
              alt="Alavi Hospitals"
              width={210}
              height={60}
              priority
            />
          </Link>

          {/* Right Action Area (Phone Call Pill & Language Selector) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">

            {/* Siren + Single Mobile Number Badge Pill */}
            <div className="flex items-center">
              {/* Flashing Light / Siren Circle */}
              <div className="w-10 h-10 rounded-full bg-[#663399] text-white flex items-center justify-center border-2 border-white shadow-sm z-10 shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C11.45 2 11 2.45 11 3V4C11 4.55 11.45 5 12 5C12.55 5 13 4.55 13 4V3C13 2.45 12.55 2 12 2ZM5.64 5.64C5.25 5.25 4.62 5.25 4.23 5.64C3.84 6.03 3.84 6.66 4.23 7.05L4.94 7.76C5.33 8.15 5.96 8.15 6.35 7.76C6.74 7.37 6.74 6.74 6.35 6.35L5.64 5.64ZM18.36 5.64L17.65 6.35C17.26 6.74 17.26 7.37 17.65 7.76C18.04 8.15 18.67 8.15 19.06 7.76L19.77 7.05C20.16 6.66 20.16 6.03 19.77 5.64C19.38 5.25 18.75 5.25 18.36 5.64ZM12 7C9.24 7 7 9.24 7 12V15H17V12C17 9.24 14.76 7 12 7ZM5 16V18H19V16H5ZM8 19V21C8 21.55 8.45 22 9 22H15C15.55 22 16 21.55 16 21V19H8Z" />
                </svg>
              </div>

              {/* Connected Purple Pill */}
              <a
                href="tel:9603911911"
                className="bg-[#663399] text-white rounded-r-full rounded-l-full pl-6 pr-6 py-2 -ml-4 flex items-center gap-2.5 font-extrabold text-sm xl:text-[15px] hover:bg-[#542982] transition-colors shadow-sm"
              >
                <FaPhoneAlt size={13} className="text-white" />
                <span className="tracking-wide">9603 911 911</span>
              </a>
            </div>

            {/* Language Selector Button */}
            {!isAdminRoute && (
              <div
                className="relative notranslate"
                onMouseEnter={() => setIsLangOpen(true)}
                onMouseLeave={() => setIsLangOpen(false)}
              >
                <button className="flex items-center gap-2 bg-[#663399] text-white px-5 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-[#542982] transition-all shadow-sm">
                  <HiChevronDown size={16} className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
                  <span>{LANGUAGES.find((l) => l.code === currentLang)?.label || "English"}</span>
                  <svg className="w-4 h-4 text-white ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.198 15.604 5 18" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 pt-2 z-50"
                    >
                      <ul className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-[150px]">
                        {LANGUAGES.map((lang) => (
                          <li key={lang.code}>
                            <button
                              type="button"
                              onClick={() => changeLanguage(lang.code)}
                              className={`block w-full text-left px-5 py-2 text-[13px] font-semibold hover:bg-[#F3E8FF] hover:text-[#5B328C] transition-colors whitespace-nowrap ${currentLang === lang.code ? "text-[#5B328C] bg-[#F3E8FF]" : "text-gray-700"
                                }`}
                            >
                              {lang.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Hidden Google Translate Element */}
          {!isAdminRoute && <div id="google_translate_element" className="hidden" />}

          {/* Mobile Menu Toggle Button */}
          <button className="lg:hidden text-[#5B328C] p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <HiX size={30} /> : <HiMenuAlt3 size={30} />}
          </button>
        </div>
      </div>

      {/* --- MAIN DESKTOP NAVIGATION BAR --- */}
      <nav className="hidden lg:block bg-white py-3.5 border-b border-gray-100">
        <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 xl:px-16">
          <ul className="flex justify-center items-center gap-5 lg:gap-7 xl:gap-9">
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
                      className={`flex items-center gap-1 text-[12px] xl:text-[13px] font-extrabold tracking-wider transition-all duration-200 hover:text-[#663399] relative group whitespace-nowrap ${isActive ? "text-[#663399]" : "text-gray-800"
                        }`}
                    >
                      {link.name}
                      <HiChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`}
                      />
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#663399] transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`} />
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
                                  className={`block px-5 py-2.5 text-[13px] font-semibold hover:bg-[#F3E8FF] hover:text-[#663399] transition-colors whitespace-nowrap ${pathname === child.href ? "text-[#663399] bg-[#F3E8FF]" : "text-gray-700"
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
                    className={`text-[12px] xl:text-[13px] font-extrabold tracking-wider transition-all duration-200 hover:text-[#663399] relative group whitespace-nowrap ${isActive ? "text-[#663399]" : "text-gray-800"
                      }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#663399] transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : ""}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl p-6 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <Image src="/logo-alavi.png" alt="Logo" width={140} height={40} />
                <button onClick={() => setIsOpen(false)} className="text-[#663399]">
                  <HiX size={28} />
                </button>
              </div>

              <ul className="flex flex-col gap-5 overflow-y-auto flex-grow">
                {navLinks.map((link) => {
                  if (link.children) {
                    const isExpanded = mobileExpanded === link.name;
                    return (
                      <li key={link.name} className="border-b border-gray-100 pb-3">
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(isExpanded ? null : link.name)}
                          className={`flex items-center justify-between w-full text-[15px] font-bold ${isExpanded || link.children.some((c) => c.href === pathname) ? "text-[#663399]" : "text-gray-700"
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
                              className="overflow-hidden flex flex-col gap-3 pt-3 pl-3"
                            >
                              {link.children.map((child) => (
                                <li key={child.name}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-[13px] font-semibold ${pathname === child.href ? "text-[#663399]" : "text-gray-600"}`}
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
                    <li key={link.name} className="border-b border-gray-100 pb-3">
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-[15px] font-bold ${pathname === link.href ? "text-[#663399]" : "text-gray-700"}`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto p-4 bg-purple-50 rounded-2xl space-y-3">
                <p className="text-[#663399] font-extrabold text-xs tracking-wider uppercase">Emergency Contact</p>
                <a href="tel:9603911911" className="flex items-center gap-3 text-sm font-bold text-gray-800">
                  <FaPhoneAlt className="text-[#663399]" /> 9603 911 911
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