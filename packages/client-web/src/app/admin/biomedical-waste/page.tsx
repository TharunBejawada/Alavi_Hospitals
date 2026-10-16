"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Scale,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Lock
} from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "../../../config";

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

function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BioMedicalWasteAdminPage() {
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

  // User state & permissions
  const [userRole, setUserRole] = useState<string>("ADMIN");
  const [userBranch, setUserBranch] = useState<string | null>(null);
  const [isBranchLocked, setIsBranchLocked] = useState(false);

  // Filters State
  const [branchFilter, setBranchFilter] = useState<string>("ALL");
  const [filterMode, setFilterMode] = useState<"date" | "period">("period");
  const [singleDate, setSingleDate] = useState<string>(today);
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, "0"));

  // Data & Loading State
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inline Editing State
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    ClinicalWaste: string;
    InfectiousWaste: string;
    SharpWaste: string;
    BottleWaste: string;
  }>({
    ClinicalWaste: "",
    InfectiousWaste: "",
    SharpWaste: "",
    BottleWaste: ""
  });
  const [isSavingRow, setIsSavingRow] = useState(false);

  // 1. Detect Logged-in User and Branch Lock
  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser") || sessionStorage.getItem("adminUser");
      if (stored) {
        const u = JSON.parse(stored);
        const role = u.role || "ADMIN";
        setUserRole(role);

        if (u.branch) {
          setUserBranch(u.branch);
          setBranchFilter(u.branch);
          setIsBranchLocked(true);
        } else if (role !== "ADMIN" && role !== "SUPERADMIN" && role !== "CORPORATE_ADMIN") {
          const staffBranch = u.location || "IDPL";
          setUserBranch(staffBranch);
          setBranchFilter(staffBranch);
          setIsBranchLocked(true);
        }
      }
    } catch (e) {
      console.warn("Could not parse user session:", e);
    }
  }, []);

  // 2. Fetch Records based on current filters
  const fetchRecords = async () => {
    setIsLoading(true);
    setEditingKey(null);

    try {
      let url = "";

      if (filterMode === "date") {
        if (!singleDate) {
          toast.warning("Please select a date to search.");
          setIsLoading(false);
          return;
        }

        // If specific branch selected, use single record endpoint
        if (branchFilter !== "ALL") {
          const url = `${API_URL}/api/biomedical-waste/record?branch=${encodeURIComponent(branchFilter)}&date=${encodeURIComponent(singleDate)}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.record) {
            setRecords([data.record]);
          } else {
            setRecords([]);
          }
          setIsLoading(false);
          return;
        } else {
          // Query all branches for this exact date
          const url = `${API_URL}/api/biomedical-waste?year=${encodeURIComponent(singleDate.slice(0, 4))}&month=${encodeURIComponent(singleDate.slice(5, 7))}`;
          const res = await fetch(url);
          const data = await res.json();
          const items = (data.items || []).filter((r: WasteRecord) => r.date === singleDate);
          setRecords(items);
          setIsLoading(false);
          return;
        }
      } else {
        // Period Mode: Year & Month
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

        url = `${API_URL}/api/biomedical-waste?${queryParams.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        const items = data.items || [];
        setRecords(items);
      }
    } catch (err: any) {
      console.error("Failed to fetch waste records from DB:", err);
      toast.error("Failed to load records from database.");
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load once on mount
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter]);

  // Handle Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  // Inline editing actions
  const startEditing = (record: WasteRecord) => {
    const key = `${record.branch}_${record.date}`;
    setEditingKey(key);
    setEditForm({
      ClinicalWaste: String(record.ClinicalWaste ?? 0),
      InfectiousWaste: String(record.InfectiousWaste ?? 0),
      SharpWaste: String(record.SharpWaste ?? 0),
      BottleWaste: String(record.BottleWaste ?? 0)
    });
  };

  const cancelEditing = () => {
    setEditingKey(null);
  };

  const saveInlineEdit = async (record: WasteRecord) => {
    const cVal = parseFloat(editForm.ClinicalWaste);
    const iVal = parseFloat(editForm.InfectiousWaste);
    const sVal = parseFloat(editForm.SharpWaste);
    const bVal = parseFloat(editForm.BottleWaste);

    if (isNaN(cVal) || isNaN(iVal) || isNaN(sVal) || isNaN(bVal)) {
      toast.error("All waste fields must contain valid numbers.");
      return;
    }

    if (cVal < 0 || iVal < 0 || sVal < 0 || bVal < 0) {
      toast.error("Waste values cannot be negative.");
      return;
    }

    setIsSavingRow(true);

    try {
      const payload = {
        branch: record.branch,
        date: record.date,
        ClinicalWaste: cVal,
        InfectiousWaste: iVal,
        SharpWaste: sVal,
        BottleWaste: bVal,
        userRole,
        userBranch
      };

      const recordId = record.id || record.wasteId || `${record.branch}_${record.date}`;
      const res = await fetch(`${API_URL}/api/biomedical-waste/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update record.");
      }

      toast.success("Record updated successfully!");
      setEditingKey(null);

      // Update local state without full reload
      setRecords((prev) =>
        prev.map((r) => {
          if (r.branch === record.branch && r.date === record.date) {
            return {
              ...r,
              ClinicalWaste: cVal,
              InfectiousWaste: iVal,
              SharpWaste: sVal,
              BottleWaste: bVal,
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        })
      );
    } catch (err: any) {
      console.error("Inline save error:", err);
      toast.error(err.message || "Failed to save inline changes.");
    } finally {
      setIsSavingRow(false);
    }
  };

  // Calculate totals for displayed records
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
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Bio Medical Wastage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-purple-600" />
            Bio Medical Wastage Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor, record, and inline-edit daily hospital waste disposal metrics per regulatory compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/biomedical-waste"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#5B328C] bg-purple-50 hover:bg-purple-100 rounded-xl transition border border-purple-200"
          >
            <ExternalLink className="w-4 h-4" />
            Public View
          </Link>

          <Link
            href="/admin/biomedical-waste/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#5B328C] hover:bg-[#4a2773] rounded-xl shadow-md transition active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            Add Wastage Record
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Logs</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">{records.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">entries found</span>
        </div>

        <div className="bg-yellow-50/70 p-4 rounded-xl border border-yellow-200 shadow-sm">
          <span className="text-[11px] font-bold text-yellow-800 uppercase tracking-wider block">Clinical</span>
          <span className="text-xl sm:text-2xl font-black text-yellow-950 mt-1 block">{totals.clinical}</span>
          <span className="text-[10px] text-yellow-800 font-semibold block mt-0.5">kg (Yellow)</span>
        </div>

        <div className="bg-red-50/70 p-4 rounded-xl border border-red-200 shadow-sm">
          <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block">Infectious</span>
          <span className="text-xl sm:text-2xl font-black text-red-950 mt-1 block">{totals.infectious}</span>
          <span className="text-[10px] text-red-800 font-semibold block mt-0.5">kg (Red)</span>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-sm">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Sharp Waste</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">{totals.sharp}</span>
          <span className="text-[10px] text-slate-600 font-semibold block mt-0.5">kg (White)</span>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Bottle & Glass</span>
          <span className="text-xl sm:text-2xl font-black text-blue-950 mt-1 block">{totals.bottle}</span>
          <span className="text-[10px] text-blue-800 font-semibold block mt-0.5">kg (Blue)</span>
        </div>

        <div className="bg-purple-50/80 p-4 rounded-xl border border-purple-200 shadow-sm">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">Grand Total</span>
          <span className="text-xl sm:text-2xl font-black text-[#5B328C] mt-1 block">{totals.grandTotal}</span>
          <span className="text-[10px] text-purple-700 font-bold block mt-0.5">kg Combined</span>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            {/* Filter 1: Branch Selector */}
            <div className="w-full lg:w-64">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  Branch Location
                </span>
                {isBranchLocked && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <Lock className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </label>
              {isBranchLocked ? (
                <div className="w-full bg-slate-100 border border-slate-300 text-slate-700 px-3.5 py-2.5 rounded-xl font-medium text-sm">
                  {branchFilter} Branch
                </div>
              ) : (
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-sm font-medium"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Filter 2: Mode Toggle */}
            <div className="w-full lg:w-auto">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Filter Mode
              </label>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFilterMode("period")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    filterMode === "period"
                      ? "bg-white text-[#5B328C] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Filter by Year & Month
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode("date")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    filterMode === "date"
                      ? "bg-white text-[#5B328C] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Filter by Date
                </button>
              </div>
            </div>

            {/* Filter 3: Conditional Inputs */}
            {filterMode === "date" ? (
              <div className="w-full lg:w-60">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  Select Date
                </label>
                <input
                  type="date"
                  max={today}
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-sm font-medium"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Year Dropdown */}
                <div className="w-full sm:w-36">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-sm font-medium"
                  >
                    {yearsList.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month Dropdown */}
                <div className="w-full sm:w-44">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 px-3.5 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 text-sm font-medium"
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

            {/* Search Trigger Button */}
            <div className="w-full lg:w-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0066A9] hover:bg-[#005288] text-white text-sm font-bold rounded-xl shadow-sm transition"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              Disposal Records Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click &quot;Modify&quot; on any row to edit values inline. Click &quot;Save&quot; to apply changes.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-[#5B328C] rounded-full">
            {records.length} {records.length === 1 ? "Record" : "Records"}
          </span>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading biomedical waste data...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No records found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              No waste records matched your search filters. Try picking another branch, year, or month, or record a new entry.
            </p>
            <Link
              href="/admin/biomedical-waste/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#5B328C] hover:bg-[#4a2773] rounded-xl shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add Record for this Period
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Branch</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-900 rounded">
                      Clinical (kg)
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-red-100 text-red-900 rounded">
                      Infectious (kg)
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                      Sharp (kg)
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-right">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                      Bottle (kg)
                    </span>
                  </th>
                  <th className="py-3.5 px-4 text-right font-black">Total (kg)</th>
                  <th className="py-3.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {records.map((r) => {
                  const key = `${r.branch}_${r.date}`;
                  const isEditing = editingKey === key;
                  const rowTotal = (
                    (r.ClinicalWaste || 0) +
                    (r.InfectiousWaste || 0) +
                    (r.SharpWaste || 0) +
                    (r.BottleWaste || 0)
                  ).toFixed(2);

                  return (
                    <tr
                      key={key}
                      className={`transition ${
                        isEditing ? "bg-purple-50/50" : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Branch Column */}
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-purple-600" />
                          {r.branch}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="py-4 px-4 text-slate-800 font-semibold text-xs sm:text-sm">
                        {r.date}
                      </td>

                      {/* Clinical Waste Column */}
                      <td className="py-4 px-4 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editForm.ClinicalWaste}
                            onChange={(e) =>
                              setEditForm({ ...editForm, ClinicalWaste: e.target.value })
                            }
                            className="w-24 text-right px-2.5 py-1 text-xs border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 font-bold bg-white"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {Number(r.ClinicalWaste ?? 0).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Infectious Waste Column */}
                      <td className="py-4 px-4 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editForm.InfectiousWaste}
                            onChange={(e) =>
                              setEditForm({ ...editForm, InfectiousWaste: e.target.value })
                            }
                            className="w-24 text-right px-2.5 py-1 text-xs border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 font-bold bg-white"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {Number(r.InfectiousWaste ?? 0).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Sharp Waste Column */}
                      <td className="py-4 px-4 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editForm.SharpWaste}
                            onChange={(e) =>
                              setEditForm({ ...editForm, SharpWaste: e.target.value })
                            }
                            className="w-24 text-right px-2.5 py-1 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 font-bold bg-white"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {Number(r.SharpWaste ?? 0).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Bottle Waste Column */}
                      <td className="py-4 px-4 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editForm.BottleWaste}
                            onChange={(e) =>
                              setEditForm({ ...editForm, BottleWaste: e.target.value })
                            }
                            className="w-24 text-right px-2.5 py-1 text-xs border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold bg-white"
                          />
                        ) : (
                          <span className="font-semibold text-slate-800">
                            {Number(r.BottleWaste ?? 0).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Total Column */}
                      <td className="py-4 px-4 text-right font-black text-[#5B328C]">
                        {rowTotal}
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={isSavingRow}
                              onClick={() => saveInlineEdit(r)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                            >
                              {isSavingRow ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              Save
                            </button>
                            <button
                              type="button"
                              disabled={isSavingRow}
                              onClick={cancelEditing}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditing(r)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Modify
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
