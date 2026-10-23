import { cache } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { API_URL } from "../../../config";
import BlogDetailClient from "../../../components/blog/BlogDetailClient";

interface BlogPost {
  blogTitle: string;
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  enabled?: boolean | string;
}

// Deduped per-request: generateMetadata and the page both call this with the
// same slug, and React's cache() collapses them into a single network call.
const fetchBlog = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const res = await fetch(`${API_URL}/api/blogs/getBlogByUrl/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.Item || data || null;
    if (!item || item.enabled === false || item.enabled === "false") return null;
    return item;
  } catch (error) {
    console.error("Failed to fetch blog details.");
    return null;
  }
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await fetchBlog(params.slug);
  if (!blog) return {};

  const title = blog.seoTitle || blog.blogTitle;
  const description = blog.metaDescription || undefined;
  const keywords = blog.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const blog = await fetchBlog(params.slug);
  if (!blog) {
    redirect("/");
  }

  return <BlogDetailClient slug={params.slug} />;
}
