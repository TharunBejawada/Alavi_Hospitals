import { cache } from "react";
import type { Metadata } from "next";
import axios from "axios";
import { API_URL } from "../../../config";
import SecondOpinionDetailClient from "../../../components/second-opinion/SecondOpinionDetailClient";
import type { SecondOpinionTopic } from "../../../../../core/src/types";

// Deduped per-request: generateMetadata and the page both call this with the
// same slug, and React's cache() collapses them into a single network call.
const fetchTopic = cache(async (slug: string): Promise<SecondOpinionTopic | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/second-opinions/getByUrl/${slug}`);
    return res.data.Item;
  } catch (error) {
    console.error("Failed to fetch Second Opinion topic.");
    return null;
  }
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topic = await fetchTopic(params.slug);
  if (!topic || !topic.enabled) return {};

  const title = topic.seoConfig?.title || topic.title;
  const description = topic.seoConfig?.metaDescription || undefined;
  const keywords = topic.seoConfig?.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function SecondOpinionDetailPage({ params }: { params: { slug: string } }) {
  const topic = await fetchTopic(params.slug);

  if (!topic || !topic.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return <SecondOpinionDetailClient topic={topic} />;
}
