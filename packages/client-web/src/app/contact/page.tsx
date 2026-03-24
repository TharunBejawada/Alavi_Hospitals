import ContactForm from "../../components/contact/ContactForm";
import ContactHero from "../../components/contact/ContactHero";
import OurLocations from "../../components/contact/OurLocations";
import ContactInfo from "../../components/contact/ContactInfo";

export const metadata = {
  title: "Alavi Hospitals – Best Multispecialty Hospital in IDPL",
  description: "Get in touch with Alavi Hospitals for appointments and inquiries.",
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