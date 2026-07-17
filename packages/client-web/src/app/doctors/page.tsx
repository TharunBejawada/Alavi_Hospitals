import DoctorListUser from "../../components/doctors/DoctorListUser"; // Adjust path as necessary

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Doctors | Expert Medical Team - Alavi Hospitals",
  description: "Meet the expert doctors at Alavi Hospitals, IDPL, Hyderabad. Experienced specialists across multiple departments committed to quality patient care.",
  keywords: "doctors at Alavi Hospitals, best doctors IDPL Hyderabad, specialist doctors Hyderabad, medical team Alavi Hospitals",
  alternates: {
    canonical: "https://www.alavihospitals.in/doctors",
  },
  openGraph: {
    title: "Our Doctors | Expert Medical Team - Alavi Hospitals",
    description: "Experienced specialist doctors at Alavi Hospitals, IDPL, Hyderabad.",
    url: "https://www.alavihospitals.in/doctors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function DoctorsPage() {
  return <DoctorListUser />;
}