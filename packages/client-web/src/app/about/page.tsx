import AboutHero from "../../components/about/AboutHero";
import AboutIntro from "../../components/about/AboutIntro";
import Leadership from "../../components/about/Leadership";
import VisionMission from "../../components/about/VisionMission";
import CoreValues from "../../components/about/CoreValues";
import AboutConclusion from "../../components/about/AboutConclusion";

export const metadata = {
  title: "Best MultiSpeciality Hospital in IDPL, Hyderabad",
  description: "Discover the best multi-speciality doctor at Alavi Hospitals in IDPL, Hyderabad. Offering expert care across various specialties for all your health needs.",
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