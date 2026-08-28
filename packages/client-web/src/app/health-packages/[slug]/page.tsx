import axios from "axios";
import { API_URL } from "../../../config";
import HealthPackageDetailClient from "../../../components/health-packages/HealthPackageDetailClient";
import type { HealthPackage } from "../../../../../core/src/types";

export default async function HealthPackageDetailPage({ params }: { params: { slug: string } }) {
  let healthPackage: HealthPackage | null = null;

  try {
    const res = await axios.get(`${API_URL}/api/health-packages/getByUrl/${params.slug}`);
    healthPackage = res.data.Item;
  } catch (error) {
    console.error("Failed to fetch health package details.");
  }

  if (!healthPackage || !healthPackage.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return <HealthPackageDetailClient healthPackage={healthPackage} />;
}
