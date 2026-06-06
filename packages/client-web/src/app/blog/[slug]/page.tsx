"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp, 
  FaXTwitter 
} from "react-icons/fa6";
import { API_URL } from "../../../config";

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
  tags: { name: string }[];
  url: string;
  author: string;
  extraFields: ExtraField[];
  seoTitle?: string;
  metaDescription?: string;
}

export default function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Sidebar States
  const [sidebarCategories, setSidebarCategories] = useState<string[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [categorySearch, setCategorySearch] = useState("");

  // --- SCROLL PROGRESS ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchBlogData() {
      try {
        // 1. Fetch Current Blog
        const res = await fetch(`${API_URL}/api/blogs/getBlogByUrl/${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        const item = data.Item || data;
        
        if (item) {
          document.title = item.seoTitle || item.blogTitle;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc && item.metaDescription) {
            metaDesc.setAttribute("content", item.metaDescription);
          }
        }
        setBlog(item);

        // 2. Fetch All Blogs for Sidebar (Dynamic Categories & Recent Blogs)
        try {
          // Adjust endpoint if needed based on your backend routes (e.g., /getAllBlogs)
          const allRes = await fetch(`${API_URL}/api/blogs/getAllBlogs`);
          if (allRes.ok) {
            const allData = await allRes.json();
            const allBlogs: BlogPost[] = allData.Items || allData || [];

            // Extract unique categories
            const uniqueCategories = Array.from(
              new Set(allBlogs.flatMap((b) => b.categories || []))
            ).filter(Boolean).sort();
            setSidebarCategories(uniqueCategories as string[]);

            // Extract recent blogs (exclude current one, sort by date, take top 4)
            const recent = allBlogs
              .filter((b) => b.url !== slug && b.blogId !== slug)
              .sort((a, b) => new Date(b.timeline).getTime() - new Date(a.timeline).getTime())
              .slice(0, 4);
            setRecentBlogs(recent);
          }
        } catch (sidebarError) {
          console.error("Failed to fetch sidebar data:", sidebarError);
        }

      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchBlogData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#5B328C]/20 border-t-[#5B328C] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="w-full max-w-[100vw] overflow-x-hidden bg-[#FAFAFA] font-sans text-gray-800 pb-24">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#5B328C] origin-left z-50"
        style={{ scaleX }}
      />

      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10 box-border">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ========================================= */}
          {/* LEFT COLUMN: Main Blog Content            */}
          {/* ========================================= */}
          <div className="lg:w-[65%] w-full min-w-0 flex flex-col">
            
            {/* 1. Header & Socials */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-gray-900 leading-snug mb-4 break-words">
                {blog.blogTitle}
              </h1>
              
              {/* Social Share Icons */}
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaFacebookF className="text-sm" />
                </button>
                <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaInstagram className="text-sm" />
                </button>
                <button className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaWhatsapp className="text-sm" />
                </button>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition">
                  <FaXTwitter className="text-sm" />
                </button>
              </div>
            </div>

            {/* 2. Hero Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full aspect-[16/9] md:aspect-[21/9] relative rounded-[20px] overflow-hidden mb-10 shadow-sm"
            >
              <Image 
                src={blog.blogImage || "https://placehold.co/1200x600?text=Medical+Article"} 
                alt={blog.blogTitle}
                fill
                className="object-cover" 
                priority
              />
            </motion.div>

            {/* 3. Dynamic Content Blocks */}
            <div className="space-y-6">
              {blog.extraFields?.map((field, idx) => {
                if (!field.heading && !field.description) return null;

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 w-full"
                  >
                    {field.heading && (
                      <div className="flex items-center gap-3 mb-5">
                        {/* Purple Vertical Pill Accent */}
                        <div className="w-1.5 h-6 bg-[#5B328C] rounded-full shrink-0"></div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#5B328C] break-words">
                          {field.heading}
                        </h2>
                      </div>
                    )}
                    
                    {/* Rich Text Editor Content */}
                    <div 
                      className="prose prose-lg max-w-none w-full
                        text-gray-700 leading-relaxed break-words text-[15px] md:text-[16px]
                        prose-headings:text-gray-900 prose-headings:font-bold
                        prose-p:mb-5 
                        prose-img:max-w-full prose-img:w-full prose-img:h-auto prose-img:rounded-xl
                        prose-iframe:max-w-full prose-iframe:w-full
                        [&_img]:!max-w-full [&_img]:!h-auto
                        [&_iframe]:!max-w-full
                        [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2"
                      dangerouslySetInnerHTML={{ __html: field.description }} 
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* 4. Related Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, i) => (
                    <Link href={`/blogs?tag=${tag.name}`} key={i} className="px-4 py-2 bg-gray-200/60 text-gray-700 rounded text-[13px] font-medium hover:bg-[#5B328C] hover:text-white transition duration-300">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================= */}
          {/* RIGHT COLUMN: Sidebar                     */}
          {/* ========================================= */}
          <aside className="lg:w-[35%] w-full">
            <div className="sticky top-24 space-y-8">
              
              {/* --- QUERY FORM CARD --- */}
              <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-[#5B328C] mb-6">Query Form</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">Name <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#5B328C]/30 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">Mobile number <span className="text-red-500">*</span></label>
                    <input type="tel" className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#5B328C]/30 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">Email <span className="text-red-500">*</span></label>
                    <input type="email" className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#5B328C]/30 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5 ml-1">Message</label>
                    <textarea rows={3} className="w-full bg-[#F4F4F4] border-none rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#5B328C]/30 transition-all resize-none"></textarea>
                  </div>
                  <div className="pt-2 flex justify-center">
                    <button type="submit" className="bg-[#5B328C] text-white font-bold py-3 px-10 rounded-full text-sm hover:bg-[#4a2873] transition-colors shadow-md">
                      Submit
                    </button>
                  </div>
                </form>
              </div>

              {/* --- DYNAMIC CATEGORIES CARD --- */}
              {sidebarCategories.length > 0 && (
                <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-[#5B328C] mb-5">Categories</h3>
                  <input 
                    type="text" 
                    placeholder="Search Categories" 
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-5 outline-none focus:border-[#5B328C] transition-colors"
                  />
                  <ul className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                    {sidebarCategories
                      .filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                      .map((cat, idx) => (
                      <li key={idx}>
                        <Link 
                          href={`/blogs?category=${encodeURIComponent(cat)}`} 
                          className="text-[14px] font-semibold text-gray-600 hover:text-[#5B328C] transition-colors block leading-snug"
                        >
                          {cat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- DYNAMIC RECENT BLOGS LIST --- */}
              {recentBlogs.length > 0 && (
                <div className="bg-transparent flex flex-col gap-5">
                  {recentBlogs.map((rBlog, idx) => (
                    <Link href={`/blogs/${rBlog.url || rBlog.blogId}`} key={rBlog.blogId || idx}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 cursor-pointer group h-full transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                        <div className="relative w-full aspect-[21/9] bg-gray-100 overflow-hidden">
                          <Image 
                            src={rBlog.blogImage || "https://placehold.co/600x300?text=Blog"} 
                            alt={rBlog.blogTitle} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          {idx === 0 && (
                            <div className="absolute bottom-2 left-4 bg-white/90 px-3 py-1 rounded shadow-sm">
                              <span className="text-[#5B328C] font-bold text-[11px] uppercase tracking-wide">Recent Blogs</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-[#5B328C] transition-colors line-clamp-2 leading-snug">
                            {rBlog.blogTitle}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>

      {/* Global Style for Custom Scrollbar in Categories */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5B328C; 
        }
      `}} />
    </article>
  );
}