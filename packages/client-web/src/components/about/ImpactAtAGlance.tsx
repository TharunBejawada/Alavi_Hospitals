"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Building2,
    BedDouble,
    Users,
    Stethoscope,
    Syringe
} from "lucide-react";

interface StatItem {
    icon: React.ElementType;
    value: string;
    label: string;
    sublabel?: string;
}

const stats: StatItem[] = [
    {
        icon: Building2,
        value: "2",
        label: "Locations",
        sublabel: "IDPL & Chintal",
    },
    {
        icon: BedDouble,
        value: "80",
        label: "Beds",
    },
    {
        icon: Users,
        value: "200K+",
        label: "Happy Patients",
    },
    {
        icon: Stethoscope,
        value: "25+",
        label: "Experienced Doctors",
    },
    {
        icon: Syringe,
        value: "6K+",
        label: "Surgeries & Major Procedures",
    },
];

const ImpactAtAGlance: React.FC = () => {
    return (
        <section className="w-full bg-white py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1440px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full bg-[#663399] rounded-[18px] sm:rounded-[24px] px-3 sm:px-6 lg:px-8 py-4 sm:py-5 shadow-md text-white"
                >
                    {/* Section Heading */}
                    <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                        Our Impact at a Glance
                    </h2>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-white/20">
                        {stats.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="flex flex-col items-center justify-center text-center px-2 lg:px-3 py-1"
                                >
                                    {/* Icon */}
                                    <div className="mb-1.5 text-white/90">
                                        <IconComponent className="w-7 h-7 sm:w-9 sm:h-9 stroke-[1.5]" />
                                    </div>

                                    {/* Value */}
                                    <div className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white leading-tight mb-0.5 tracking-tight">
                                        {item.value}
                                    </div>

                                    {/* Label */}
                                    <div className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
                                        {item.label}
                                    </div>

                                    {/* Sublabel */}
                                    {item.sublabel && (
                                        <div className="text-[11px] sm:text-xs text-white/80 font-normal mt-0.5">
                                            {item.sublabel}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ImpactAtAGlance;
