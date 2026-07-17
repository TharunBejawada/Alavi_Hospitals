import ActionGrid from "../components/home/ActionGrid";
import Hero from "../components/home/Hero";
import ChairmanMessage from "../components/home/ChairmanMessage";
import MeetSpecialists from "../components/home/MeetSpecialists";
import WhyTrustUs from "../components/home/WhyTrustUs";
import Specialties from "../components/home/Specialties";
import DoctorTalks from "../components/home/DoctorTalks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import PatientStories from "../components/home/PatientStories";
import Blogs from "../components/home/Blogs";
import HospitalsAndFAQ from "../components/home/HospitalsAndFAQ";
import CallToAction from "../components/home/CallToAction";


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      {/* <ActionGrid /> */}
      <ChairmanMessage />
      <Specialties />
      <MeetSpecialists />
      <WhyTrustUs />
      {/* <WhyChooseUs /> */}
      <DoctorTalks />
      <PatientStories />
      <Blogs />
      <HospitalsAndFAQ />
      <CallToAction />
    </div>
  );
}