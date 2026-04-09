"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { 
  FaUserDoctor, 
  FaLocationDot, 
  FaGraduationCap, 
  FaBriefcaseMedical,
  FaCalendarCheck,
  FaArrowRight
} from "react-icons/fa6";
import { API_URL } from "../../config";

export default function DoctorListUser() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/doctors/getAllEnabledDoctors`);
        setDoctors(response.data.Items || []);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#F3E8FF] border-t-[#5B328C] rounded-full animate-spin"></div>
          <p className="text-[#5B328C] font-semibold animate-pulse">Loading Specialists...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-[#FAFAFA] min-h-screen px-4 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B328C] mb-6">
            Our Specialist Doctors
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Meet our team of highly qualified and experienced medical professionals dedicated to providing exceptional healthcare and compassionate patient support.
          </p>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg font-medium">Currently updating our doctor profiles. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor: any) => {
              const designationText = doctor.designations && doctor.designations.length > 0 
                ? doctor.designations.join(" • ") 
                : doctor.designation;

              return (
                <div 
                  key={doctor.doctorId} 
                  className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_10px_40px_rgba(91,50,140,0.08)] border border-gray-100 transition-all duration-300 flex flex-col group"
                >
                  {/* Top Image Section */}
                  <div className="relative w-full h-[280px] bg-[#F8F6FA] overflow-hidden">
                    {doctor.image ? (
                      <Image 
                        src={doctor.image} 
                        alt={doctor.name} 
                        fill 
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FaUserDoctor className="text-6xl opacity-50" />
                      </div>
                    )}
                    
                    {/* Floating Department Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#5B328C] text-xs font-bold px-4 py-2 rounded-full shadow-sm">
                      {doctor.department}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 lg:p-8 flex flex-col flex-grow">
                    
                    {/* Name & Designation */}
                    <div className="mb-6 border-b border-gray-50 pb-4">
                      <Link href={`/doctors/${doctor.url || doctor.doctorId}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-[#5B328C] transition-colors line-clamp-1">
                          {doctor.name}
                        </h2>
                      </Link>
                      <p className="text-[#5B328C] font-semibold text-sm line-clamp-2">
                        {designationText}
                      </p>
                    </div>

                    {/* Meta Details List */}
                    <div className="space-y-4 mb-8 flex-grow">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-[#5B328C]/60"><FaGraduationCap /></div>
                        <p className="text-gray-600 text-sm leading-snug line-clamp-2">
                          <span className="font-semibold text-gray-800">Qualification:</span> {doctor.qualification}
                        </p>
                      </div>

                      {doctor.experience && (
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-[#5B328C]/60"><FaBriefcaseMedical /></div>
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold text-gray-800">Experience:</span> {doctor.experience}
                          </p>
                        </div>
                      )}

                      {doctor.location && (
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-[#5B328C]/60"><FaLocationDot /></div>
                          <p className="text-gray-600 text-sm line-clamp-1">
                            <span className="font-semibold text-gray-800">Location:</span> {doctor.location}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Call to Action Buttons */}
                    <div className="mt-auto flex flex-col gap-3">
                      {/* Primary Action: Book Appointment */}
                      <Link href={`/contact?doctor=${encodeURIComponent(doctor.name)}`}>
                        <button className="w-full flex items-center justify-center gap-2 bg-[#5B328C] text-white hover:bg-[#4a2873] font-bold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg">
                          <FaCalendarCheck className="text-lg" />
                          Book an Appointment
                        </button>
                      </Link>
                      
                      {/* Secondary Action: View Profile */}
                      <Link href={`/doctors/${doctor.url || doctor.doctorId}`}>
                        <button className="w-full flex items-center justify-center gap-2 bg-transparent text-[#5B328C] border-2 border-[#5B328C]/20 hover:border-[#5B328C] hover:bg-[#F3E8FF] font-bold py-3 rounded-xl transition-all duration-300 active:scale-[0.98]">
                          View Full Profile
                          <FaArrowRight className="text-sm" />
                        </button>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}