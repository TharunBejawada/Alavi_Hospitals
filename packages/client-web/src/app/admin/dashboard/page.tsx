"use client";

import { useEffect, useState } from "react";
import { FileText, Activity, Loader2, ArrowUpRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { API_URL } from "../../../config";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Blogs Count
        const blogRes = await fetch(`${API_URL}/api/blogs/getAllBlogs`);
        const blogData = await blogRes.json();
        const blogCount = blogData.Items ? blogData.Items.length : 0;


        setStats(prev => ({ ...prev, blogs: blogCount }));
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
         

         {/* Blogs Card (Live Data) */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-24 h-24 text-purple-600" />
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
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                </div>
            </div>

            <Link href="/admin/blogs" className="text-sm font-bold text-purple-600 flex items-center gap-1 mt-auto relative z-10 hover:underline">
                View All Posts <ArrowUpRight className="w-4 h-4" />
            </Link>
         </div>

      </div>
    </div>
  );
}