"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Search, 
  BookOpen, 
  HeartPulse,
  Filter 
} from "lucide-react";
import { API_URL } from "../../config";

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  // --- HELPER: Calculate Read Time ---
  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return `${minutes} min read`;
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

  // --- DERIVE CATEGORIES & FILTER ---
  const categories = useMemo(() => {
    const allCats = new Set(blogs.flatMap(b => b.categories || []));
    return ["All", ...Array.from(allCats)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return blogs.filter(post => {
      const matchQuery = post.blogTitle.toLowerCase().includes(query) ||
                         post.categories.some(cat => cat.toLowerCase().includes(query));
      
      const matchCategory = activeCategory === "All" || post.categories.includes(activeCategory);
      
      return matchQuery && matchCategory;
    });
  }, [searchQuery, activeCategory, blogs]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-white border-b border-gray-100 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-40 -mr-20 -mt-20"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-16">
            
            {/* Left: Text Content */}
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#A62B2B] text-xs font-bold uppercase tracking-widest mb-4 border border-red-100"
              >
                <HeartPulse className="w-3.5 h-3.5" /> Medical Knowledge Hub
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
              >
                Insights for a <span className="text-[#A62B2B]">Healthier Heart.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl"
              >
                Explore expert articles on preventive cardiology, treatments, and lifestyle tips curated by Alavi Hospitals.
              </motion.p>
            </div>

            {/* Right: Search Box */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full md:max-w-md"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#A62B2B] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A62B2B]/20 focus:border-[#A62B2B] shadow-sm transition-all"
                />
              </div>
            </motion.div>
          </div>

          {/* Category Filter Pills (New Addition) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mr-2">
              <Filter className="w-4 h-4" /> Filters:
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
                  ${activeCategory === cat 
                    ? "bg-[#A62B2B] text-white border-[#A62B2B] shadow-md" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                `}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BLOG GRID --- */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-[#A62B2B] mb-3" />
            <p className="text-gray-400 text-sm font-medium">Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No articles found</h3>
            <p className="text-gray-500 text-sm">We couldn't find any matches for "{searchQuery}".</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-4 text-[#A62B2B] font-bold text-sm hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((post, i) => {
                
                // Process Data
                const category = post.categories?.[0] || "Medical";
                const dateStr = new Date(post.timeline).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                });
                const rawDesc = post.extraFields?.[0]?.description || "";
                const excerpt = getExcerpt(rawDesc);
                const readTime = calculateReadTime(rawDesc);

                return (
                  <motion.article
                    layout
                    key={post.blogId}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <Link href={`/blog/${post.url}`} className="relative h-56 bg-gray-100 overflow-hidden block">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#A62B2B] text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-white/20">
                          {category}
                        </span>
                      </div>
                      <img 
                        src={post.blogImage || "https://placehold.co/600x400?text=Medical+Blog"} 
                        alt={post.blogTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex flex-col flex-grow p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{dateStr}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#A62B2B] transition-colors">
                        <Link href={`/blog/${post.url}`}>
                          {post.blogTitle}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                        {excerpt}
                      </p>

                      {/* Footer */}
                      <div className="pt-5 border-t border-gray-50 flex items-center justify-between mt-auto">
                        <Link 
                          href={`/blog/${post.url}`}
                          className="inline-flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wide hover:text-[#A62B2B] transition-colors group/link"
                        >
                          Read Article 
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}