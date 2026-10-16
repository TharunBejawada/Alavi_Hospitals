"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Save,
  Lock,
  Info,
  Scale,
  RefreshCw
} from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "../../../../config";

const BRANCHES = [
  { id: "IDPL", name: "IDPL Branch (Balanagar)", address: "IDPL Colony, Balanagar, Hyderabad" },
  { id: "Chintal", name: "Chintal Branch (Jeedimetla)", address: "Jeedimetla Main Road, Chintal, Hyderabad" }
];

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddBioMedicalWastePage() {
  const router = useRouter();
  const today = getTodayString();

  // User state & permissions
  const [userRole, setUserRole] = useState<string>("ADMIN");
  const [userBranch, setUserBranch] = useState<string | null>(null);
  const [isBranchLocked, setIsBranchLocked] = useState(false);

  // Form State
  const [branch, setBranch] = useState<string>("IDPL");
  const [date, setDate] = useState<string>(today);
  const [clinicalWaste, setClinicalWaste] = useState<string>("");
  const [infectiousWaste, setInfectiousWaste] = useState<string>("");
  const [sharpWaste, setSharpWaste] = useState<string>("");
  const [bottleWaste, setBottleWaste] = useState<string>("");

  // Loading & Check state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [existingRecord, setExistingRecord] = useState<any | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  // 1. Detect Logged-in User and Branch Lock
  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser") || sessionStorage.getItem("adminUser");
      if (stored) {
        const u = JSON.parse(stored);
        const role = u.role || "ADMIN";
        setUserRole(role);

        // If user has an explicit branch assigned or is branch staff
        if (u.branch) {
          setUserBranch(u.branch);
          setBranch(u.branch);
          setIsBranchLocked(true);
        } else if (role !== "ADMIN" && role !== "SUPERADMIN" && role !== "CORPORATE_ADMIN") {
          // If staff/doctor with designated branch in user record
          const staffBranch = u.location || "IDPL";
          setUserBranch(staffBranch);
          setBranch(staffBranch);
          setIsBranchLocked(true);
        }
      }
    } catch (e) {
      console.warn("Could not parse user session:", e);
    }
  }, []);

  // 2. Check if a record already exists for selected (branch, date)
  useEffect(() => {
    if (!branch || !date) return;

    if (date > today) {
      setDateError(`Selected date cannot be in the future. Maximum allowed date is ${today}.`);
      setExistingRecord(null);
      return;
    } else {
      setDateError(null);
    }

    let isMounted = true;
    async function checkExisting() {
      setIsCheckingExisting(true);
      try {
        const res = await fetch(`${API_URL}/api/biomedical-waste/record?branch=${encodeURIComponent(branch)}&date=${encodeURIComponent(date)}`);
        if (!res.ok) throw new Error("Failed to query");
        const json = await res.json();
        if (isMounted) {
          const rec = json.record;

          if (rec) {
            setExistingRecord(rec);
            setClinicalWaste(String(rec.ClinicalWaste ?? 0));
            setInfectiousWaste(String(rec.InfectiousWaste ?? 0));
            setSharpWaste(String(rec.SharpWaste ?? 0));
            setBottleWaste(String(rec.BottleWaste ?? 0));
          } else {
            setExistingRecord(null);
            setClinicalWaste("");
            setInfectiousWaste("");
            setSharpWaste("");
            setBottleWaste("");
          }
        }
      } catch (err) {
        if (isMounted) setExistingRecord(null);
      } finally {
        if (isMounted) setIsCheckingExisting(false);
      }
    }

    checkExisting();
    return () => {
      isMounted = false;
    };
  }, [branch, date, today]);

  // Live total calculation
  const totalWaste = (
    (parseFloat(clinicalWaste) || 0) +
    (parseFloat(infectiousWaste) || 0) +
    (parseFloat(sharpWaste) || 0) +
    (parseFloat(bottleWaste) || 0)
  ).toFixed(2);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!branch) {
      toast.error("Please select a hospital branch.");
      return;
    }

    if (!date) {
      toast.error("Please select a valid date.");
      return;
    }

    if (date > today) {
      toast.error(`Date cannot be in the future. Maximum allowed date is ${today}.`);
      return;
    }

    const cVal = parseFloat(clinicalWaste) || 0;
    const iVal = parseFloat(infectiousWaste) || 0;
    const sVal = parseFloat(sharpWaste) || 0;
    const bVal = parseFloat(bottleWaste) || 0;

    if (cVal < 0 || iVal < 0 || sVal < 0 || bVal < 0) {
      toast.error("Waste values cannot be negative numbers.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        branch,
        date,
        ClinicalWaste: cVal,
        InfectiousWaste: iVal,
        SharpWaste: sVal,
        BottleWaste: bVal,
        userRole,
        userBranch
      };

      const res = await fetch(`${API_URL}/api/biomedical-waste`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save waste record.");
      }

      toast.success(data.message || "Biomedical waste record saved successfully!");
      router.push("/admin/biomedical-waste");
    } catch (err: any) {
      console.error("Submission Error:", err);
      toast.error(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/admin/biomedical-waste" className="hover:text-blue-600 transition">
              Bio Medical Waste
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Add Wastage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Trash2 className="w-7 h-7 text-purple-600" />
            Add Bio Medical Wastage
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/biomedical-waste"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            View All Records
          </Link>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-[#5B328C] to-[#0066A9] p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full mb-2">
                Daily Entry Protocol
              </span>
              <h2 className="text-xl font-bold">Record Daily Biomedical Waste Disposal</h2>
              <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
                Please enter the exact weights in kilograms (kg) for each segregated waste category.
                Saving for an existing date and branch will automatically update the daily log.
              </p>
            </div>
            <Scale className="w-10 h-10 text-white/40 hidden sm:block" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Facility & Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200/80">
            {/* Branch Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Hospital Branch *
                </span>
                {isBranchLocked && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Lock className="w-3 h-3" /> Locked to assigned branch
                  </span>
                )}
              </label>

              {isBranchLocked ? (
                <div className="w-full bg-slate-100 border border-slate-300 text-slate-700 px-4 py-3 rounded-xl font-medium flex items-center justify-between">
                  <span>{branch} Branch</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Pre-assigned</span>
                </div>
              ) : (
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition text-sm font-medium shadow-sm"
                  required
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-slate-500 mt-1.5">
                Select the physical hospital location where the waste was weighed and dispatched.
              </p>
            </div>

            {/* Date Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Recording Date *
                </span>
                <span className="text-xs text-slate-500">Max: Today ({today})</span>
              </label>

              <div className="relative">
                <input
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full bg-white border ${
                    dateError ? "border-red-500 focus:ring-red-400" : "border-slate-300 focus:ring-purple-600"
                  } text-slate-900 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:border-transparent transition text-sm font-medium shadow-sm`}
                  required
                />
              </div>

              {dateError ? (
                <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {dateError}
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1.5">
                  The calendar date the biomedical waste was handed over for disposal.
                </p>
              )}
            </div>
          </div>

          {/* Existing Record Indicator Notification */}
          {isCheckingExisting ? (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span>Checking existing database records for {branch} on {date}...</span>
            </div>
          ) : existingRecord ? (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-900">
                <p className="font-semibold">Existing record found for {branch} on {date}!</p>
                <p className="text-amber-800 mt-0.5">
                  Previous values have been populated below. Submitting will update this daily entry with the new values.
                </p>
              </div>
            </div>
          ) : null}

          {/* Section 2: Waste Category Inputs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Segregated Waste Categories</h3>
                <p className="text-xs text-slate-500">
                  Enter non-negative weight measurements in kilograms (kg). Decimals up to 3 places are supported.
                </p>
              </div>

              <div className="bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-lg text-right">
                <span className="text-[11px] font-semibold uppercase tracking-wider block text-purple-700">Calculated Total</span>
                <span className="text-lg font-extrabold text-[#5B328C]">{totalWaste} kg</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* 1. Clinical Waste (Yellow Category) */}
              <div className="bg-yellow-50/40 border border-yellow-200/80 rounded-xl p-4 transition-all hover:border-yellow-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-500 text-yellow-950 font-bold text-xs rounded-full">
                    Yellow Category
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Unit: kg</span>
                </div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Clinical Waste (Yellow)
                </label>
                <p className="text-xs text-slate-600 mb-3">
                  Anatomical, soiled, soaked gauze, organs, dressings, and expired medications.
                </p>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={clinicalWaste}
                    onChange={(e) => setClinicalWaste(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-4 pr-12 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kg</span>
                </div>
              </div>

              {/* 2. Infectious Waste (Red Category) */}
              <div className="bg-red-50/40 border border-red-200/80 rounded-xl p-4 transition-all hover:border-red-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500 text-white font-bold text-xs rounded-full">
                    Red Category
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Unit: kg</span>
                </div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Infectious Waste (Red)
                </label>
                <p className="text-xs text-slate-600 mb-3">
                  Contaminated plastics, tubing, catheters, IV bottles, gloves, syringes without needles.
                </p>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={infectiousWaste}
                    onChange={(e) => setInfectiousWaste(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-4 pr-12 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kg</span>
                </div>
              </div>

              {/* 3. Sharp Waste (White / Translucent Category) */}
              <div className="bg-slate-100/70 border border-slate-300 rounded-xl p-4 transition-all hover:border-slate-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-700 text-white font-bold text-xs rounded-full">
                    White (Puncture-Proof)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Unit: kg</span>
                </div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Sharp Waste (White)
                </label>
                <p className="text-xs text-slate-600 mb-3">
                  Needles, syringes with fixed needles, scalpels, blades, and sharp metal objects.
                </p>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={sharpWaste}
                    onChange={(e) => setSharpWaste(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-4 pr-12 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent text-sm font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kg</span>
                </div>
              </div>

              {/* 4. Bottle Waste (Blue Category) */}
              <div className="bg-blue-50/40 border border-blue-200/80 rounded-xl p-4 transition-all hover:border-blue-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-600 text-white font-bold text-xs rounded-full">
                    Blue Category
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Unit: kg</span>
                </div>
                <label className="block text-sm font-bold text-slate-900 mb-1">
                  Bottle & Glass Waste (Blue)
                </label>
                <p className="text-xs text-slate-600 mb-3">
                  Glass medicine vials, ampoules, broken glass bottles, and metallic body implants.
                </p>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={bottleWaste}
                    onChange={(e) => setBottleWaste(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 pl-4 pr-12 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm font-semibold"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <Link
              href="/admin/biomedical-waste"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center"
            >
              Cancel & Go Back
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !!dateError}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl shadow-md transition ${
                isSubmitting || !!dateError
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#5B328C] hover:bg-[#4a2773] active:scale-[0.99]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving Waste Record...
                </>
              ) : existingRecord ? (
                <>
                  <Save className="w-4 h-4" />
                  Update Wastage Record
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Wastage Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
