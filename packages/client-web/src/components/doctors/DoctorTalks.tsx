"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

// Static Data (Ready for API later)
const doctorTalksData = {
  featured: [
    { 
      id: 1, 
      title: "Living with PCOD | What Every Woman Should Know", 
      doctor: "Dr. Kalyani", 
      specialty: "Gynecologist and laparoscopic surgeon", 
      image: "/talk-1.jpg", 
      isPurple: false 
    },
    { 
      id: 2, 
      title: "Understanding Your Newborn: Essential Care Tips", 
      doctor: "Dr. Aruna", 
      specialty: "Consultant - Pediatrician and neonatologist", 
      image: "/talk-2.jpg", 
      isPurple: true 
    }
  ],
  list: [
    { id: 3, title: "Signs & Symptoms of Dengue: When to Seek Help", doctor: "Dr. Phani krishna", specialty: "Consultant pediatrician and neonatologist", image: "/talk-3.jpg" },
    { id: 4, title: "Signs & Symptoms of Dengue: When to Seek Help", doctor: "Dr. Phani krishna", specialty: "Consultant pediatrician and neonatologist", image: "/talk-3.jpg" },
    { id: 5, title: "Signs & Symptoms of Dengue: When to Seek Help", doctor: "Dr. Phani krishna", specialty: "Consultant pediatrician and neonatologist", image: "/talk-3.jpg" }
  ]
};

export default function DoctorTalks() {
  return (
    <section className="pt-8 pb-4 w-full border-t border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#5B328C] mb-2">Doctor Talks</h3>
          <p className="text-gray-800 font-medium text-sm">
            Explore doctor-led discussions on various medical conditions, treatment options and wellness tips.
          </p>
        </div>
        <Link href="/doctor-talks">
          <button className="bg-[#483B8D] text-white px-6 py-2.5 rounded shadow-md hover:bg-[#3D2C7A] transition-colors font-semibold text-sm flex items-center gap-2 whitespace-nowrap">
            View All <FaArrowRight />
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Talks (Left & Middle Columns) */}
        {doctorTalksData.featured.map((talk) => (
          <div 
            key={talk.id} 
            className={`rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow ${
              talk.isPurple ? "bg-[#5B328C] text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="relative w-full aspect-[4/3] bg-gray-200">
              <Image src={talk.image} alt={talk.title} fill className="object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h4 className={`font-bold text-[16px] leading-snug mb-6 flex-1 ${talk.isPurple ? "text-white" : "text-gray-900"}`}>
                {talk.title}
              </h4>
              <div className="flex items-center gap-3 mt-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${
                  talk.isPurple ? "bg-white text-[#5B328C]" : "bg-[#5B328C] text-white"
                }`}>
                  Dr
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[13px]">{talk.doctor}</span>
                  <span className={`text-[11px] font-medium leading-tight mt-0.5 ${talk.isPurple ? "text-white/80" : "text-gray-500"}`}>
                    {talk.specialty}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* List Talks (Right Column) */}
        <div className="flex flex-col gap-4">
          {doctorTalksData.list.map((talk) => (
            <div key={talk.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition-shadow h-full">
              <div className="relative w-[35%] h-full min-h-[100px] bg-gray-200 shrink-0">
                <Image src={talk.image} alt={talk.title} fill className="object-cover" />
              </div>
              <div className="p-4 flex flex-col justify-center w-[65%]">
                <h4 className="font-bold text-[13px] leading-snug text-gray-900 mb-3 line-clamp-2">
                  {talk.title}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#5B328C] text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                    Dr
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[11px] text-gray-900">{talk.doctor}</span>
                    <span className="text-[9px] font-medium leading-tight text-gray-500 line-clamp-1">
                      {talk.specialty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}