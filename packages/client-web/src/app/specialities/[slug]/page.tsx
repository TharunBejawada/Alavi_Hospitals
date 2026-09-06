import { cache } from "react";
import type { Metadata } from "next";
import { API_URL } from "../../../config";
import SpecialityLandingClient from "../../../components/specialities/SpecialityLandingClient";
import type { SpecialityLandingPage } from "../../../../../core/src/types";

// Deduped per-request: generateMetadata and the page both call this with the
// same slug, and React's cache() collapses them into a single network call.
const fetchSpecialityPage = cache(async (slug: string): Promise<SpecialityLandingPage | null> => {
  try {
    const res = await fetch(`${API_URL}/api/speciality-pages/getAll`);
    const data = await res.json();

    const matchedPage = (data.Items || []).find((p: SpecialityLandingPage) => {
      const savedUrl = p.seoConfig?.url || "";
      return savedUrl === `/specialities/${slug}` ||
             savedUrl === `/${slug}` ||
             savedUrl === slug ||
             p.pageId === slug;
    });

    return matchedPage || null;
  } catch (error) {
    console.error("Failed to fetch speciality landing page.");
    return null;
  }
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const pageData = await fetchSpecialityPage(params.slug);
  if (!pageData) return {};

  const title = pageData.seoConfig?.title || pageData.title;
  const description = pageData.seoConfig?.metaDescription || undefined;
  const keywords = pageData.seoConfig?.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default function SpecialityLandingPageRoute({ params }: { params: { slug: string } }) {
  return <SpecialityLandingClient slug={params.slug} />;
}
