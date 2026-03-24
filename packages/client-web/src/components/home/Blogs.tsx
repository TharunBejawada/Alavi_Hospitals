"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const blogs = [
  {
    title: "Recovering from a Fracture: Do's and Don'ts for a Speedy Healing Process",
    excerpt: "When a bone breaks, the body immediately begins repairing the damage. The healing process usually occurs in three stages.",
    image: "/blog-1.jpg", // Replace with actual image path
    link: "/blog/recovering-from-fracture",
  },
  {
    title: "Understanding Hypertension: Causes, Symptoms & Management",
    excerpt: "Hypertension occurs when blood pressure remains consistently high, increasing the risk of heart disease and stroke.",
    image: "/blog-2.jpg",
    link: "/blog/understanding-hypertension",
  },
  {
    title: "Screen Time and Kids: How Much is Too Much?",
    excerpt: "Excessive screen time can impact children's physical and mental health. Setting healthy limits and encouraging balanced activities.",
    image: "/blog-3.jpg",
    link: "/blog/screen-time-and-kids",
  },
];

const Blogs = () => {
  return (
    <section className="py-20 bg-[#FAFAFA] px-4 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            Blogs
          </h2>
        </motion.div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {blogs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="flex flex-col group cursor-pointer"
            >
              <Link href={item.link} className="block w-full h-full outline-none">
                
                {/* Image Section (Background Layer) */}
                <div className="relative w-full h-[240px] rounded-[20px] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Content Box (Overlapping Foreground Layer) */}
                {/* The -mt-16 pulls this white box up over the image */}
                <div className="relative z-10 bg-white rounded-[20px] p-6 lg:p-8 mx-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] -mt-16 group-hover:shadow-[0_15px_40px_rgb(91,50,140,0.15)] transition-shadow duration-300 min-h-[220px] flex flex-col justify-between">
                  
                  <div>
                    <h3 className="text-[#5B328C] text-[16px] lg:text-[17px] font-bold leading-[1.4] mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-900 text-[13px] font-medium leading-relaxed mb-6">
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <span className="text-[#5B328C] text-[14px] font-bold uppercase tracking-wide group-hover:underline decoration-2 underline-offset-4">
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
          className="mt-16 text-center"
        >
          <Link href="/blogs">
            <button className="bg-[#5B328C] text-white px-10 py-3.5 rounded-full text-[16px] font-semibold hover:bg-[#4a2873] hover:shadow-lg transition-all duration-300 active:scale-95">
              Show More
            </button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Blogs;