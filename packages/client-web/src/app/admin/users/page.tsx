"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Plus, Search, Shield, Mail, User as UserIcon, CheckCircle2, 
  XCircle, Copy, AlertTriangle, MoreVertical, Trash2, Ban
} from "lucide-react";
import { API_URL } from "../../../config";

// Types
type UserRole = "ADMIN" | "EDITOR" | "DOCTOR";
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  lastLogin?: string;
}

export default function UserManagement() {
  // --- STATE ---
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdUserCreds, setCreatedUserCreds] = useState<{email: string, pass: string} | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "EDITOR" as UserRole });
  const [isCreating, setIsCreating] = useState(false);

  // Actions Dropdown State (Track which user ID has the menu open)
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // API Endpoint
  const API_URL1 = `${API_URL}/api/users`; 

  // --- 1. FETCH USERS ON MOUNT ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL1);
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      // Ensure we map the backend _id or userId to frontend 'id' if necessary
      // Assuming backend returns { success: true, data: [...] } or just [...]
      const userList = Array.isArray(data) ? data : (data.data || []);
      
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. FILTERING LOGIC ---
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // --- 3. CREATE USER HANDLER ---
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch(API_URL1, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser) 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }

      // Add new user to local state immediately
      const mappedUser = { ...data.user, id: data.user.userId || data.user.id };
      setUsers((prev) => [...prev, mappedUser]);
      
      setIsModalOpen(false);
      setCreatedUserCreds({
        email: newUser.email,
        pass: data.tempPassword 
      });
      setNewUser({ name: "", email: "", role: "EDITOR" });

    } catch (error: any) {
      console.error("Failed to create user", error);
      alert(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  // --- 4. DELETE USER HANDLER ---
  const handleDeleteUser = async (userId: string) => {
    if(!confirm("Are you sure you want to delete this user?")) return;

    try {
      // Assuming your API supports DELETE /api/users/:id
      // If not, you need to implement it in your backend functions
      const response = await fetch(`${API_URL1}/${userId}`, { method: 'DELETE' });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        setOpenActionId(null); // Close menu
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Password copied to clipboard!");
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenActionId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-500 mt-1">Manage team access and roles.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" /> Add New User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none cursor-pointer"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admins</option>
          <option value="DOCTOR">Doctors</option>
          <option value="EDITOR">Editors</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible"> 
        {/* overflow-visible needed for dropdowns to pop out if at bottom */}
        
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        user.role === 'DOCTOR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        user.status === 'ACTIVE' ? 'text-green-600' : 'text-slate-400'
                      }`}>
                        {user.status === 'ACTIVE' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {user.lastLogin || "Never"}
                    </td>
                    
                    {/* ACTION COLUMN */}
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle menu for this specific user
                          setOpenActionId(openActionId === user.id ? null : user.id);
                        }}
                        className="text-slate-400 hover:text-blue-600 transition p-2 rounded-full hover:bg-blue-50"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* DROPDOWN MENU */}
                      {openActionId === user.id && (
                        <div className="absolute right-8 top-10 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                          <button 
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            onClick={() => alert("Deactivate functionality to be implemented")}
                          >
                            <Ban className="w-4 h-4" /> Deactivate
                          </button>
                          <button 
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- CREATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Create New User</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition"><XCircle className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" required value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" required value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g. john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition text-slate-900"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="DOCTOR">Doctor</option>
                </select>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg flex gap-3 items-start text-xs text-yellow-800 border border-yellow-100">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>A temporary password will be generated automatically.</p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {isCreating ? "Generating..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {createdUserCreds && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-t-4 border-green-500">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">User Created!</h3>
              <p className="text-slate-500 mb-6">
                Please share these credentials securely. Password is shown only once.
              </p>

              <div className="bg-slate-100 rounded-xl p-4 text-left space-y-3 mb-6 border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Email</p>
                  <p className="font-mono text-slate-900">{createdUserCreds.email}</p>
                </div>
                <div className="relative">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Temporary Password</p>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 pl-3">
                    <p className="font-mono text-lg font-bold text-blue-600 tracking-wide">{createdUserCreds.pass}</p>
                    <button 
                      onClick={() => copyToClipboard(createdUserCreds.pass)}
                      className="p-2 hover:bg-slate-100 rounded text-slate-500 transition"
                      title="Copy Password"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCreatedUserCreds(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition"
              >
                I have copied the password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}