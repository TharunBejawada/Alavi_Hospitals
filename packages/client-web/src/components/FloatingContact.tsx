"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingContact() {
  return (
    <div className="fixed z-50 
      /* Mobile: Bottom center, horizontal row */
      bottom-6 left-1/2 -translate-x-1/2 flex flex-row gap-4
      /* Desktop: Bottom right, vertical stack */
      md:left-auto md:translate-x-0 md:bottom-8 md:right-8 md:flex-col"
    >
      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/9160606108" // Replace with actual WhatsApp link
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </motion.a>

      {/* Call Button */}
      <motion.a
        href="tel:+919160606108"
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
  );
}