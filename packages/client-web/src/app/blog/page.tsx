"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { API_URL } from "../../config";
import CallToAction from "../../components/home/CallToAction";

// --- TYPES ---
interface ExtraField {
  heading: string;
  description: string;
}

interface BlogPost {
  blogId: string;
  blogTitle: string;
  timeline: string;
  blogImage: string;
  categories: string[];
  url: string;
  extraFields: ExtraField[];
}

function BlogsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "All");

  // --- HELPER: Strip HTML & Decode Entities ---
  const getExcerpt = (htmlContent: string) => {
    if (!htmlContent) return "";
    let text = htmlContent.replace(/<[^>]+>/g, ' ');
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    text = text.replace(/\s+/g, ' ').trim();
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_URL}/api/blogs/getAllBlogs`);
        const data = await res.json();
        const items: BlogPost[] = data.Items || data || [];

        // Sort Newest to Oldest
        const sorted = items.sort((a, b) => 
          new Date(b.timeline).getTime() - new Date(a.timeline).getTime()
        );

        setBlogs(sorted);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // --- DERIVE CATEGORIES & FILTER ---
  const categories = useMemo(() => {
    const allCats = new Set(blogs.flatMap(b => b.categories || []));
    return ["All", ...Array.from(allCats)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(post => {
      if (activeCategory === "All") return true;
      return post.categories?.includes(activeCategory);
    });
  }, [activeCategory, blogs]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section 
        className="relative w-full overflow-hidden flex min-h-[300px] md:min-h-[350px]"
        style={{ background: 'linear-gradient(90deg, #663399 48.69%, #0066A9 111.15%)' }}
      >
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between">
           
           {/* Left Text */}
           <div className="w-full md:w-1/2 py-12 text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight"
              >
                Expert care begins <br className="hidden md:block" /> with knowing more
              </motion.h1>
           </div>

           {/* Right PNG Image Container */}
           <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 md:absolute md:bottom-0 md:right-6 lg:right-12 z-0 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-80 h-80 md:w-[400px] md:h-[400px] lg:w-[1200px] lg:h-[500px] shrink-0 pointer-events-auto"
              >
                 <Image 
                   src="/blog-hero-hands.png" 
                   alt="Expert Care" 
                   fill 
                   className="object-contain object-bottom"
                   priority 
                 />
              </motion.div>
           </div>
        </div>
      </section>

      {/* --- CATEGORY PILLS --- */}
      <div className="max-w-[1400px] mx-auto mt-10 px-4 sm:px-6 lg:px-12">
         <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide"
          >
           {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-lg font-medium whitespace-nowrap transition-all duration-300 ${
                   activeCategory === cat 
                     ? "bg-[#663399] text-white border border-[#5B328C] shadow-md" 
                     : "bg-white border border-[#0066A9] text-[#0066A9] hover:bg-[#F3E8FF]"
                }`}
              >
                {cat === "All" ? "All Topics" : cat}
              </button>
           ))}
         </motion.div>
      </div>

      {/* --- LATEST ARTICLES HEADING --- */}
      <div className="max-w-[1400px] mx-auto px-4 text-center mt-12 mb-10">
        <h2 className="text-[22px] md:text-2xl font-bold text-[#5B328C]">Latest Articles</h2>
      </div>

      {/* --- BLOG GRID --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-[#5B328C] mb-3" />
            <p className="text-[#5B328C] font-semibold animate-pulse">Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 text-sm">We couldn't find any articles in this category.</p>
            <button 
              onClick={() => setActiveCategory("All")}
              className="mt-6 bg-[#5B328C] text-white px-6 py-2 rounded-full font-bold text-sm shadow-md hover:bg-[#4a2873] transition-colors"
            >
              View All Topics
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((post, i) => {
                
                const primaryCategory = post.categories?.[0] || "Medical";
                const rawDesc = post.extraFields?.[0]?.description || "";
                const excerpt = getExcerpt(rawDesc);

                return (
                  <motion.article
                    layout
                    key={post.blogId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
                  >
                    <Link 
                      href={`/blog/${post.url || post.blogId}`} 
                      className="group flex flex-col h-full bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image Area with Floating Category Pill */}
                      <div className="relative w-full h-[200px] md:h-[240px] bg-[#C4AED9] overflow-hidden shrink-0">
                        {post.blogImage && (
                          <Image 
                            src={post.blogImage} 
                            alt={post.blogTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                        {/* Floating Pill */}
                        {/* <div className="absolute top-5 left-5 bg-[#5B328C] text-white text-[12px] font-bold px-4 py-1.5 rounded-full shadow-sm z-10">
                          {primaryCategory}
                        </div> */}
                      </div>

                      {/* Content Area */}
                      <div className="p-6 md:p-8 flex flex-col flex-1 bg-white">
                        
                        {/* Category Subhead */}
                        <h4 className="text-[#5B328C] font-bold text-lg mb-2">
                          {primaryCategory}
                        </h4>
                        
                        {/* Blog Title */}
                        <h3 className="text-gray-900 font-bold text-xl md:text-[22px] mb-3 leading-snug group-hover:text-[#5B328C] transition-colors">
                          {post.blogTitle}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        
      </section>
      
      <div className="mt-20">
        <CallToAction />
      </div>

      {/* Global Style to hide horizontal scrollbar for pills */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#5B328C]" />
      </div>
    }>
      <BlogsContent />
    </Suspense>
  );
}