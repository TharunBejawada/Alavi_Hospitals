"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Phone,
  CalendarCheck,
  Link as LinkIcon
} from "lucide-react";
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

  // --- SCROLL PROGRESS ---
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- HELPER: Read Time ---
  const calculateReadTime = (fields: ExtraField[]) => {
    if (!fields) return "3 min read";
    const text = fields.map(f => f.description).join(" ");
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s/g).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return `${minutes} min read`;
  };

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchBlog() {
      try {
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
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-100 border-t-[#A62B2B] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) return null;

  const dateStr = new Date(blog.timeline).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const readTime = calculateReadTime(blog.extraFields);

  return (
    // FIX 1: Strict containment on the article wrapper
    <article className="w-full max-w-[100vw] overflow-x-hidden bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-[#A62B2B] origin-left z-50"
        style={{ scaleX }}
      />

      {/* --- 1. HERO IMAGE --- */}
      {/* FIX: Removed scale animation, changed to simple fade-in to prevent zoomed effect */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden bg-gray-900">
        <motion.img 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          src={blog.blogImage || "https://placehold.co/1200x600?text=Medical+Article"} 
          alt={blog.blogTitle}
          // object-cover is necessary to fill the space, but without the scale animation it won't feel excessively zoomed.
          className="w-full h-full object-cover opacity-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      {/* FIX 2: Removed negative margin on mobile (mt-0) to stop layout breaking. Only applies on desktop (-mt-24). */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:-mt-24 relative z-10 box-border">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* --- LEFT COLUMN: Content --- */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 w-full min-w-0">
            
            {/* 2. TITLE CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-5 md:p-10 border-t-4 border-[#A62B2B] w-full"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((cat, i) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-[#A62B2B] rounded-full text-xs font-bold uppercase tracking-wide">
                    {cat}
                  </span>
                ))}
              </div>

              <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6 break-words hyphens-auto">
                {blog.blogTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#A62B2B]" /> {dateStr}
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#A62B2B]" /> {readTime}
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#A62B2B]" /> {blog.author || "Alavi Hospitals"}
                </div>
              </div>
            </motion.div>

            {/* 4. DYNAMIC CONTENT BLOCKS */}
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
                    className="bg-white rounded-xl shadow-sm p-5 md:p-10 w-full overflow-hidden"
                  >
                    {field.heading && (
                      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#A62B2B] pl-4 break-words">
                        {field.heading}
                      </h2>
                    )}
                    
                    {/* FIX 3: Strict prose containment for images/videos */}
                    <div 
                      className="prose prose-lg prose-red max-w-none w-full
                        text-gray-600 leading-relaxed break-words
                        prose-headings:text-gray-900 prose-headings:font-bold
                        prose-p:mb-6 
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

            {/* Related Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 w-full">
                <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Related Topics</p>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, i) => (
                    <Link href={`/blogs?tag=${tag.name}`} key={i} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-[#A62B2B] hover:text-white transition duration-300">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Sidebar (Stack on Mobile) --- */}
          <div className="lg:col-span-1 w-full">
            <div className="sticky top-8 space-y-6">
              
              {/* SHARE */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center w-full"
              >
                <span className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share Article
                </span>
                <div className="flex gap-3 justify-center w-full flex-wrap">
                   <button className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                     <Facebook className="w-5 h-5"/>
                   </button>
                   <button className="p-3 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all">
                     <Twitter className="w-5 h-5"/>
                   </button>
                   <button className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                     <Linkedin className="w-5 h-5"/>
                   </button>
                   <button className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-all">
                     <LinkIcon className="w-5 h-5"/>
                   </button>
                </div>
              </motion.div>

              {/* APPOINTMENT CARD */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1e293b] rounded-xl p-8 text-white shadow-xl relative overflow-hidden w-full"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#A62B2B] rounded-full blur-3xl opacity-30"></div>
                
                <h3 className="font-serif text-2xl font-bold mb-3 relative z-10">Need Expert Advice?</h3>
                <p className="text-gray-300 text-sm mb-8 relative z-10 leading-relaxed">
                  Schedule a consultation.
                </p>
                
                <Link 
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#A62B2B] text-white font-bold rounded-lg hover:bg-[#8E2424] transition shadow-lg relative z-10"
                >
                  <CalendarCheck className="w-5 h-5" /> 
                  Book Appointment
                </Link>

                <div className="mt-6 pt-6 border-t border-gray-700/50 relative z-10">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">For Emergencies</p>
                  <a href="tel:+919160606108" className="flex items-center gap-2 font-bold text-lg hover:text-[#A62B2B] transition">
                    <Phone className="w-5 h-5" /> +91 91606 06108
                  </a>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </article>
  );
}