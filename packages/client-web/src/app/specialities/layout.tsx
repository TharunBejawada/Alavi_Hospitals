import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Specialities | Multi-Specialty Care - Alavi Hospitals",
  description: "Explore Alavi Hospitals' medical specialities in IDPL, Hyderabad — including cardiology, orthopedics, gynecology & more, backed by expert doctors.",
  keywords: "hospital specialities Hyderabad, medical departments IDPL, multi-specialty care Alavi Hospitals, best doctors Hyderabad",
  alternates: {
    canonical: "https://www.alavihospitals.in/specialities",
  },
  openGraph: {
    title: "Our Specialities | Multi-Specialty Care - Alavi Hospitals",
    description: "Medical specialities offered at Alavi Hospitals, IDPL, Hyderabad.",
    url: "https://www.alavihospitals.in/specialities",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SpecialitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}