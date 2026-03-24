"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { API_URL } from "../../../config";

export default function BlogsList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs/getAllBlogs`);
        const data = await response.json();
        setBlogs(data.Items || []);
      } catch (err) {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Blogs</h1>
        <button
          onClick={() => router.push("/admin/blogs/add")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-bold shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add Blog
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-slate-500 mt-8">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.blogId}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer group"
              onClick={() => router.push(`/admin/blogs/${blog.blogId}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.blogImage || "https://placehold.co/600x400"}
                  alt={blog.blogTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                 <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{blog.blogTitle}</h3>
                    {blog.enabled ? (
                        <span className="w-3 h-3 bg-green-500 rounded-full shrink-0 mt-1.5" title="Enabled"></span>
                    ) : (
                        <span className="w-3 h-3 bg-red-500 rounded-full shrink-0 mt-1.5" title="Disabled"></span>
                    )}
                 </div>
                 <p className="text-sm text-slate-500 mt-2">{blog.timeline}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}