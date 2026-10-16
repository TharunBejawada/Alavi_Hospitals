"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    FileText,
    Layers,
    Sliders,
    Code,
    Eye,
    Search,
    Plus,
    ArrowUp,
    ArrowDown,
    Trash2,
    ExternalLink,
    Save,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Info,
    Sparkles,
    Copy,
    Check,
    Download,
    Bot,
    Globe,
    HelpCircle,
    ArrowLeft,
    Pencil,
    X,
    Link2,
    Home,
    Stethoscope,
    Activity,
    Syringe,
    Package,
    MessageSquare,
    BookOpen,
    Phone,
    Shield
} from "lucide-react";
import { API_URL } from "../../config";
import type { LlmsConfig, LlmsCustomSection, LlmsCustomSectionItem } from "@alavi-hospitals-app/core";

const DEFAULT_SECTIONS: LlmsCustomSection[] = [
    {
        id: "sec-1",
        title: "Core Hospital Resources & Patient Services",
        description: "Official online portals, contact channels, and medical departments at Alavi Hospitals.",
        items: [
            {
                title: "Alavi Hospitals Official Homepage",
                url: "https://alavihospitals.in/",
                description: "Leading multi-speciality tertiary healthcare hospital in Hyderabad, India"
            },
            {
                title: "About Alavi Hospitals",
                url: "https://alavihospitals.in/about",
                description: "Leadership, clinical excellence, modern infrastructure, and patient-first healthcare"
            },
            {
                title: "Consultant Specialists & Doctors Directory",
                url: "https://alavihospitals.in/doctors",
                description: "Directory of senior surgeons, physicians, and medical consultants"
            },
            {
                title: "Centres of Excellence & Specialities",
                url: "https://alavihospitals.in/specialities",
                description: "Specialized clinical departments including Cardiology, Neurosciences, and Orthopaedics"
            },
            {
                title: "Treatments & Surgical Procedures",
                url: "https://alavihospitals.in/treatments",
                description: "Comprehensive medical treatments, minimally invasive and robotic surgeries"
            },
            {
                title: "Preventive Health Checkup Packages",
                url: "https://alavihospitals.in/health-packages",
                description: "Comprehensive master health screenings and specialized wellness packages"
            },
            {
                title: "Medical Second Opinion Services",
                url: "https://alavihospitals.in/second-opinion",
                description: "Confidential surgical second opinions and expert clinical case reviews"
            },
            {
                title: "Cashless Insurance & TPA Network",
                url: "https://alavihospitals.in/insurance",
                description: "Empanelled government schemes, private insurance companies, and TPA partners"
            },
            {
                title: "Vaccination & Immunisation Centre",
                url: "https://alavihospitals.in/vaccinations",
                description: "Adult and paediatric vaccination schedules and immunisation services"
            },
            {
                title: "Health Articles & Patient Education Blog",
                url: "https://alavihospitals.in/blog",
                description: "Doctor-written medical guides, wellness insights, and disease prevention articles"
            },
            {
                title: "Contact, Appointments & Emergency",
                url: "https://alavihospitals.in/contact",
                description: "24/7 emergency hotline, consultation bookings, and hospital address"
            }
        ]
    },
    {
        id: "sec-2",
        title: "Key Medical Specialities",
        description: "Specialised clinical departments offering advanced diagnosis, medical management, and surgical intervention.",
        items: [
            {
                title: "Cardiology & Cardiovascular Sciences",
                url: "https://alavihospitals.in/specialities/cardiology",
                description: "Interventional cardiology, cardiac surgery, angiography, and intensive coronary care"
            },
            {
                title: "Neurosciences & Neurology",
                url: "https://alavihospitals.in/specialities/neuro-sciences",
                description: "Advanced brain and spine surgery, stroke management, and neurology care"
            },
            {
                title: "Orthopaedics & Joint Replacement",
                url: "https://alavihospitals.in/specialities/orthopaedics",
                description: "Knee replacement, hip replacement, trauma care, and arthroscopic procedures"
            },
            {
                title: "Gastroenterology & Hepatology",
                url: "https://alavihospitals.in/specialities/gastroenterology",
                description: "Medical & surgical gastroenterology, endoscopy, and liver disease management"
            },
            {
                title: "Nephrology & Renal Sciences",
                url: "https://alavihospitals.in/specialities/nephrology",
                description: "Kidney disease treatment, dialysis centre, and hypertension management"
            },
            {
                title: "Urology & Andrology",
                url: "https://alavihospitals.in/specialities/urology",
                description: "Kidney stone removal, prostate treatment, and reconstructive urology"
            },
            {
                title: "Oncology & Cancer Care",
                url: "https://alavihospitals.in/specialities/oncology",
                description: "Surgical oncology, medical oncology, chemotherapy, and tumor screening"
            },
            {
                title: "Pulmonology & Respiratory Medicine",
                url: "https://alavihospitals.in/specialities/pulmonology",
                description: "Asthma, COPD, sleep disorders, and advanced pulmonary intervention"
            }
        ]
    },
    {
        id: "sec-3",
        title: "Patient Care Guidelines & Information",
        description: "Essential information for patients and visitors regarding admission, facilities, and visitor protocols.",
        items: [
            {
                title: "Admission & Discharge Guidelines",
                url: "https://alavihospitals.in/admission-guidelines",
                description: "Standard operating procedures for planned and emergency admissions"
            },
            {
                title: "Patient & Visitor Guidelines",
                url: "https://alavihospitals.in/patient-visitor-guidelines",
                description: "Visiting hours, ICU protocols, hospital safety regulations, and patient support"
            },
            {
                title: "Patient Care & Services Overview",
                url: "https://alavihospitals.in/patients",
                description: "Comprehensive inpatient and outpatient facilities, diagnostic labs, and pharmacy"
            }
        ]
    }
];

const SUGGESTED_LINKS = [
    {
        label: "Homepage",
        icon: Home,
        title: "Alavi Hospitals Official Homepage",
        url: "https://alavihospitals.in/",
        description: "Leading multi-speciality tertiary healthcare hospital in Hyderabad, India"
    },
    {
        label: "About Us",
        icon: Info,
        title: "About Alavi Hospitals",
        url: "https://alavihospitals.in/about",
        description: "Leadership, clinical excellence, modern infrastructure, and patient-first healthcare"
    },
    {
        label: "Doctors",
        icon: Stethoscope,
        title: "Consultant Specialists & Doctors Directory",
        url: "https://alavihospitals.in/doctors",
        description: "Directory of senior surgeons, physicians, and medical consultants"
    },
    {
        label: "Specialities",
        icon: Activity,
        title: "Centres of Excellence & Specialities",
        url: "https://alavihospitals.in/specialities",
        description: "Specialized clinical departments including Cardiology, Neurosciences, and Orthopaedics"
    },
    {
        label: "Treatments",
        icon: Syringe,
        title: "Treatments & Surgical Procedures",
        url: "https://alavihospitals.in/treatments",
        description: "Comprehensive medical treatments, minimally invasive and robotic surgeries"
    },
    {
        label: "Health Packages",
        icon: Package,
        title: "Preventive Health Checkup Packages",
        url: "https://alavihospitals.in/health-packages",
        description: "Comprehensive master health screenings and specialized wellness packages"
    },
    {
        label: "Second Opinion",
        icon: MessageSquare,
        title: "Medical Second Opinion Services",
        url: "https://alavihospitals.in/second-opinion",
        description: "Confidential surgical second opinions and expert clinical case reviews"
    },
    {
        label: "Blog",
        icon: BookOpen,
        title: "Health Articles & Patient Education Blog",
        url: "https://alavihospitals.in/blog",
        description: "Doctor-written medical guides, wellness insights, and disease prevention articles"
    },
    {
        label: "Contact",
        icon: Phone,
        title: "Contact, Appointments & Emergency",
        url: "https://alavihospitals.in/contact",
        description: "24/7 emergency hotline, consultation bookings, and hospital address"
    }
];

export default function LlmsTxtAdmin() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"builder" | "settings" | "raw" | "preview">("builder");
    const [previewType, setPreviewType] = useState<"llms.txt" | "llms-full.txt">("llms.txt");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [copied, setCopied] = useState(false);

    // Link Modal State for Add & Edit Popup
    const [linkModal, setLinkModal] = useState<{
        isOpen: boolean;
        mode: "add" | "edit";
        secIndex: number;
        itemIndex?: number;
        title: string;
        url: string;
        description: string;
    } | null>(null);

    // Keyboard shortcut (Escape to close modal)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && linkModal?.isOpen) {
                setLinkModal(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [linkModal?.isOpen]);

    // Main Configuration State
    const [config, setConfig] = useState<LlmsConfig>({
        id: "1",
        title: "Alavi Hospitals",
        summary:
            "Alavi Hospitals is a premier multi-speciality tertiary healthcare hospital in Hyderabad, India, offering advanced medical care across cardiology, neurosciences, orthopaedics, oncology, gastroenterology, nephrology, urology, and 24/7 critical care.",
        homepage: "https://alavihospitals.in",
        enabled: true,
        systemNotes:
            "Alavi Hospitals is a premier multi-speciality medical group in Hyderabad, Telangana, India. All content provided here represents official clinical services, doctors, medical departments, and treatments.",
        dynamicSections: {
            includeDoctors: true,
            includeBlogs: true,
            includeSpecialities: true,
            includeTreatments: true,
            includeHealthPackages: true,
            includeSecondOpinion: true,
        },
        customSections: DEFAULT_SECTIONS,
        useRawOverride: false,
        rawMarkdownOverride: "",
        fullTxtContent: "",
    });

    // Show Toast Helper
    const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    // Fetch Config from API
    const fetchConfig = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/llms-config`);
            if (!res.ok) {
                throw new Error("Failed to fetch LLMs configuration");
            }
            const data = await res.json();
            if (data && data.title) {
                setConfig((prev) => ({
                    ...prev,
                    ...data,
                    dynamicSections: {
                        ...prev.dynamicSections,
                        ...(data.dynamicSections || {}),
                    },
                    customSections:
                        Array.isArray(data.customSections) && data.customSections.length > 0
                            ? data.customSections
                            : prev.customSections,
                }));
            }
        } catch (err: any) {
            console.warn("Using default LLMs config:", err?.message || err);
            showToast("Loaded standard Alavi Hospitals LLMs configuration", "info");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    // Save Config to API
    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/llms-config`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) {
                throw new Error("Failed to save LLMs configuration");
            }
            showToast("LLMs.txt configuration saved successfully!", "success");
        } catch (err: any) {
            console.error(err);
            showToast(err?.message || "Failed to save configuration", "error");
        } finally {
            setSaving(false);
        }
    };

    // Live Markdown Compiler for Preview
    const compiledMarkdown = useMemo(() => {
        if (config.useRawOverride && config.rawMarkdownOverride?.trim()) {
            return config.rawMarkdownOverride.trim();
        }

        const lines: string[] = [];
        lines.push(`# ${config.title || "Alavi Hospitals"}`);
        lines.push("");

        if (config.summary) {
            lines.push(`> ${config.summary.trim()}`);
            lines.push("");
        }

        if (config.homepage) {
            lines.push(`- Homepage: ${config.homepage.trim()}`);
            lines.push("");
        }

        if (config.systemNotes) {
            lines.push(`> Note for AI & Large Language Models: ${config.systemNotes.trim()}`);
            lines.push("");
        }

        if (Array.isArray(config.customSections)) {
            config.customSections.forEach((sec) => {
                if (!sec.title) return;
                const secTitle = sec.title.startsWith("#") ? sec.title : `## ${sec.title}`;
                lines.push(secTitle);
                if (sec.description && sec.description.trim()) {
                    lines.push(`> ${sec.description.trim()}`);
                }
                lines.push("");

                if (Array.isArray(sec.items)) {
                    sec.items.forEach((item) => {
                        if (!item.title || !item.url) return;
                        let line = `- [${item.title.trim()}](${item.url.trim()})`;
                        if (item.description && item.description.trim()) {
                            line += `\t[${item.description.trim()}]`;
                        }
                        lines.push(line);
                    });
                }
                lines.push("");
            });
        }

        if (config.dynamicSections?.includeDoctors) {
            lines.push("## Our Medical Specialists & Doctors");
            lines.push("> [Auto-Generated: Live Active Consultants & Specialists from Database]");
            lines.push("");
        }

        if (config.dynamicSections?.includeBlogs) {
            lines.push("## Health Articles & Medical Insights");
            lines.push("> [Auto-Generated: Live Health Articles & Insights from Database]");
            lines.push("> Medical Disclaimer: The information provided in this blog is for general health awareness and educational purposes only. It should not be considered a substitute for professional medical advice, diagnosis or treatment. The content may not apply to every individual's health condition. Always consult a qualified healthcare professional for any medical concerns or treatment decisions. Do not ignore or delay medical advice based on the information shared in this blog.");
            lines.push("");
        }

        if (config.dynamicSections?.includeSpecialities) {
            lines.push("## Speciality Centres of Excellence");
            lines.push("> [Auto-Generated: Live Specialities & Department Pages from Database]");
            lines.push("");
        }

        if (config.dynamicSections?.includeTreatments) {
            lines.push("## Medical Treatments & Surgical Procedures");
            lines.push("> [Auto-Generated: Live Medical Treatments from Database]");
            lines.push("");
        }

        if (config.dynamicSections?.includeHealthPackages) {
            lines.push("## Preventive Health Checkup Packages");
            lines.push("> [Auto-Generated: Live Health Packages from Database]");
            lines.push("");
        }

        if (config.dynamicSections?.includeSecondOpinion) {
            lines.push("## Second Opinion Surgical Services");
            lines.push("> [Auto-Generated: Live Second Opinion Topics from Database]");
            lines.push("");
        }

        return lines.join("\n").trim();
    }, [config]);

    const compiledFullMarkdown = useMemo(() => {
        if (config.fullTxtContent && config.fullTxtContent.trim()) {
            return config.fullTxtContent.trim();
        }
        return `${compiledMarkdown}\n\n==================================================\nFULL COMPREHENSIVE RESOURCE DIRECTORY FOR LLM CONTEXT\n==================================================\n\n### Detailed Doctors Directory & Speciality Index\n[Full verified clinical dataset, doctors qualifications, blog articles, and treatment protocols auto-attached when requested by LLMs]`;
    }, [compiledMarkdown, config.fullTxtContent]);

    // Section Management Helpers
    const addSection = () => {
        const newSec: LlmsCustomSection = {
            id: `sec-${Date.now()}`,
            title: "New Section Title",
            description: "",
            items: [
                {
                    title: "Page Link Title",
                    url: "https://alavihospitals.in/",
                    description: "",
                },
            ],
        };
        setConfig((prev) => ({
            ...prev,
            customSections: [...prev.customSections, newSec],
        }));
        showToast("Added new section", "info");
    };

    const updateSection = (secIndex: number, field: keyof LlmsCustomSection, value: any) => {
        setConfig((prev) => {
            const updatedSecs = [...prev.customSections];
            updatedSecs[secIndex] = {
                ...updatedSecs[secIndex],
                [field]: value,
            };
            return { ...prev, customSections: updatedSecs };
        });
    };

    const deleteSection = (secIndex: number) => {
        setConfig((prev) => ({
            ...prev,
            customSections: prev.customSections.filter((_, idx) => idx !== secIndex),
        }));
        showToast("Section removed", "info");
    };

    const moveSection = (secIndex: number, direction: number) => {
        const targetIdx = secIndex + direction;
        if (targetIdx < 0 || targetIdx >= config.customSections.length) return;
        setConfig((prev) => {
            const updated = [...prev.customSections];
            const temp = updated[secIndex];
            updated[secIndex] = updated[targetIdx];
            updated[targetIdx] = temp;
            return { ...prev, customSections: updated };
        });
    };

    // Link Items Helpers (Modal Popup)
    const openAddLinkModal = (secIndex: number) => {
        setLinkModal({
            isOpen: true,
            mode: "add",
            secIndex,
            title: "",
            url: "https://alavihospitals.in/",
            description: "",
        });
    };

    const openEditLinkModal = (secIndex: number, itemIndex: number) => {
        const item = config.customSections[secIndex]?.items?.[itemIndex];
        if (!item) return;
        setLinkModal({
            isOpen: true,
            mode: "edit",
            secIndex,
            itemIndex,
            title: item.title,
            url: item.url,
            description: item.description || "",
        });
    };

    const closeLinkModal = () => {
        setLinkModal(null);
    };

    const handleSaveLinkFromModal = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!linkModal) return;

        const { mode, secIndex, itemIndex, title, url, description } = linkModal;

        if (!title.trim()) {
            showToast("Please enter a link title", "error");
            return;
        }

        if (!url.trim()) {
            showToast("Please enter a valid URL", "error");
            return;
        }

        setConfig((prev) => {
            const updatedSecs = [...prev.customSections];
            const currentItems = [...(updatedSecs[secIndex].items || [])];

            const newItem: LlmsCustomSectionItem = {
                title: title.trim(),
                url: url.trim(),
                description: description.trim(),
            };

            if (mode === "add") {
                currentItems.push(newItem);
            } else if (mode === "edit" && typeof itemIndex === "number") {
                currentItems[itemIndex] = newItem;
            }

            updatedSecs[secIndex] = {
                ...updatedSecs[secIndex],
                items: currentItems,
            };

            return { ...prev, customSections: updatedSecs };
        });

        showToast(
            mode === "add" ? "Link added to section!" : "Link updated successfully!",
            "success"
        );
        closeLinkModal();
    };

    const updateItem = (
        secIndex: number,
        itemIndex: number,
        field: keyof LlmsCustomSectionItem,
        value: string
    ) => {
        setConfig((prev) => {
            const updatedSecs = [...prev.customSections];
            const updatedItems = [...(updatedSecs[secIndex].items || [])];
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                [field]: value,
            };
            updatedSecs[secIndex] = {
                ...updatedSecs[secIndex],
                items: updatedItems,
            };
            return { ...prev, customSections: updatedSecs };
        });
    };

    const deleteItem = (secIndex: number, itemIndex: number) => {
        setConfig((prev) => {
            const updatedSecs = [...prev.customSections];
            const updatedItems = (updatedSecs[secIndex].items || []).filter(
                (_, idx) => idx !== itemIndex
            );
            updatedSecs[secIndex] = {
                ...updatedSecs[secIndex],
                items: updatedItems,
            };
            return { ...prev, customSections: updatedSecs };
        });
    };

    const moveItem = (secIndex: number, itemIndex: number, direction: number) => {
        const items = config.customSections[secIndex].items || [];
        const targetIdx = itemIndex + direction;
        if (targetIdx < 0 || targetIdx >= items.length) return;

        setConfig((prev) => {
            const updatedSecs = [...prev.customSections];
            const updatedItems = [...items];
            const temp = updatedItems[itemIndex];
            updatedItems[itemIndex] = updatedItems[targetIdx];
            updatedItems[targetIdx] = temp;
            updatedSecs[secIndex] = {
                ...updatedSecs[secIndex],
                items: updatedItems,
            };
            return { ...prev, customSections: updatedSecs };
        });
    };

    // Copy to Clipboard
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        showToast("Copied content to clipboard!", "success");
        setTimeout(() => setCopied(false), 3000);
    };

    // Download File
    const handleDownload = (filename: string, content: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], { type: "text/plain;charset=utf-8" });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showToast(`Downloaded ${filename}`, "success");
    };

    // Filter sections by search query
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return config.customSections;
        const q = searchQuery.toLowerCase();
        return config.customSections
            .map((sec) => {
                const titleMatch = sec.title?.toLowerCase().includes(q);
                const descMatch = sec.description?.toLowerCase().includes(q);
                const matchingItems = (sec.items || []).filter(
                    (item) =>
                        item.title?.toLowerCase().includes(q) ||
                        item.url?.toLowerCase().includes(q) ||
                        item.description?.toLowerCase().includes(q)
                );
                if (titleMatch || descMatch || matchingItems.length > 0) {
                    return {
                        ...sec,
                        items: titleMatch || descMatch ? sec.items : matchingItems,
                    };
                }
                return null;
            })
            .filter(Boolean) as LlmsCustomSection[];
    }, [config.customSections, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans -m-8">
            {/* Light Blue Header matching admin design (#3B82F6) */}
            <header className="p-4 md:px-8 bg-[#3B82F6] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full shadow-md sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl shadow-inner text-white">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                                llms.txt & AI Context Manager
                            </h1>
                            <span
                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border transition ${config.enabled
                                    ? "bg-emerald-500 text-white border-emerald-400"
                                    : "bg-red-500 text-white border-red-400"
                                    }`}
                            >
                                {config.enabled ? "Live Active" : "Disabled"}
                            </span>
                        </div>
                        <p className="text-xs text-blue-100 mt-0.5">
                            Curate machine-readable hospital context for AI search engines (ChatGPT, Perplexity, Claude)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
                    <button
                        onClick={() => window.open(`${API_URL}/llms.txt`, "_blank")}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm border border-blue-400"
                        title="Open live /llms.txt endpoint in new tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live /llms.txt</span>
                    </button>

                    <button
                        onClick={handleSaveConfig}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition disabled:opacity-50"
                    >
                        {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        ) : (
                            <Save className="w-4 h-4 text-white" />
                        )}
                        <span>{saving ? "Saving..." : "Save Changes"}</span>
                    </button>
                </div>
            </header>

            {/* Notification Toast */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${toast.type === "success"
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : toast.type === "error"
                            ? "bg-red-600 text-white border-red-700"
                            : "bg-blue-600 text-white border-blue-700"
                        }`}
                >
                    {toast.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                    ) : toast.type === "error" ? (
                        <AlertCircle className="w-5 h-5 text-white" />
                    ) : (
                        <Info className="w-5 h-5 text-white" />
                    )}
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Main Content Container */}
            <div className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col gap-6">
                {/* Navigation Tabs Bar */}
                <div className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-3 gap-3">
                    <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-xl border border-gray-300 shadow-sm">
                        <button
                            onClick={() => setActiveTab("builder")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${activeTab === "builder"
                                ? "bg-[#3B82F6] text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span>Section Builder</span>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "builder"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {config.customSections.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${activeTab === "settings"
                                ? "bg-[#3B82F6] text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Sliders className="w-4 h-4" />
                            <span>Settings & Auto-Sync</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("raw")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${activeTab === "raw"
                                ? "bg-[#3B82F6] text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Code className="w-4 h-4" />
                            <span>Raw Markdown Editor</span>
                            {config.useRawOverride && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${activeTab === "preview"
                                ? "bg-[#3B82F6] text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Eye className="w-4 h-4" />
                            <span>Live Preview & Export</span>
                        </button>
                    </div>

                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-xs transition shadow-sm border border-slate-300"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#3B82F6]" />
                        <p className="text-sm font-semibold">Loading LLMs Configuration...</p>
                    </div>
                ) : (
                    <>
                        {/* TAB 1: SECTION BUILDER */}
                        {activeTab === "builder" && (
                            <div className="flex flex-col gap-6">
                                {/* Search & Actions Header */}
                                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                                    <div className="relative w-full md:w-96">
                                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search section titles, URLs, or notes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button
                                            onClick={addSection}
                                            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-sm transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add New Section</span>
                                        </button>
                                    </div>
                                </div>

                                {filteredSections.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-xl border border-gray-300 shadow-sm p-8">
                                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                        <p className="text-slate-800 font-bold text-base">No sections found</p>
                                        <p className="text-slate-500 text-xs mt-1">
                                            {searchQuery
                                                ? "No sections matched your search query. Try clearing the filter."
                                                : "Click 'Add New Section' to start structuring your llms.txt index."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {filteredSections.map((sec, secIdx) => {
                                            const realIndex = config.customSections.findIndex(
                                                (s) => s.id === sec.id || s === sec
                                            );
                                            const actualIdx = realIndex !== -1 ? realIndex : secIdx;

                                            return (
                                                <div
                                                    key={sec.id || actualIdx}
                                                    className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm transition hover:shadow-md"
                                                >
                                                    {/* Section Header Controls */}
                                                    <div className="bg-blue-50/70 px-5 py-3.5 border-b border-blue-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                                        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                                                            <span className="text-xs font-mono font-bold bg-[#3B82F6] text-white px-2.5 py-1 rounded-lg shrink-0">
                                                                Section #{actualIdx + 1}
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={sec.title || ""}
                                                                onChange={(e) =>
                                                                    updateSection(actualIdx, "title", e.target.value)
                                                                }
                                                                placeholder="Section Title (e.g. Core Hospital Services)"
                                                                className="w-full bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition shadow-sm"
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-1.5 self-end md:self-auto">
                                                            <button
                                                                onClick={() => moveSection(actualIdx, -1)}
                                                                disabled={actualIdx === 0}
                                                                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-gray-300 rounded-lg disabled:opacity-30 transition"
                                                                title="Move Section Up"
                                                            >
                                                                <ArrowUp className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => moveSection(actualIdx, 1)}
                                                                disabled={
                                                                    actualIdx === config.customSections.length - 1
                                                                }
                                                                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-gray-300 rounded-lg disabled:opacity-30 transition"
                                                                title="Move Section Down"
                                                            >
                                                                <ArrowDown className="w-3.5 h-3.5" />
                                                            </button>

                                                            <button
                                                                onClick={() => openAddLinkModal(actualIdx)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition hover:shadow cursor-pointer"
                                                                title="Add link via popup modal"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" />
                                                                <span>Add Link</span>
                                                            </button>

                                                            <button
                                                                onClick={() => deleteSection(actualIdx)}
                                                                className="p-1.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 rounded-lg transition"
                                                                title="Delete Section"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Section Description & Items */}
                                                    <div className="p-5 flex flex-col gap-4">
                                                        <input
                                                            type="text"
                                                            value={sec.description || ""}
                                                            onChange={(e) =>
                                                                updateSection(actualIdx, "description", e.target.value)
                                                            }
                                                            placeholder="Optional Section Description (e.g. Official medical departments and specialized clinical centres)"
                                                            className="w-full bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-slate-700 italic focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition"
                                                        />

                                                        {/* Bullet Link Items */}
                                                        <div className="flex flex-col gap-2.5">
                                                            {(!sec.items || sec.items.length === 0) ? (
                                                                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2">
                                                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                                        <Globe className="w-5 h-5" />
                                                                    </div>
                                                                    <p className="text-xs font-bold text-slate-700">No links in this section yet</p>
                                                                    <p className="text-[11px] text-slate-400 max-w-sm">
                                                                        Add official Alavi Hospital links, patient services, or clinical pages for AI engines to index.
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openAddLinkModal(actualIdx)}
                                                                        className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                        <span>Add First Link</span>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {sec.items.map((item, itemIdx) => (
                                                                        <div
                                                                            key={itemIdx}
                                                                            className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-start md:items-center justify-between hover:border-blue-300 hover:shadow-md transition group"
                                                                        >
                                                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                                                                                    <Link2 className="w-3.5 h-3.5" />
                                                                                </div>
                                                                                <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                                                                                            {item.title || "Untitled Link"}
                                                                                        </span>
                                                                                        <a
                                                                                            href={item.url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded font-mono truncate max-w-[260px] sm:max-w-[380px] transition"
                                                                                            title="Open link in new tab"
                                                                                        >
                                                                                            <span className="truncate">{item.url}</span>
                                                                                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                                                                        </a>
                                                                                    </div>

                                                                                    {item.description ? (
                                                                                        <p className="text-[11px] text-slate-600 line-clamp-2 flex items-center gap-1.5">
                                                                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded shrink-0">
                                                                                                AI Note
                                                                                            </span>
                                                                                            <span className="truncate">{item.description}</span>
                                                                                        </p>
                                                                                    ) : (
                                                                                        <span className="text-[11px] text-slate-400 italic">
                                                                                            No description note provided
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            {/* Item Actions */}
                                                                            <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => openEditLinkModal(actualIdx, itemIdx)}
                                                                                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-gray-200 hover:border-blue-200 rounded-lg transition"
                                                                                    title="Edit Link in Popup"
                                                                                >
                                                                                    <Pencil className="w-3 h-3" />
                                                                                    <span>Edit</span>
                                                                                </button>

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => moveItem(actualIdx, itemIdx, -1)}
                                                                                    disabled={itemIdx === 0}
                                                                                    className="p-1 bg-white hover:bg-slate-100 text-slate-600 border border-gray-200 rounded-lg disabled:opacity-30 transition"
                                                                                    title="Move Up"
                                                                                >
                                                                                    <ArrowUp className="w-3 h-3" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => moveItem(actualIdx, itemIdx, 1)}
                                                                                    disabled={itemIdx === (sec.items || []).length - 1}
                                                                                    className="p-1 bg-white hover:bg-slate-100 text-slate-600 border border-gray-200 rounded-lg disabled:opacity-30 transition"
                                                                                    title="Move Down"
                                                                                >
                                                                                    <ArrowDown className="w-3 h-3" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => deleteItem(actualIdx, itemIdx)}
                                                                                    className="p-1 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 rounded-lg transition ml-0.5"
                                                                                    title="Delete Item"
                                                                                >
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                    {/* Bottom Add Link Button */}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openAddLinkModal(actualIdx)}
                                                                        className="w-full py-2.5 border border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                                                                    >
                                                                        <Plus className="w-3.5 h-3.5" />
                                                                        <span>Add Another Link to this Section</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: SETTINGS & DYNAMIC AUTO-SYNC */}
                        {activeTab === "settings" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* General Site Config */}
                                <div className="lg:col-span-2 bg-white border border-gray-300 p-6 rounded-xl flex flex-col gap-5 shadow-sm">
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            <Sliders className="w-5 h-5 text-[#3B82F6]" />
                                            <span>General Site & AI Header Settings</span>
                                        </h2>

                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={config.enabled}
                                                onChange={(e) =>
                                                    setConfig((prev) => ({ ...prev, enabled: e.target.checked }))
                                                }
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                                            <span className="ml-3 text-xs font-semibold text-slate-700">
                                                {config.enabled ? "Enabled" : "Disabled"}
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                            Organization / Site Title (# Title)
                                        </label>
                                        <input
                                            type="text"
                                            value={config.title || ""}
                                            onChange={(e) =>
                                                setConfig((prev) => ({ ...prev, title: e.target.value }))
                                            }
                                            placeholder="Alavi Hospitals"
                                            className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                            Site Summary (&gt; Summary)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={config.summary || ""}
                                            onChange={(e) =>
                                                setConfig((prev) => ({ ...prev, summary: e.target.value }))
                                            }
                                            placeholder="Brief introductory statement describing the hospital and key offerings..."
                                            className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">
                                            Homepage URL (- Homepage: URL)
                                        </label>
                                        <input
                                            type="text"
                                            value={config.homepage || ""}
                                            onChange={(e) =>
                                                setConfig((prev) => ({ ...prev, homepage: e.target.value }))
                                            }
                                            placeholder="https://alavihospitals.in"
                                            className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-xs text-blue-600 font-mono focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                                            <span>AI Model System Notes & Directives</span>
                                            <span className="text-[10px] text-slate-500">
                                                Appended for ChatGPT, Perplexity, and Claude agents
                                            </span>
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={config.systemNotes || ""}
                                            onChange={(e) =>
                                                setConfig((prev) => ({ ...prev, systemNotes: e.target.value }))
                                            }
                                            placeholder="Instructions and directives for AI agents consuming this file..."
                                            className="w-full bg-white border border-gray-300 px-3 py-2 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Resource Auto-Sync Toggles */}
                                <div className="bg-white border border-gray-300 p-6 rounded-xl flex flex-col gap-4 shadow-sm">
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        <span>Dynamic DB Auto-Sync</span>
                                    </h2>

                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Automatically query and append live verified records from DynamoDB tables to /llms.txt:
                                    </p>

                                    <div className="flex flex-col gap-3 mt-1">
                                        {[
                                            {
                                                key: "includeDoctors" as const,
                                                label: "Auto-Include Active Doctors",
                                                desc: "Injects live consultants & clinical team directory",
                                            },
                                            {
                                                key: "includeBlogs" as const,
                                                label: "Auto-Include Health Articles",
                                                desc: "Injects recent blogs, insights, and patient guides",
                                            },
                                            {
                                                key: "includeSpecialities" as const,
                                                label: "Auto-Include Specialities",
                                                desc: "Injects Centres of Excellence & department pages",
                                            },
                                            {
                                                key: "includeTreatments" as const,
                                                label: "Auto-Include Treatments",
                                                desc: "Injects conditions & surgical procedure pages",
                                            },
                                            {
                                                key: "includeHealthPackages" as const,
                                                label: "Auto-Include Health Packages",
                                                desc: "Injects preventive health checkup packages",
                                            },
                                            {
                                                key: "includeSecondOpinion" as const,
                                                label: "Auto-Include Second Opinion",
                                                desc: "Injects surgical second opinion topics",
                                            },
                                        ].map((item) => (
                                            <label
                                                key={item.key}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition"
                                            >
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{item.label}</p>
                                                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={!!config.dynamicSections?.[item.key]}
                                                    onChange={(e) =>
                                                        setConfig((prev) => ({
                                                            ...prev,
                                                            dynamicSections: {
                                                                ...prev.dynamicSections,
                                                                [item.key]: e.target.checked,
                                                            },
                                                        }))
                                                    }
                                                    className="w-4 h-4 text-[#3B82F6] rounded border-gray-300 focus:ring-[#3B82F6] bg-white"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: RAW MARKDOWN EDITOR */}
                        {activeTab === "raw" && (
                            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-200 pb-4">
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                            <Code className="w-5 h-5 text-indigo-600" />
                                            <span>Direct Raw Markdown Override</span>
                                        </h2>
                                        <p className="text-xs text-slate-600 mt-0.5">
                                            Enable manual raw mode if you prefer authoring raw llms.txt Markdown text directly instead of using Section Builder.
                                        </p>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={config.useRawOverride}
                                            onChange={(e) =>
                                                setConfig((prev) => ({
                                                    ...prev,
                                                    useRawOverride: e.target.checked,
                                                }))
                                            }
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                                        <span className="ml-2.5 text-xs font-bold text-amber-700">
                                            {config.useRawOverride ? "Raw Override Active" : "Use Section Builder"}
                                        </span>
                                    </label>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                        <span>/llms.txt Raw Content</span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {config.rawMarkdownOverride?.length || 0} characters
                                        </span>
                                    </label>
                                    <textarea
                                        rows={14}
                                        value={config.rawMarkdownOverride || ""}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                rawMarkdownOverride: e.target.value,
                                            }))
                                        }
                                        placeholder="# Alavi Hospitals&#10;&#10;> Summary statement...&#10;&#10;## Section Title&#10;- [Page](https://...)"
                                        className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs font-mono text-emerald-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                        <span>/llms-full.txt Custom Content Override (Optional)</span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            Leave blank to auto-generate extended dataset indexes
                                        </span>
                                    </label>
                                    <textarea
                                        rows={8}
                                        value={config.fullTxtContent || ""}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                fullTxtContent: e.target.value,
                                            }))
                                        }
                                        placeholder="Full extended markdown directory for llms-full.txt..."
                                        className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs font-mono text-blue-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB 4: LIVE PREVIEW & EXPORT */}
                        {activeTab === "preview" && (
                            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-200 pb-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPreviewType("llms.txt")}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${previewType === "llms.txt"
                                                ? "bg-[#3B82F6] text-white shadow-sm"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                }`}
                                        >
                                            llms.txt Preview
                                        </button>
                                        <button
                                            onClick={() => setPreviewType("llms-full.txt")}
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${previewType === "llms-full.txt"
                                                ? "bg-[#3B82F6] text-white shadow-sm"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                }`}
                                        >
                                            llms-full.txt Preview
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    previewType === "llms.txt"
                                                        ? compiledMarkdown
                                                        : compiledFullMarkdown
                                                )
                                            }
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-gray-300 transition"
                                        >
                                            {copied ? (
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <Copy className="w-3.5 h-3.5 text-blue-600" />
                                            )}
                                            <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDownload(
                                                    previewType,
                                                    previewType === "llms.txt"
                                                        ? compiledMarkdown
                                                        : compiledFullMarkdown
                                                )
                                            }
                                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Download {previewType}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="relative bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[600px] overflow-y-auto">
                                    <pre className="text-xs font-mono text-slate-100 whitespace-pre-wrap leading-relaxed">
                                        {previewType === "llms.txt"
                                            ? compiledMarkdown
                                            : compiledFullMarkdown}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ========================================================= */}
            {/* ADD / EDIT LINK POPUP MODAL                               */}
            {/* ========================================================= */}
            {linkModal && linkModal.isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeLinkModal();
                    }}
                >
                    <div
                        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#3B82F6] px-6 py-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Link2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold">
                                        {linkModal.mode === "add" ? "Add Link to Section" : "Edit Section Link"}
                                    </h3>
                                    <p className="text-[11px] text-blue-100 truncate max-w-xs sm:max-w-md">
                                        {config.customSections[linkModal.secIndex]?.title || `Section #${linkModal.secIndex + 1}`}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeLinkModal}
                                className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-blue-600 transition cursor-pointer"
                                title="Close (Esc)"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSaveLinkFromModal} className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
                            {/* Quick Presets / Suggestions */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-[#3B82F6]" />
                                    <span>Quick Presets (1-Click Fill)</span>
                                </label>
                                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-gray-200">
                                    {SUGGESTED_LINKS.map((preset, pIdx) => {
                                        const IconComponent = preset.icon;
                                        return (
                                            <button
                                                key={pIdx}
                                                type="button"
                                                onClick={() => {
                                                    setLinkModal((prev) =>
                                                        prev
                                                            ? {
                                                                ...prev,
                                                                title: preset.title,
                                                                url: preset.url,
                                                                description: preset.description,
                                                            }
                                                            : null
                                                    );
                                                }}
                                                className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300 transition shrink-0 shadow-2xs cursor-pointer"
                                            >
                                                <IconComponent className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                <span>{preset.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Link Title */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Link Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={linkModal.title}
                                    onChange={(e) =>
                                        setLinkModal((prev) => (prev ? { ...prev, title: e.target.value } : null))
                                    }
                                    placeholder="e.g. Cardiology & Cardiovascular Sciences"
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition shadow-xs"
                                    autoFocus
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Anchor text shown to AI models and web crawlers in the markdown index.
                                </p>
                            </div>

                            {/* Target URL */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-slate-700">
                                        Target URL <span className="text-red-500">*</span>
                                    </label>
                                    {linkModal.url && (
                                        <a
                                            href={linkModal.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                                        >
                                            <span>Test / Open Link</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={linkModal.url}
                                    onChange={(e) =>
                                        setLinkModal((prev) => (prev ? { ...prev, url: e.target.value } : null))
                                    }
                                    placeholder="https://alavihospitals.in/specialities/cardiology"
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-sm font-mono text-blue-600 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition shadow-xs"
                                />
                            </div>

                            {/* Description Note (AI Context) */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Description Note (AI Context Summary)
                                </label>
                                <textarea
                                    rows={2}
                                    value={linkModal.description}
                                    onChange={(e) =>
                                        setLinkModal((prev) => (prev ? { ...prev, description: e.target.value } : null))
                                    }
                                    placeholder="Brief summary of clinical care, doctors, and treatments available at this link..."
                                    className="w-full bg-white border border-gray-300 px-3 py-2 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition shadow-xs resize-none"
                                />
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Appended in tabbed format: <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded font-mono">[- [Title](URL)	[Description]]</code>.
                                </p>
                            </div>

                            {/* Live Preview Box */}
                            <div className="bg-slate-50 border border-gray-200 rounded-xl p-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Live /llms.txt Markdown Preview:
                                </span>
                                <pre className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                    {`- [${linkModal.title || "Link Title"}](${linkModal.url || "https://alavihospitals.in/..."})${linkModal.description ? `\t[${linkModal.description}]` : ""}`}
                                </pre>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-200 mt-1">
                                <button
                                    type="button"
                                    onClick={closeLinkModal}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{linkModal.mode === "add" ? "Add Link" : "Save Changes"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
