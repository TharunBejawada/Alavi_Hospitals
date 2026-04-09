"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  HeartPulse,
  Users, 
  Settings, 
  LogOut, 
  Activity,
  Image as ImageIcon,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- 1. SESSION PROTECTION ---
  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }

    const user = localStorage.getItem("adminUser");
    
    if (!user) {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  if (!isAuthorized) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Blog Posts", href: "/admin/blogs", icon: FileText },
    { name: "Manage Doctors", href: "/admin/doctors", icon: HeartPulse },
    { name: "Doctors Availability", href: "/admin/availability", icon: Activity },
    { name: "Users", href: "/admin/users", icon: Users }
    // { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#0F172A] text-white z-50 p-4 flex justify-between items-center">
        <span className="font-bold">Alavi Hospitals Admin</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 z-50 opacity-90 bg-[#0F172A] text-slate-300 flex flex-col z-40 transition-transform duration-300
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 shrink-0 mt-14 md:mt-0">
           <h1 className="text-white font-bold text-lg tracking-wide">Alavi Hospitals Admin</h1>
           <p className="text-xs text-slate-500 mt-1">v1.0.0 • VG Digital</p>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on mobile click
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area (Pinned to Bottom) */}
        <div className="p-4 border-t border-slate-800 shrink-0 bg-[#0F172A]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </main>

    </div>
  );
}