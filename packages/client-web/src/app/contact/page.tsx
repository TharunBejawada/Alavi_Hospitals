import ContactForm from "../../components/contact/ContactForm";
import ContactHero from "../../components/contact/ContactHero";
import OurLocations from "../../components/contact/OurLocations";
import ContactInfo from "../../components/contact/ContactInfo";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alavi Hospitals IDPL, Chintal, Hyderabad | Multi-Specialty Care",
  description: "Alavi Hospitals in IDPL & Chintal, Hyderabad offers multi-specialty care with expert doctors, modern facilities & 24x7 emergency services. Visit us today.",
  keywords: "contact Alavi Hospitals, Alavi Hospitals address, hospital phone number IDPL Hyderabad, book appointment Alavi Hospitals, Alavi Hospitals Chintal, hospital in Chintal Hyderabad, best hospital Chintal, multi-specialty hospital Chintal Hyderabad, 24x7 emergency hospital Chintal",
  alternates: {
    canonical: "https://www.alavihospitals.in/contact",
  },
  openGraph: {
    title: "Alavi Hospitals IDPL & Chintal, Hyderabad | Multi-Specialty Care",
    description: "Multi-specialty care with expert doctors & 24x7 emergency services in IDPL & Chintal, Hyderabad.",
    url: "https://www.alavihospitals.in/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <ContactHero />
      <OurLocations />
      <ContactForm />
      <ContactInfo />
    </main>
  );
}