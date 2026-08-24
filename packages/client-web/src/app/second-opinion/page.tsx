"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { API_URL } from "../../config";
import type { SecondOpinionTopic } from "../../../../core/src/types";

export default function SecondOpinionHubPage() {
  const [topics, setTopics] = useState<SecondOpinionTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch(`${API_URL}/api/second-opinions/getAllEnabled`);
        const data = await res.json();
        setTopics(data.Items || []);
      } catch (error) {
        console.error("Failed to fetch Second Opinion topics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-['Poppins']">

      {/* --- HERO --- */}
      <section
        className="relative w-full overflow-hidden flex min-h-[260px] md:min-h-[300px] items-center"
        style={{ background: "linear-gradient(90deg, #663399 48.69%, #0066A9 111.15%)" }}
      >
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-12 relative z-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight max-w-2xl"
          >
            Request a Second Medical Opinion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/90 text-lg mt-4 max-w-xl"
          >
            Already been advised surgery or a major treatment? Get an independent, expert opinion before you decide.
          </motion.p>
        </div>
      </section>

      {/* --- TOPICS GRID --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mt-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <Loader2 className="w-10 h-10 animate-spin text-[#5B328C] mb-3" />
            <p className="text-[#5B328C] font-semibold animate-pulse">Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No topics available yet</h3>
            <p className="text-gray-500 text-sm">Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {topics.map((topic, i) => (
                <motion.article
                  layout
                  key={topic.secondOpinionId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={`/second-opinion/${topic.seoConfig?.url}`}
                    className="group flex flex-col h-full bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative w-full h-[200px] bg-[#C4AED9] overflow-hidden shrink-0">
                      {topic.heroImage && (
                        <Image
                          src={topic.heroImage}
                          alt={topic.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1 bg-white">
                      <h3 className="text-gray-900 font-bold text-xl mb-3 leading-snug group-hover:text-[#5B328C] transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {topic.heroHeading}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[#5B328C] font-semibold text-sm">
                        Get a Second Opinion <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
