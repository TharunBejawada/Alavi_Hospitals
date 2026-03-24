"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, X, UploadCloud, Type, Calendar, User, Hash, Globe, Search, Loader2 } from "lucide-react";
import RichTextEditor from "../../../../../components/admin/RichTextEditor";
import { API_URL } from "../../../../../config";

export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params for Next.js 15+
  const { id } = use(params);
  
  const router = useRouter();
  
  // States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [blog, setBlog] = useState({
    blogImage: "",
    blogTitle: "",
    categories: [] as string[],
    tags: [] as { name: string }[],
    author: "",
    timeline: "",
    extraFields: [] as { heading: string; description: string }[],
    seoTitle: "",
    metaDescription: "",
    metaKeywords: "",
    url: "",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/getBlogbyId/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (data.Item) {
            setBlog(data.Item);
            // Set initial preview if image exists
            if (data.Item.blogImage) {
                setImagePreview(data.Item.blogImage);
            }
        }
      } catch (err) {
        console.error(err);
        alert("Could not load blog details.");
        router.push("/admin/blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, [id, router]);

  // --- 2. HANDLERS ---
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Show local preview immediately
    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);
    
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(`${API_URL}/api/blogs/uploadblogImage`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        setBlog(prev => ({ ...prev, blogImage: data.imageUrl }));

    } catch (error) {
        console.error("Image upload error:", error);
        alert("Failed to upload image.");
        setImagePreview(blog.blogImage); // Revert to old image on fail
    } finally {
        setIsUploading(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && !blog.categories.includes(categoryInput)) {
      setBlog({ ...blog, categories: [...blog.categories, categoryInput.trim()] });
      setCategoryInput("");
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setBlog({ ...blog, tags: [...blog.tags, { name: tagInput.trim() }] });
      setTagInput("");
    }
  };

  const addExtraField = () => {
    setBlog({ ...blog, extraFields: [...blog.extraFields, { heading: "", description: "" }] });
  };

  const updateExtraField = (index: number, field: string, value: string) => {
    const updated = [...blog.extraFields];
    // @ts-ignore
    updated[index][field] = value;
    setBlog({ ...blog, extraFields: updated });
  };

  const removeExtraField = (index: number) => {
    if(confirm("Are you sure you want to remove this section?")) {
        const updated = blog.extraFields.filter((_, i) => i !== index);
        setBlog({ ...blog, extraFields: updated });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // NOTE: Changed to PUT for updates
      const res = await fetch(`${API_URL}/api/blogs/updateBlog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      
      if (res.ok) {
          router.push("/admin/blogs");
      } else {
          alert("Failed to update blog");
      }
    } catch (err) {
      console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  // Styles
  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 placeholder:text-slate-400";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide";

  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Blogs</span>
        </button>
        <div className="flex gap-3">
             <button type="button" onClick={() => router.push("/admin/blogs")} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition">Cancel</button>
             <button 
                onClick={handleSubmit} 
                disabled={isSubmitting || isUploading} 
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-70"
             >
                 {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Updating...</> : "Update Blog"}
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Main Content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-500" /> Basic Information
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}>Blog Title</label>
                        <input 
                            className={`${inputClass} text-lg font-medium`} 
                            placeholder="Enter a descriptive title..." 
                            value={blog.blogTitle} 
                            onChange={e => setBlog({...blog, blogTitle: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Author Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    className={`${inputClass} pl-10`} 
                                    placeholder="e.g. Alavi Hospitals" 
                                    value={blog.author} 
                                    onChange={e => setBlog({...blog, author: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Publish Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="date" 
                                    className={`${inputClass} pl-10`} 
                                    value={blog.timeline} 
                                    onChange={e => setBlog({...blog, timeline: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Content Sections (Dynamic) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Content Sections</h2>
                </div>

                {blog.extraFields.length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                        <p className="text-slate-500 mb-4">No content sections yet.</p>
                        <button type="button" onClick={addExtraField} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:border-blue-500 hover:text-blue-500 transition">
                            <Plus className="w-4 h-4 inline mr-2" /> Add Section
                        </button>
                    </div>
                )}

                {blog.extraFields.map((field, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">Section {index + 1}</span>
                            <button type="button" onClick={() => removeExtraField(index)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase hover:underline">
                                Remove
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">SECTION HEADING</label>
                                <input 
                                    className={inputClass} 
                                    placeholder="e.g. Symptoms, Diagnosis, Treatment..." 
                                    value={field.heading} 
                                    onChange={(e) => updateExtraField(index, 'heading', e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">CONTENT</label>
                                <RichTextEditor 
                                    value={field.description} 
                                    onChange={(val) => updateExtraField(index, 'description', val)} 
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={addExtraField} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Add Another Section
                </button>
            </div>
        </div>

        {/* RIGHT COLUMN - Sidebar Settings */}
        <div className="space-y-8">

             {/* 3. Featured Image */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-blue-500" /> Featured Image
                </h2>
                <div className="relative group cursor-pointer">
                    <input type="file" id="upload" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    <label htmlFor="upload" className={`
                        flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all relative overflow-hidden
                        ${imagePreview ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
                    `}>
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                                <span className="text-sm font-bold text-blue-600">Uploading...</span>
                            </div>
                        )}
                        
                        {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                        ) : (
                            <div className="text-center p-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-slate-600">Click to upload</span>
                                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                    </label>
                    {imagePreview && !isUploading && (
                        <button 
                            type="button" 
                            onClick={(e) => {
                                e.preventDefault(); 
                                setImagePreview(null); 
                                setBlog({...blog, blogImage: ""});
                            }}
                            className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 opacity-0 group-hover:opacity-100 transition z-20"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* 4. Categorization */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-500" /> Categorization
                </h2>
                
                {/* Categories */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Categories</label>
                    <div className="flex gap-2 mb-3">
                        <input 
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                            placeholder="Add category..." 
                            value={categoryInput} 
                            onChange={e => setCategoryInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                        />
                        <button type="button" onClick={addCategory} className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {blog.categories.map(cat => (
                            <span key={cat} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                {cat} <button type="button" onClick={() => setBlog({...blog, categories: blog.categories.filter(c => c !== cat)})} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Tags</label>
                    <div className="flex gap-2 mb-3">
                        <input 
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
                            placeholder="Add tag..." 
                            value={tagInput} 
                            onChange={e => setTagInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <button type="button" onClick={addTag} className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {blog.tags.map(tag => (
                            <span key={tag.name} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                #{tag.name} <button type="button" onClick={() => setBlog({...blog, tags: blog.tags.filter(t => t.name !== tag.name)})} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" /> SEO Settings
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">SEO TITLE</label>
                        <input 
                            className={inputClass} 
                            value={blog.seoTitle} 
                            onChange={e => setBlog({...blog, seoTitle: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">URL SLUG</label>
                        <div className="flex items-center">
                            <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 px-3 py-3 rounded-l-lg text-sm">/blog/</span>
                            <input 
                                className={`${inputClass} rounded-l-none`} 
                                value={blog.url} 
                                onChange={e => setBlog({...blog, url: e.target.value})} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">META DESCRIPTION</label>
                        <textarea 
                            rows={3}
                            className={inputClass} 
                            value={blog.metaDescription} 
                            onChange={e => setBlog({...blog, metaDescription: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">KEYWORDS</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input 
                                className={`${inputClass} pl-10`} 
                                value={blog.metaKeywords} 
                                onChange={e => setBlog({...blog, metaKeywords: e.target.value})} 
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}