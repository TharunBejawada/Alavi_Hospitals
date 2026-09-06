import { cache } from "react";
import type { Metadata } from "next";
import axios from "axios";
import { API_URL } from "../../../config";
import HealthPackageDetailClient from "../../../components/health-packages/HealthPackageDetailClient";
import type { HealthPackage } from "../../../../../core/src/types";

// Deduped per-request: generateMetadata and the page both call this with the
// same slug, and React's cache() collapses them into a single network call.
const fetchHealthPackage = cache(async (slug: string): Promise<HealthPackage | null> => {
  try {
    const res = await axios.get(`${API_URL}/api/health-packages/getByUrl/${slug}`);
    return res.data.Item;
  } catch (error) {
    console.error("Failed to fetch health package details.");
    return null;
  }
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const healthPackage = await fetchHealthPackage(params.slug);
  if (!healthPackage || !healthPackage.enabled) return {};

  const title = healthPackage.seoConfig?.title || healthPackage.pageTitle;
  const description = healthPackage.seoConfig?.metaDescription || undefined;
  const keywords = healthPackage.seoConfig?.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function HealthPackageDetailPage({ params }: { params: { slug: string } }) {
  const healthPackage = await fetchHealthPackage(params.slug);

  if (!healthPackage || !healthPackage.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return <HealthPackageDetailClient healthPackage={healthPackage} />;
}
