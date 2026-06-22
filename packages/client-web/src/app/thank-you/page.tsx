"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

function ThankYouContent() {
  const searchParams = useSearchParams();

  // Extract data from URL (fallback to placeholders if accessed directly)
  const name = searchParams.get("name") || "[Patient Name]";
  const mobile = searchParams.get("mobile") || "[Mobile Number]";
  const date = searchParams.get("date") || "[Appointment Date]";
  const department = searchParams.get("department") || "[Specialty]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      // m-auto ensures perfect vertical centering without cutting off the top on smaller screens
      className="mx-auto w-full max-w-[824px] bg-[#FFFFFF] rounded-[23px] p-8 md:p-12 shadow-2xl flex flex-col items-center font-['Poppins']"
    >
      
      {/* Checkmark Circle */}
      <div className="w-[74px] h-[74px] bg-[rgba(102,51,153,0.21)] rounded-full flex items-center justify-center mb-6 shrink-0">
         <Check className="w-8 h-8 text-[#663399]" strokeWidth={3} />
      </div>

      {/* Thank You Header */}
      <h2 className="font-semibold text-[21px] leading-[156%] text-[#663399] mb-6 text-center">
        Thank You!
      </h2>

      {/* Success Messages */}
      <div className="text-center w-full max-w-[703px] space-y-4 mb-8">
        <p className="font-normal text-[16px] leading-[24px] text-[#000000]">
          Your appointment request has been submitted successfully. Our team will contact you shortly to confirm your appointment and assist you further.
        </p>
        <p className="font-normal text-[16px] leading-[24px] text-[#000000]">
          <span className="font-semibold">Please Note:</span> Submitting this form does not guarantee a confirmed appointment. Confirmation will be provided by our team through a phone call or WhatsApp message.
        </p>
      </div>

      {/* Summary Details Box */}
      <div className="w-full max-w-[712px] bg-[rgba(217,217,217,0.29)] rounded-[14px] p-8 mb-8 flex justify-center">
        <div className="grid grid-cols-[140px_auto] sm:grid-cols-[160px_auto] gap-y-4 text-[16px] leading-[24px] text-[#000000]">
          
          <div className="font-normal text-right pr-4 sm:pr-8">Name:</div>
          <div className="font-medium text-left truncate">{name}</div>
          
          <div className="font-normal text-right pr-4 sm:pr-8">Mobile:</div>
          <div className="font-medium text-left truncate">{mobile}</div>
          
          <div className="font-normal text-right pr-4 sm:pr-8">Preferred Date:</div>
          <div className="font-medium text-left truncate">{date}</div>
          
          <div className="font-normal text-right pr-4 sm:pr-8">Department:</div>
          <div className="font-medium text-left truncate">{department}</div>
          
        </div>
      </div>

      {/* Back to Home Button */}
      <Link href="/" className="w-full max-w-[712px]">
        <button className="w-full h-[64px] bg-[linear-gradient(90deg,#0066A9_0%,#663399_100%)] rounded-[14px] text-[#FFFFFF] font-semibold text-[24px] leading-[156%] flex items-center justify-center hover:opacity-90 transition-opacity shadow-md">
          Back to Home
        </button>
      </Link>

    </motion.div>
  );
}

// Custom Skeleton Loader that exactly matches the footprint of the real card to prevent layout shifts
function ThankYouSkeleton() {
  return (
    <div className="m-auto w-full max-w-[824px] h-[700px] bg-[#FFFFFF] rounded-[23px] shadow-2xl flex flex-col items-center justify-center animate-pulse">
       <div className="w-12 h-12 border-4 border-[#F3E8FF] border-t-[#5B328C] rounded-full animate-spin"></div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    // min-h-[100dvh] prevents mobile URL bar jumping, flex-col + m-auto safely centers content
    <div className="min-h-[100dvh] bg-[#F4F9FF] flex flex-col p-4 py-12">
      <Suspense fallback={<ThankYouSkeleton />}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}