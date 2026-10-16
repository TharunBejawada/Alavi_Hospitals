"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function FloatingContact() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (pathname?.toLowerCase().startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Mobile Scroll To Top (floating on bottom-right above mobile bottom nav) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden fixed bottom-20 right-4 z-50 flex items-center justify-center w-11 h-11 bg-[#663399] text-white rounded-full shadow-xl border-2 border-white cursor-pointer active:bg-[#542982]"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUp className="w-6 h-6 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Desktop Floating Actions Stack (Scroll-to-top above WhatsApp & Phone) */}
      <div className="hidden md:flex fixed z-50 md:bottom-8 md:right-8 md:flex-col gap-4 items-center">
        {/* Scroll to Top Button (above contact icons) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              type="button"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 10 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-12 h-12 bg-[#663399] rounded-full text-white shadow-xl hover:bg-[#542982] transition-colors border-2 border-white cursor-pointer"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ChevronUp className="w-6 h-6 stroke-[2.5]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* WhatsApp Button */}
        <motion.a
          href="https://wa.me/9603911911" // Replace with actual WhatsApp link
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" />
        </motion.a>

        {/* Call Button */}
        <motion.a
          href="tel:+919603911911"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Call Now"
        >
          <Phone className="w-6 h-6 fill-current" />
        </motion.a>
      </div>
    </>
  );
}