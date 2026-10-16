"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Building2,
  Search,
  Filter,
  ShieldCheck,
  Scale,
  RefreshCw,
  AlertCircle,
  FileText,
  Info,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { API_URL } from "../../config";

interface WasteRecord {
  id?: string;
  wasteId?: string;
  branch: string;
  date: string;
  ClinicalWaste: number;
  InfectiousWaste: number;
  SharpWaste: number;
  BottleWaste: number;
  createdAt?: string;
  updatedAt?: string;
}

const BRANCHES = [
  { id: "ALL", name: "All Branches" },
  { id: "IDPL", name: "IDPL Branch" },
  { id: "Chintal", name: "Chintal Branch" }
];

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BioMedicalWastePublic() {
  const today = getTodayString();
  const currentYear = new Date().getFullYear();

  // Generate list of past 10 years
  const yearsList = useMemo(() => {
    const list = [];
    for (let y = currentYear; y >= currentYear - 9; y--) {
      list.push(String(y));
    }
    return list;
  }, [currentYear]);

  // Filters State
  const [branchFilter, setBranchFilter] = useState<string>("ALL");
  const [filterMode, setFilterMode] = useState<"period" | "date">("period");
  const [singleDate, setSingleDate] = useState<string>(today);
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, "0"));

  // Records state
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch function
  const fetchRecords = async () => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      if (filterMode === "date") {
        if (!singleDate) {
          setIsLoading(false);
          return;
        }

        if (branchFilter !== "ALL") {
          const url = `${API_URL}/api/biomedical-waste/record?branch=${encodeURIComponent(branchFilter)}&date=${encodeURIComponent(singleDate)}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.record) {
            setRecords([data.record]);
          } else {
            setRecords([]);
          }
        } else {
          const url = `${API_URL}/api/biomedical-waste?year=${encodeURIComponent(singleDate.slice(0, 4))}&month=${encodeURIComponent(singleDate.slice(5, 7))}`;
          const res = await fetch(url);
          const data = await res.json();
          const items = (data.items || []).filter((r: WasteRecord) => r.date === singleDate);
          setRecords(items);
        }
      } else {
        const queryParams = new URLSearchParams();
        if (branchFilter && branchFilter !== "ALL") {
          queryParams.append("branch", branchFilter);
        }
        if (selectedYear) {
          queryParams.append("year", selectedYear);
        }
        if (selectedMonth) {
          queryParams.append("month", selectedMonth);
        }

        const url = `${API_URL}/api/biomedical-waste?${queryParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        const items = data.items || [];
        setRecords(items);
      }
    } catch (err) {
      console.error("Public waste fetch error:", err);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load default current month on initial mount
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  // Calculate totals
  const totals = useMemo(() => {
    let clinical = 0;
    let infectious = 0;
    let sharp = 0;
    let bottle = 0;

    for (const r of records) {
      clinical += Number(r.ClinicalWaste || 0);
      infectious += Number(r.InfectiousWaste || 0);
      sharp += Number(r.SharpWaste || 0);
      bottle += Number(r.BottleWaste || 0);
    }

    return {
      clinical: clinical.toFixed(2),
      infectious: infectious.toFixed(2),
      sharp: sharp.toFixed(2),
      bottle: bottle.toFixed(2),
      grandTotal: (clinical + infectious + sharp + bottle).toFixed(2)
    };
  }, [records]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── 1. Hero Header ── */}
      <section className="bg-gradient-to-r from-[#5B328C] via-[#4A2574] to-[#0066A9] text-white py-14 lg:py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs sm:text-sm font-semibold tracking-wide mb-4 border border-white/20">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Statutory Compliance &amp; Environmental Safety
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Bio Medical Wastage Report
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-purple-100/90 leading-relaxed font-medium">
              In accordance with the Bio-Medical Waste Management Rules and Pollution Control Board norms,
              Alavi Hospitals maintains meticulous daily logs of segregated hospital waste generated and safely dispatched.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Waste Classification Info Cards ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Yellow */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-yellow-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                  Yellow Bin
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Clinical Waste</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Anatomical, soiled dressings, linen &amp; expired pharma items.
              </p>
            </div>
          </div>

          {/* Red */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-red-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
                  Red Bin
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Infectious Waste</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Contaminated plastics, IV bottles, tubing, catheters &amp; gloves.
              </p>
            </div>
          </div>

          {/* White */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-slate-500" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-800 bg-slate-200 px-2 py-0.5 rounded-full">
                  White Box
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Sharp Waste</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Puncture-proof sharps, needles, scalpels, blades &amp; fixed syringes.
              </p>
            </div>
          </div>

          {/* Blue */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-blue-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  Blue Box
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Bottle &amp; Glass</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Medicine ampoules, vials, glassware &amp; metallic surgical implants.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Main Search & Filter Interface ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end gap-5">
              {/* Branch Selector */}
              <div className="w-full lg:w-1/4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  Hospital Branch
                </label>
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-sm font-semibold transition"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Mode Toggle */}
              <div className="w-full lg:w-auto">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Search Filter Type
                </label>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setFilterMode("period")}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                      filterMode === "period"
                        ? "bg-[#5B328C] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Month &amp; Year
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode("date")}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                      filterMode === "date"
                        ? "bg-[#5B328C] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Single Date
                  </button>
                </div>
              </div>

              {/* Conditional Inputs */}
              {filterMode === "date" ? (
                <div className="w-full lg:w-1/4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    Select Specific Date
                  </label>
                  <input
                    type="date"
                    max={today}
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-sm font-semibold transition"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-2/5">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-sm font-semibold transition"
                    >
                      {yearsList.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Month
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white text-sm font-semibold transition"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Search Button */}
              <div className="w-full lg:w-auto">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#0066A9] hover:bg-[#005288] text-white text-sm font-bold rounded-xl shadow-md transition active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search Records
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── 4. Summary Strip ── */}
        {records.length > 0 && (
          <div className="mt-6 bg-[#FAF8FE] border border-[#F0E8FA] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-[#5B328C]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Period Waste Summary
                </span>
                <span className="text-xs text-slate-600">
                  Showing {records.length} {records.length === 1 ? "entry" : "entries"} recorded
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <span className="text-[11px] font-semibold text-yellow-800 block">Clinical</span>
                <span className="text-base font-extrabold text-slate-900">{totals.clinical} kg</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-red-800 block">Infectious</span>
                <span className="text-base font-extrabold text-slate-900">{totals.infectious} kg</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-600 block">Sharps</span>
                <span className="text-base font-extrabold text-slate-900">{totals.sharp} kg</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-blue-800 block">Bottles</span>
                <span className="text-base font-extrabold text-slate-900">{totals.bottle} kg</span>
              </div>
              <div className="border-l border-purple-200 pl-6">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                  Combined Total
                </span>
                <span className="text-xl font-black text-[#5B328C]">{totals.grandTotal} kg</span>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. Data Display Section ── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              Biomedical Waste Log Table
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Weights indicated in kilograms (kg)
            </span>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Fetching wastage records from database...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No records found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                {hasSearched
                  ? "No biomedical waste logs were found matching your criteria. Try adjusting the branch or period filters."
                  : "Please select your preferred branch location and time period, then click Search."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View: Clean Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider">
                      <th className="py-3.5 px-6">Hospital / Branch</th>
                      <th className="py-3.5 px-4">Wastage Date</th>
                      <th className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 bg-yellow-100 text-yellow-900 rounded">
                          Clinical Waste (kg)
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 bg-red-100 text-red-900 rounded">
                          Infectious Waste (kg)
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded">
                          Sharp Waste (kg)
                        </span>
                      </th>
                      <th className="py-3.5 px-4 text-right">
                        <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded">
                          Bottle Waste (kg)
                        </span>
                      </th>
                      <th className="py-3.5 px-6 text-right font-black">Daily Total (kg)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {records.map((r, idx) => {
                      const dailyTotal = (
                        (r.ClinicalWaste || 0) +
                        (r.InfectiousWaste || 0) +
                        (r.SharpWaste || 0) +
                        (r.BottleWaste || 0)
                      ).toFixed(2);

                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="py-4 px-6 font-bold text-slate-900">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 rounded-lg text-xs font-bold border border-purple-100">
                              <Building2 className="w-3.5 h-3.5 text-[#5B328C]" />
                              {r.branch} Branch
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-800 font-semibold text-sm">
                            {r.date}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-slate-800">
                            {Number(r.ClinicalWaste ?? 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-slate-800">
                            {Number(r.InfectiousWaste ?? 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-slate-800">
                            {Number(r.SharpWaste ?? 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-slate-800">
                            {Number(r.BottleWaste ?? 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-6 text-right font-black text-[#5B328C]">
                            {dailyTotal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Responsive Cards */}
              <div className="md:hidden divide-y divide-slate-200">
                {records.map((r, idx) => {
                  const dailyTotal = (
                    (r.ClinicalWaste || 0) +
                    (r.InfectiousWaste || 0) +
                    (r.SharpWaste || 0) +
                    (r.BottleWaste || 0)
                  ).toFixed(2);

                  return (
                    <div key={idx} className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-900 rounded-lg text-xs font-bold border border-purple-100">
                          <Building2 className="w-3 h-3 text-[#5B328C]" />
                          {r.branch} Branch
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                          {r.date}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-yellow-50/70 p-2.5 rounded-lg border border-yellow-200">
                          <span className="text-[10px] text-yellow-800 font-semibold block">Clinical (Yellow)</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {Number(r.ClinicalWaste ?? 0).toFixed(2)} kg
                          </span>
                        </div>

                        <div className="bg-red-50/70 p-2.5 rounded-lg border border-red-200">
                          <span className="text-[10px] text-red-800 font-semibold block">Infectious (Red)</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {Number(r.InfectiousWaste ?? 0).toFixed(2)} kg
                          </span>
                        </div>

                        <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-300">
                          <span className="text-[10px] text-slate-700 font-semibold block">Sharp (White)</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {Number(r.SharpWaste ?? 0).toFixed(2)} kg
                          </span>
                        </div>

                        <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                          <span className="text-[10px] text-blue-800 font-semibold block">Bottle (Blue)</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {Number(r.BottleWaste ?? 0).toFixed(2)} kg
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600">Daily Total:</span>
                        <span className="text-[#5B328C] text-sm font-black">{dailyTotal} kg</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── 6. Bottom Regulatory Note ── */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex items-start gap-4">
          <Info className="w-6 h-6 text-[#5B328C] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Commitment to Public Health &amp; Safe Waste Management
            </h4>
            <p>
              Alavi Hospitals is dedicated to maintaining high standards of bio-medical waste segregation and treatment.
              All waste generated at our IDPL and Chintal facilities is handled by authorized Common Bio-Medical Waste
              Treatment Facilities (CBWTF) approved by the Pollution Control Board, safeguarding our patients, healthcare
              workers, and the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
