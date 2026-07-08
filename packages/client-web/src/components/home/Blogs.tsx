"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { API_URL } from "../../config"; // Adjust your path if needed

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(`${API_URL}/api/blogs/getAllBlogs`);
        const data = await res.json();
        
        // Backend returns either data.Items or just the array
        const allBlogs = data.Items || data || [];
        
        // Filter enabled, Sort Newest to Oldest (using timeline or createdAt), Take top 3
        const sorted = allBlogs
          .filter((b: any) => b.enabled)
          .sort((a: any, b: any) => {
             const dateA = a.timeline || a.createdAt;
             const dateB = b.timeline || b.createdAt;
             return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
          .slice(0, 3);
          
        setBlogs(sorted);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // --- HELPER: Strip HTML & Decode Entities ---
  const getExcerpt = (blog: any) => {
    // Prefer metaDescription for the snippet, fallback to the first paragraph
    const rawDesc = blog.metaDescription || blog.extraFields?.[0]?.description || "";
    
    // 1. Strip all HTML tags like <p>, <strong>, etc.
    let text = rawDesc.replace(/<[^>]+>/g, ' ');
    
    // 2. Decode common HTML entities (Fixes the &nbsp; issue)
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
      
    // 3. Remove extra double spaces caused by tag stripping
    text = text.replace(/\s+/g, ' ').trim();
    
    // 4. Truncate to 120 characters cleanly
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  if (loading) {
    return (
      <section className="py-20 flex justify-center bg-[#FAFAFA]">
        <Loader2 className="w-10 h-10 animate-spin text-[#5B328C]" />
      </section>
    );
  }

  // If no blogs exist, hide the section entirely
  if (blogs.length === 0) return null;

  return (
    <section className="py-4 bg-[#FAFAFA] px-4 lg:px-12 font-[Poppins]">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-[#663399] font-semibold tracking-normal mb-4">
            Blogs
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="justify-center max-w-3xl mx-auto text-[#0C0200] text-xl font-medium leading-relaxed"
          >
            Discover expert-led articles on health conditions, treatments and wellness to help you make confident decisions.
          </motion.p>
        </motion.div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {blogs.map((item, index) => (
            <motion.div
              key={item.blogId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="flex flex-col group cursor-pointer"
            >
              <Link href={`/blog/${item.url || '/' + item.blogId}`} className="block w-full h-full outline-none">
                
                {/* Image Section (Background Layer) */}
                <div className="relative w-full h-[240px] rounded-[23px] overflow-hidden bg-[#E7D8F5]">
                  {item.blogImage && (
                    <Image
                      src={item.blogImage}
                      alt={item.blogTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  )}
                </div>

                {/* Content Box (Overlapping Foreground Layer) */}
                {/* w-[90%]  = 90% of the image width
                  ml-auto  = pushes the box to the right side
                  -mt-16   = pulls the box up to overlap the image
                */}
                <div className="relative z-10 bg-white rounded-[23px] p-6 lg:p-7 w-[90%] ml-auto shadow-[0px_3px_3.1px_rgba(102,51,153,0.38)] group-hover:shadow-[0px_8px_15px_rgba(102,51,153,0.30)] transition-shadow duration-300 min-h-[220px] flex flex-col justify-between -mt-8">
                  
                  <div>
                    <h3 className="text-[#663399] text-[16px] lg:text-[17px] font-bold leading-[1.4] mb-3 line-clamp-2">
                      {item.blogTitle}
                    </h3>
                    <p className="text-[#0C0200] text-[13px] font-medium leading-relaxed">
                      {getExcerpt(item)}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <span className="text-[#5B328C] text-[14px] font-bold tracking-wide group-hover:underline decoration-2 underline-offset-4 mt-4 inline-block">
                    Read More
                  </span>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/blog">
            <button className="cursor-pointer bg-[#5B328C] text-white px-10 py-3.5 rounded-full text-[16px] font-semibold hover:bg-[#4a2873] hover:shadow-lg transition-all duration-300 active:scale-95">
              Show More
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Blogs;