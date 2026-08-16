import axios from "axios";
import { API_URL } from "../../../config";
import TreatmentDetailClient from "../../../components/treatments/TreatmentDetailClient";
import type { Treatment } from "../../../../../core/src/types";

export default async function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  let treatment: Treatment | null = null;

  try {
    const res = await axios.get(`${API_URL}/api/treatments/getByUrl/${params.slug}`);
    treatment = res.data.Item;
  } catch (error) {
    console.error("Failed to fetch treatment details.");
  }

  if (!treatment || !treatment.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return <TreatmentDetailClient treatment={treatment} />;
}
