import { cache } from "react";
import type { Metadata } from "next";
import DoctorProfileClient from "../../../components/doctors/DoctorProfileClient";
import axios from "axios";
import { API_URL } from "../../../config";

// Deduped per-request: generateMetadata and the page both call this with the
// same url, and React's cache() collapses them into a single network call.
const fetchDoctor = cache(async (url: string) => {
  try {
    const res = await axios.get(`${API_URL}/api/doctors/getDoctorByUrl/${url}`);
    return res.data.Item;
  } catch (error) {
    console.error("Failed to fetch doctor details.");
    return null;
  }
});

export async function generateMetadata({ params }: { params: { url: string } }): Promise<Metadata> {
  const doctor = await fetchDoctor(params.url);
  if (!doctor) return {};

  const title = doctor.seoTitle || doctor.name;
  const description = doctor.metaDescription || undefined;
  const keywords = doctor.metaKeywords || undefined;

  return {
    title,
    description,
    keywords,
    openGraph: { title, description },
  };
}

export default async function DoctorProfilePage({ params }: { params: { url: string } }) {
  // 1. Fetch Doctor Data Server-Side (Great for SEO)
  const doctorData = await fetchDoctor(params.url);

  // 2. Handle 404
  if (!doctorData) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl">Doctor Not Found</div>;
  }

  // 3. Pass data to the Client Component
  return <DoctorProfileClient doctor={doctorData} />;
}