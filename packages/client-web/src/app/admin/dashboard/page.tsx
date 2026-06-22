"use client";

import { useEffect, useState } from "react";
import { FileText, Activity, Loader2, ArrowUpRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { API_URL } from "../../../config"; // Adjust path if needed

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    doctors: 0,
    specialities: 0, // Added specialities state
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all APIs in parallel for better performance
        const [blogRes, docRes, specRes] = await Promise.all([
          fetch(`${API_URL}/api/blogs/getAllBlogs`),
          fetch(`${API_URL}/api/doctors/getAllEnabledDoctors`),
          fetch(`${API_URL}/api/specialities/getAllSpecialities`) // Added specialities fetch
        ]);

        const blogData = await blogRes.json();
        const docData = await docRes.json();
        const specData = await specRes.json(); // Parsed specialities data

        const blogCount = blogData.Items ? blogData.Items.length : 0;
        const docCount = docData.Items ? docData.Items.length : 0;
        const specCount = specData.Items ? specData.Items.length : 0; // Got specialities count

        setStats({ 
          blogs: blogCount, 
          doctors: docCount,
          specialities: specCount // Updated state
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
      <p className="text-slate-500 mb-8">Welcome back! Here is what's happening today.</p>

      <div className="grid md:grid-cols-3 gap-6">
         
         {/* Doctors Card (Live Data) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <HeartPulse className="w-24 h-24 text-[#5B328C]" />
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">Total Doctors</h3>
                    <div className="mt-2">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        ) : (
                            <p className="text-4xl font-bold text-slate-900">{stats.doctors}</p>
                        )}
                    </div>
                </div>
                <div className="p-3 bg-[#F3E8FF] text-[#5B328C] rounded-lg">
                    <HeartPulse className="w-6 h-6" />
                </div>
            </div>

            <Link href="/admin/doctors" className="text-sm font-bold text-[#5B328C] flex items-center gap-1 mt-auto relative z-10 hover:underline">
                View All Doctors <ArrowUpRight className="w-4 h-4" />
            </Link>
         </div>

         {/* Blogs Card (Live Data) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-24 h-24 text-blue-600" />
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">Blog Posts</h3>
                    <div className="mt-2">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        ) : (
                            <p className="text-4xl font-bold text-slate-900">{stats.blogs}</p>
                        )}
                    </div>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                </div>
            </div>

            <Link href="/admin/blogs" className="text-sm font-bold text-blue-600 flex items-center gap-1 mt-auto relative z-10 hover:underline">
                View All Posts <ArrowUpRight className="w-4 h-4" />
            </Link>
         </div>

         {/* Specialities Card (Live Data) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-24 h-24 text-emerald-600" />
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">Total Specialities</h3>
                    <div className="mt-2">
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        ) : (
                            <p className="text-4xl font-bold text-slate-900">{stats.specialities}</p>
                        )}
                    </div>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Activity className="w-6 h-6" />
                </div>
            </div>

            <Link href="/admin/specialities" className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-auto relative z-10 hover:underline">
                View All Specialities <ArrowUpRight className="w-4 h-4" />
            </Link>
         </div>

      </div>
    </div>
  );
}