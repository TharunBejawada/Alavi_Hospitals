import ActionGrid from "../components/home/ActionGrid";
import Hero from "../components/home/Hero";
import { Metadata } from "next";
import Specialties from "../components/home/Specialties";
import DoctorTalks from "../components/home/DoctorTalks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Blogs from "../components/home/Blogs";
import HospitalsAndFAQ from "../components/home/HospitalsAndFAQ";


export const metadata: Metadata = {
  title: "Best Multispeciality Hospital in IDPL, Chintal | Alavi Hospitals",
  description: "Alavi Hospitals in IDPL,Chintal Hyderabad, is the best multispeciality hospital offering world-class healthcare services with expert doctors, advanced treatments, and compassionate care",
  keywords: ["Multispeciality Hospital IDPL", "Chintal Hyderabad", "Top Healthcare Services in chintal", "Best Hospital in quthbullapur", "Best Healthcare Services near me", "Cardiology hospital", "Neurology doctor", "Orthopedic Treatments", "Pediatric Care", "24/7 Emergency Care", "Maternity and Child Care", "Diagnostic Services near me", "Healthcare Services in IDPL", "Hyderabad"],
  
  // Robots
  robots: {
    index: true,
    follow: true,
  },

  // Verification
  verification: {
    google: "scztKMUE8-nr2Qf6dxnsby90Sk_vkos17Q8f3-Chbw8",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ActionGrid />
      <Specialties />
      <WhyChooseUs />
      <DoctorTalks />
      <Blogs />
      <HospitalsAndFAQ />
    </div>
  );
}