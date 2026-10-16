import { Metadata } from "next";
import BioMedicalWastePublic from "../../components/biomedical-waste/BioMedicalWastePublic";

export const metadata: Metadata = {
  title: "Bio Medical Wastage Reports | Alavi Hospitals Hyderabad",
  description:
    "Official daily and monthly bio-medical waste disposal reports for Alavi Hospitals IDPL and Chintal branches in compliance with Bio-Medical Waste Management Rules.",
  keywords:
    "bio medical waste report, Alavi Hospitals biomedical waste, hospital waste disposal Hyderabad, IDPL hospital biomedical waste, Chintal hospital waste report, BMW compliance",
  alternates: {
    canonical: "https://www.alavihospitals.in/biomedical-waste",
  },
  openGraph: {
    title: "Bio Medical Wastage Reports | Alavi Hospitals Hyderabad",
    description:
      "Official daily and monthly bio-medical waste disposal records for Alavi Hospitals IDPL and Chintal branches.",
    url: "https://www.alavihospitals.in/biomedical-waste",
    type: "website",
  },
};

export default function BioMedicalWastePage() {
  return <BioMedicalWastePublic />;
}
