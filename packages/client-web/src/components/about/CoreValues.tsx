"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HeartHandshake,
  Award,
  ShieldCheck,
  UserCheck,
  Users
} from "lucide-react";

interface ValueItem {
  title: string;
  icon: React.ElementType;
}

const valuesList: ValueItem[] = [
  {
    title: "Compassion",
    icon: HeartHandshake,
  },
  {
    title: "Excellence",
    icon: Award,
  },
  {
    title: "Integrity",
    icon: ShieldCheck,
  },
  {
    title: "Patient-First Care",
    icon: UserCheck,
  },
  {
    title: "Community Commitment",
    icon: Users,
  },
];

const CoreValues: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white px-4 sm:px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5B328C] text-center mb-8 sm:mb-12"
        >
          Our Core Values
        </motion.h2>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {valuesList.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-[#663399] rounded-[18px] sm:rounded-[20px] p-6 sm:p-8 flex flex-col items-center justify-center text-center text-white min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="mb-4 text-white/90">
                  <IconComp className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.5]" />
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-snug">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CoreValues;