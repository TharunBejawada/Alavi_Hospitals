import { cache } from "react";
import type { Metadata } from "next";
import axios from "axios";
import { API_URL } from "../../../config";
import TreatmentDetailClient from "../../../components/treatments/TreatmentDetailClient";
import type { Treatment } from "../../../../../core/src/types";

// Deduped per-request: generateMetadata and the page both call this with the
// same slug, and React's cache() collapses them into a single network call.
const fetchTreatment = cache(async (slug: string): Promise<Treatment | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/treatments/getByUrl/${slug}`);
    return res.data.Item;
  } catch (error) {
    console.error("Failed to fetch treatment details.");
    return null;
  }
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const treatment = await fetchTreatment(params.slug);
  if (!treatment || !treatment.enabled) return {};

  const title = treatment.seoConfig?.title || treatment.title;
  const description = treatment.seoConfig?.metaDescription || undefined;
  const keywords = treatment.seoConfig?.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  const treatment = await fetchTreatment(params.slug);

  if (!treatment || !treatment.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return <TreatmentDetailClient treatment={treatment} />;
}
