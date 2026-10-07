"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
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

const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    // Parse prefix, number, and suffix (e.g. "200K+")
    const match = value.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);

    if (!match) {
        return <span>{value}</span>;
    }

    const prefix = match[1] || "";
    const targetValue = parseFloat(match[2].replace(/,/g, ""));
    const suffix = match[3] || "";

    const [currentCount, setCurrentCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const duration = 2000; // 2 seconds animation

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing curve (easeOutCubic) for smooth slowdown towards the end
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(easeOut * targetValue);

            setCurrentCount(val);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCurrentCount(targetValue);
            }
        };

        requestAnimationFrame(step);
    }, [isInView, targetValue]);

    return (
        <span ref={ref}>
            {prefix}
            {currentCount.toLocaleString()}
            {suffix}
        </span>
    );
};

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

                                    {/* Value with Count Animation */}
                                    <div className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white leading-tight mb-0.5 tracking-tight">
                                        <AnimatedCounter value={item.value} />
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
