import AboutHero from "../../components/about/AboutHero";
import AboutIntro from "../../components/about/AboutIntro";
import Leadership from "../../components/about/Leadership";
import VisionMission from "../../components/about/VisionMission";
import CoreValues from "../../components/about/CoreValues";
import AboutConclusion from "../../components/about/AboutConclusion";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Top Hospitals in IDPL, Hyderabad - Alavi Hospitals",
  description: "Learn about Alavi Hospitals, a leading multi-specialty hospital in IDPL, Hyderabad. Discover our mission, expert doctors & world-class facilities.",
  keywords: "top hospitals in IDPL Hyderabad, best hospital IDPL, Alavi Hospitals about us, multi-specialty hospital Hyderabad",
  alternates: {
    canonical: "https://www.alavihospitals.in/about/",
  },
  openGraph: {
    title: "About Us | Top Hospital in IDPL, Hyderabad - Alavi Hospitals",
    description: "A leading multi-specialty hospital in IDPL, Hyderabad — our mission, doctors & facilities.",
    url: "https://www.alavihospitals.in/about/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <AboutHero/>
      <AboutIntro/>
      <Leadership/>
      <VisionMission/>
      <CoreValues/>
      <AboutConclusion/>
    </main>
  );
}