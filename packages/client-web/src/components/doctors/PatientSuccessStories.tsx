"use client";

import React from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaRegCircleRight } from "react-icons/fa6";

// Static Data (Ready for API later)
const patientStoriesData = [
  { id: 1, image: "/stories/story-group.png" },
  { id: 2, image: "/stories/story-family.png" },
  { id: 3, image: "/stories/story-baby.png" },
  { id: 4, image: "/stories/story-consult.png" }
];

export default function PatientSuccessStories() {
  return (
    <section className="pt-8 pb-8 w-full border-t border-gray-100">
      <div className="flex justify-between items-end mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#0066A9] mb-2">Patient Success Stories</h3>
          <p className="text-gray-900 font-medium text-sm max-w-2xl">
            Hear from our patients as they share their journey of healing, trust and expert care at Alavi Hospitals.
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button className="w-8 h-8 rounded-full bg-[#5B328C] text-white flex items-center justify-center hover:bg-[#4a2873] transition-colors shadow-sm">
            <FaChevronLeft className="text-xs" />
          </button>
          <button className="w-8 h-8 rounded-full bg-[#5B328C] text-white flex items-center justify-center hover:bg-[#4a2873] transition-colors shadow-sm">
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {patientStoriesData.map((story) => (
          <div 
            key={story.id} 
            className="relative w-full aspect-[3/4] md:h-[340px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          >
            <Image 
              src={story.image} 
              alt="Patient Success Story" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out" 
            />
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0066A9] to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 flex items-center gap-2">
              <span className="text-white font-bold text-[15px]">Real experiences</span>
              <FaRegCircleRight className="text-white text-[18px] font-light mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}