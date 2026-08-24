import axios from "axios";
import { API_URL } from "../../../config";
import SecondOpinionDetailClient from "../../../components/second-opinion/SecondOpinionDetailClient";
import type { SecondOpinionTopic } from "../../../../../core/src/types";

export default async function SecondOpinionDetailPage({ params }: { params: { slug: string } }) {
  let topic: SecondOpinionTopic | null = null;

  try {
    const res = await axios.get(`${API_URL}/api/second-opinions/getByUrl/${params.slug}`);
    topic = res.data.Item;
  } catch (error) {
    console.error("Failed to fetch Second Opinion topic.");
  }

  if (!topic || !topic.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return <SecondOpinionDetailClient topic={topic} />;
}
