"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../config";

export default function AdminLogin() {
  const router = useRouter();
  
  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // 1. Call Backend API
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 2. Save User Session (Simple LocalStorage for now)
      // In production, you might use cookies or a more robust auth library
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // 3. Redirect
      router.push("/admin/dashboard");

    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Brand Section */}
        <div className="md:w-1/2 bg-[#0F172A] p-12 flex flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <span className="font-bold text-xl tracking-wide">Alavi Hospitals</span>
            </div>
            
            <h2 className="text-3xl font-serif font-bold mb-4">Manage Your Digital Practice</h2>
            <p className="text-slate-400 leading-relaxed">
              Securely manage patient inquiries, update service details, and track website performance from one central hub.
            </p>
          </div>

          <div className="text-xs text-slate-500 relative z-10 mt-12">
            © 2026 VG Digital Services. All Rights Reserved.
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h3>
          <p className="text-slate-500 mb-8">Please enter your credentials to access the dashboard.</p>

          {/* Error Alert */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@alavihospitals.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition outline-none text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 transition outline-none text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Forgot your password? Contact IT Support.
          </p>
        </div>

      </div>
    </div>
  );
}