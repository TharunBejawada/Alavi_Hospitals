import DoctorProfileClient from "../../../components/doctors/DoctorProfileClient";
import axios from "axios";
import { API_URL } from "../../../config";

export default async function DoctorProfilePage({ params }: { params: { url: string } }) {
  // 1. Fetch Doctor Data Server-Side (Great for SEO)
  let doctorData = null;
  
  try {
    // Assuming you have the getDoctorByUrl endpoint set up as discussed earlier
    const res = await axios.get(`${API_URL}/api/doctors/getDoctorByUrl/${params.url}`);
    doctorData = res.data.Item;
  } catch (error) {
    console.error("Failed to fetch doctor details.");
  }

  // 2. Handle 404
  if (!doctorData) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl">Doctor Not Found</div>;
  }

  // 3. Pass data to the Client Component
  return <DoctorProfileClient doctor={doctorData} />;
}