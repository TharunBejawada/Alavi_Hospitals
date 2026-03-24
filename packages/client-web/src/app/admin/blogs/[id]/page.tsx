"use client";

import { useState, useEffect, use } from "react"; // <--- Import 'use'
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, Edit, EyeOff, Eye, Calendar, User, 
  Hash, Globe, Tag, Clock, CheckCircle2, XCircle, Loader2 
} from "lucide-react";
import { API_URL } from "../../../../config";

// Define strict types for better safety
interface ExtraField {
  heading: string;
  description: string;
}

interface Tag {
  name: string;
}

interface BlogPost {
  blogId: string;
  blogImage: string;
  blogTitle: string;
  categories: string[];
  tags: Tag[];
  author: string;
  timeline: string;
  extraFields: ExtraField[];
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  url?: string;
  enabled: boolean;
}

// Update Props definition to be a Promise
export default function ViewBlog({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Use the unwrapped 'id' here
        const res = await fetch(`${API_URL}/api/blogs/getBlogbyId/${id}`);
        if (!res.ok) throw new Error("Failed to fetch blog");
        const data = await res.json();
        setBlog(data.Item);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]); // Dependency is now 'id'

  const toggleStatus = async () => {
    if (!blog) return;
    setIsToggling(true);
    try {
      const newStatus = !blog.enabled;
      // Use the unwrapped 'id' here
      const res = await fetch(`${API_URL}/api/blogs/${id}/toggle`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: newStatus })
      });
      if (res.ok) {
        setBlog({ ...blog, enabled: newStatus });
      }
    } catch (error) {
      console.error("Toggle failed", error);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
        <p>Loading blog details...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Blog Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "The requested blog post could not be loaded."}</p>
        <button onClick={() => router.push('/admin/blogs')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* HEADER Actions */}
      <div className="flex items-center justify-between mb-8">
         <button onClick={() => router.push('/admin/blogs')} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors group">
           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
           </div>
           <span className="font-medium">Back to List</span>
         </button>
         
         <div className="flex gap-3">
             <button 
                onClick={toggleStatus} 
                disabled={isToggling}
                className={`px-5 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 transition shadow-md
                  ${blog.enabled 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-green-600 hover:bg-green-700'
                  }`}
             >
                {isToggling ? <Loader2 className="w-4 h-4 animate-spin"/> : (
                  blog.enabled ? <><EyeOff className="w-4 h-4"/> Disable Blog</> : <><Eye className="w-4 h-4"/> Publish Blog</>
                )}
             </button>
             
             {/* Use 'id' in the route push */}
             <button 
                onClick={() => router.push(`/admin/blogs/${id}/edit`)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-md transition"
             >
                <Edit className="w-4 h-4" /> Edit Content
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN: Main Content */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Hero Image & Title */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="relative h-64 md:h-80 w-full bg-slate-100">
                  <img 
                    src={blog.blogImage || "https://placehold.co/1200x400?text=No+Image"} 
                    alt={blog.blogTitle}
                    className="w-full h-full object-cover" 
                  />
                  {/* Status Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    {blog.enabled ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> PUBLISHED
                      </span>
                    ) : (
                      <span className="bg-slate-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> DRAFT
                      </span>
                    )}
                  </div>
               </div>

               <div className="p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                    {blog.blogTitle}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 pb-6 border-b border-slate-100">
                     <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{blog.author || "Unknown Author"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{blog.timeline || "No Date"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">5 min read</span>
                     </div>
                  </div>

                  {/* Description / Extra Fields */}
                  <div className="mt-8 space-y-10">
                     {blog.extraFields && blog.extraFields.length > 0 ? (
                        blog.extraFields.map((field, idx) => (
                          <div key={idx} className="group">
                             <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 text-sm flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                {field.heading}
                             </h2>
                             {/* Tailwind Typography Plugin for Rich Text */}
                             <div 
                                className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: field.description }} 
                             />
                          </div>
                        ))
                     ) : (
                        <p className="text-slate-400 italic text-center py-8">No content sections added yet.</p>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: Sidebar Metadata */}
         <div className="space-y-6">
            
            {/* 2. Categorization Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-blue-500" /> Categories & Tags
               </h3>
               
               <div className="mb-6">
                  <p className="text-xs font-bold text-slate-400 mb-2">CATEGORIES</p>
                  <div className="flex flex-wrap gap-2">
                     {blog.categories && blog.categories.length > 0 ? (
                        blog.categories.map((cat, i) => (
                           <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-md text-xs font-bold">
                             {cat}
                           </span>
                        ))
                     ) : (
                        <span className="text-slate-400 text-sm italic">None</span>
                     )}
                  </div>
               </div>

               <div>
                  <p className="text-xs font-bold text-slate-400 mb-2">TAGS</p>
                  <div className="flex flex-wrap gap-2">
                     {blog.tags && blog.tags.length > 0 ? (
                        blog.tags.map((tag, i) => (
                           <span key={i} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                             <Tag className="w-3 h-3" /> {tag.name}
                           </span>
                        ))
                     ) : (
                        <span className="text-slate-400 text-sm italic">None</span>
                     )}
                  </div>
               </div>
            </div>

            {/* 3. SEO Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" /> SEO Preview
               </h3>
               
               <div className="space-y-4">
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">SEO TITLE</p>
                     <p className="text-sm text-slate-700 font-medium">{blog.seoTitle || blog.blogTitle}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">URL SLUG</p>
                     <p className="text-sm text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded inline-block">
                       /blog/{blog.url || "..."}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">META DESCRIPTION</p>
                     <p className="text-sm text-slate-600 leading-relaxed">
                       {blog.metaDescription || "No description set."}
                     </p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">KEYWORDS</p>
                     <p className="text-sm text-slate-600">
                       {blog.metaKeywords || "No keywords."}
                     </p>
                  </div>
               </div>
            </div>

            {/* 4. Status Card */}
            <div className={`rounded-xl shadow-sm border p-6 ${blog.enabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
               <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${blog.enabled ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                     {blog.enabled ? <CheckCircle2 className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
                  </div>
                  <div>
                     <h4 className={`font-bold ${blog.enabled ? 'text-green-800' : 'text-yellow-800'}`}>
                        {blog.enabled ? "Blog is Live" : "Hidden from Public"}
                     </h4>
                     <p className={`text-sm mt-1 ${blog.enabled ? 'text-green-700' : 'text-yellow-700'}`}>
                        {blog.enabled 
                          ? "This post is currently visible to all visitors on the main website." 
                          : "This post is currently saved as a draft and is not visible to visitors."
                        }
                     </p>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}