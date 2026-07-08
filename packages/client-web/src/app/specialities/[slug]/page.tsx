"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calendar, Phone, ChevronDown, CheckCircle2 } from "lucide-react";
import { API_URL } from "../../../config";
import AppointmentPopup from "../../../components/AppointmentPopup";

// --- TYPES ---
import type { SpecialityLandingPage, Doctor, BlogPost } from "../../../../../core/src/types";

// --- MOCK DATA FOR IMMEDIATE RENDERING ---
const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Hari Kishore', designation: 'Consultant Orthopedic Surgeon', qualification: 'MBBS, DNB Orthopedics', experience: '17+', image: '/doctor-1.png' },
  { id: '2', name: 'Dr. Hari Kishore', designation: 'Consultant Orthopedic Surgeon', qualification: 'MBBS, DNB Orthopedics', experience: '17+', image: '/doctor-1.png' },
  { id: '3', name: 'Dr. Hari Kishore', designation: 'Consultant Orthopedic Surgeon', qualification: 'MBBS, DNB Orthopedics', experience: '17+', image: '/doctor-1.png' },
];

const MOCK_BLOGS = [
  { id: '1', title: 'Why Does Your Blood Pressure Fluctuate? Common Causes Explained', date: 'Oct 12, 2023', image: '/blog-thumb-1.jpg' },
  { id: '2', title: 'Chest Pain: When Should You See a Cardiologist?', date: 'Oct 10, 2023', image: '/blog-thumb-2.jpg' },
  { id: '3', title: 'Knee Pain While Climbing Stairs? Here’s What It Could Mean', date: 'Oct 05, 2023', image: '/blog-thumb-3.jpg' },
  { id: '4', title: 'How Often Should Women Get Health Checkups?', date: 'Sep 28, 2023', image: '/blog-thumb-4.jpg' },
];

// --- SUB-COMPONENT: FAQ ITEM ---
const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="rounded-xl overflow-hidden mb-4 shadow-sm">
      {/* Question Bar */}
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center p-6 text-left bg-[#663399] transition-colors duration-300"
      >
        <span className="font-medium text-[21px] leading-none text-white pr-4">
          {question}
        </span>
        <ChevronDown className={`w-6 h-6 shrink-0 text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {/* Answer Area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white"
          >
            <div 
              className="p-6 text-[21px] font-medium leading-[160%] text-[#000000] border-x border-b border-gray-200 rounded-b-xl"
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SpecialityLandingPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [pageData, setPageData] = useState<SpecialityLandingPage | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const router = useRouter();
  
  // Section 6 Form State
  const [formData, setFormData] = useState({ name: "", mobile: "", concern: "" });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const handleSection6Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) return;

    setIsSubmittingForm(true);

    try {
      await axios.post(`${API_URL}/api/forms/submit`, {
        name: formData.name,
        mobile: formData.mobile,
        message: formData.concern ? `Concern: ${formData.concern}` : "No concern specified",
        speciality: pageData?.title || "Unknown Speciality",
        page: `Speciality Page - ${pageData?.title || "Unknown"}`
      });

      // Build the query string for the Thank You page
      const query = new URLSearchParams({
        name: formData.name,
        mobile: formData.mobile,
        department: pageData?.title || ""
      }).toString();

      // Redirect to Thank You page
      router.push(`/thank-you?${query}`);
      
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Something went wrong while booking. Please try again or call us directly.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // --- NEW: Carousel State & Refs ---
  const doctorsScrollRef = useRef<HTMLDivElement>(null);
  const [activeDoctorIndex, setActiveDoctorIndex] = useState(0);

  const handleDoctorScroll = () => {
    if (doctorsScrollRef.current) {
      const scrollLeft = doctorsScrollRef.current.scrollLeft;
      const cardWidth = doctorsScrollRef.current.children[0]?.clientWidth || 0;
      const gap = 32; // gap-8 equals 32px
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveDoctorIndex(index);
    }
  };

  const scrollToDoctor = (index: number) => {
    if (doctorsScrollRef.current) {
      const cardWidth = doctorsScrollRef.current.children[0]?.clientWidth || 0;
      const gap = 32;
      doctorsScrollRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      });
      setActiveDoctorIndex(index);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const pagesRes = await fetch(`${API_URL}/api/speciality-pages/getAll`);
        const pagesData = await pagesRes.json();
        
        const matchedPage = (pagesData.Items || []).find((p: SpecialityLandingPage) => {
          const savedUrl = p.seoConfig?.url || "";
          
          // Checks for:
          // 1. Exact match ("/specialities/orthopaedics" === "/specialities/orthopaedics")
          // 2. Raw slug match ("orthopaedics" === "orthopaedics")
          // 3. Fallback ID match
          return savedUrl === `/specialities/${slug}` || 
                 savedUrl === `/${slug}` || 
                 savedUrl === slug || 
                 p.pageId === slug;
        });

        if (matchedPage) {
          setPageData(matchedPage);

          // --- Dynamically fetch doctors and blogs by accurate Department Name ---
          try {
            // 1. Fetch all specialities to find the exact database name
            const specRes = await fetch(`${API_URL}/api/specialities/getAllEnabledSpecialities`);
            const specData = await specRes.json();
            
            const actualSpeciality = (specData.Items || []).find(
              (s: any) => s.specialityId === matchedPage.specialityId
            );

            if (actualSpeciality && actualSpeciality.specialityName) {
              const exactDepartmentName = actualSpeciality.specialityName;
              
              // 2. Fetch both Doctors and Blogs in parallel using the exact department string
              const [docsRes, blogsRes] = await Promise.all([
                fetch(`${API_URL}/api/doctors/getDoctorsByDepartment/${encodeURIComponent(exactDepartmentName)}`),
                fetch(`${API_URL}/api/blogs/getBlogsByDepartmentKeywords/${encodeURIComponent(exactDepartmentName)}`)
              ]);
              
              const docsData = await docsRes.json();
              const blogsData = await blogsRes.json();
              
              setDoctors(docsData.Items || []);
              setBlogs(blogsData.Items || []);
            }
          } catch (err) {
            console.error("Failed to fetch department data:", err);
          }
        }
      } catch (error) {
        console.error("Failed to fetch landing page data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#5B328C]" /></div>;
  if (!pageData) return <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">Page Not Found</div>;

  return (
    <div className="font-['Poppins'] min-h-screen bg-[#FAFAFA] pb-20">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative w-full h-[550px] md:h-[600px] lg:h-[650px] flex items-center">
        {/* 1. Base Background Color */}
        <div className="absolute inset-0 bg-[#663399] z-0"></div>

        {/* 2. Image Container (Constrained to the right side to prevent vertical cropping) */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[70%] lg:w-[60%] z-0">
          {pageData.bannerImage && (
            <Image 
              src={pageData.bannerImage} 
              alt={pageData.title} 
              fill 
              className="object-cover object-right" 
              priority 
            />
          )}
        </div>

        {/* 3. Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(90deg, #663399 48.93%, rgba(0, 102, 169, 0) 77.09%)' }}
        ></div>

        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32 relative z-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-xl text-white">
            <h1 className="text-3xl md:text-4xl lg:text-[46px] font-bold leading-tight mb-4">
              {pageData.title}
            </h1>
            <div 
              className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 prose prose-invert max-w-4xl"
              dangerouslySetInnerHTML={{ __html: pageData.description.replace(/&nbsp;/g, ' ') }}
            />
            <div className="flex flex-wrap gap-8">
              <button 
  onClick={() => {
    setIsPopupOpen(true);
  }}
  className="cursor-pointer bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-white hover:text-[#5B328C] transition-colors"
>
  <Calendar className="w-8 h-8" /> Book an Appointment
</button>
              <a href="tel:+919603911911">
                <button className="cursor-pointer bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors">
                  <Phone className="w-8 h-8" /> +91 9603 911 911
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. CONDITIONS TREATED --- */}
      {pageData.conditionsTreated?.list?.length > 0 && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32 text-center">
            
            {/* Section Title */}
            <h2 className="text-[32px] font-semibold leading-none text-[#663399] mb-4">
              {pageData.conditionsTreated.title}
            </h2>
            
            {/* Section Description */}
            <div 
              className="text-[21px] font-medium leading-none text-[#0C0200] max-w-3xl mx-auto mb-12"
              dangerouslySetInnerHTML={{ __html: pageData.conditionsTreated.description }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {pageData.conditionsTreated.list.map((item, index) => (
                
                <div 
                  key={index} 
                  className="group p-8 rounded-2xl border border-[#7E57A8] bg-[#EEF8FF] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-[linear-gradient(97.66deg,#0066A9_-66.74%,#7E57A8_128.58%)]"
                >
                  
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm bg-[#DCF1FF] group-hover:bg-[#EEF8FF] transition-colors duration-300">
                     {item.icon ? (
                       <Image src={item.icon} alt={item.title} width={32} height={32} className="object-contain" />
                     ) : (
                       <div className="w-8 h-8 bg-[#5B328C]/30 rounded-full"></div>
                     )}
                  </div>
                  
                  <h3 className="text-[21px] font-semibold leading-[156%] text-[#663399] group-hover:text-white transition-colors duration-300 mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-[14px] font-medium leading-[156%] text-[#0C0200] group-hover:text-white transition-colors duration-300">
                    {item.description}
                  </p>
                  
                </div>
              ))}
            </div>
            
            {pageData.conditionsTreated.list.length > 6 && (
              <button className="mt-10 bg-[#3B2A73] text-white px-8 py-2.5 rounded-full text-sm font-semibold shadow-md hover:bg-[#2b1f54] transition-colors">
                Show More
              </button>
            )}
            
          </div>
        </section>
      )}

      {/* --- 3. DOCTORS SECTION --- */}
      {doctors.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32 text-center">
            
            <h2 className="font-semibold text-[32px] leading-[48px] text-[#663399] mb-4">
              {pageData.specialityDoctors?.title || "Our Specialists"}
            </h2>
            
            <p className="font-medium text-[21px] leading-[32px] text-[#0C0200] max-w-5xl mx-auto mb-16">
              {pageData.specialityDoctors?.description}
            </p>

            <div className="relative w-full max-w-7xl mx-auto">
              
              {/* Dynamic Container: Grid for <= 3, Slider for > 3 */}
              <div 
                ref={doctorsScrollRef}
                onScroll={handleDoctorScroll}
                className={`flex ${
                  doctors.length <= 3 
                    ? "flex-wrap justify-center" 
                    : "overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4"
                } gap-8`}
              >
                {doctors.map((doc, idx) => {
                  const designationText = doc.designations && doc.designations.length > 0 
                    ? doc.designations.join(" | ") 
                    : doc.designation;

                  return (
                    <div 
                      key={doc.doctorId || idx} 
                      className={`${
                        doctors.length <= 3 
                          ? "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] max-w-[420px]" 
                          : "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] shrink-0 snap-center"
                      } bg-[#F4FAFF] border-2 border-[#663399] rounded-[27px] flex flex-col p-5 pb-6 shadow-sm hover:shadow-lg transition-all duration-300`}
                    >
                      
                      {/* Image Container */}
                      <div className="relative w-full aspect-[4/3] bg-[#E8F4FA] rounded-[19px] border-2 border-[#663399] overflow-hidden mb-6 flex items-center justify-center">
                         {doc.experience && (
                           <div className="absolute top-4 left-4 bg-[#0066A9] shadow-[0px_1px_1.8px_#C3C3C3] rounded-[9px] px-3 py-1 z-10 flex items-center gap-1.5">
                             <span className="font-bold text-[24px] leading-[160%] text-white">{doc.experience}</span>
                             <div className="flex flex-col items-start justify-center">
                               <span className="font-semibold text-[10px] leading-[100%] text-white mb-0.5">Years</span>
                               <span className="font-semibold text-[8px] leading-[100%] text-white">Experience</span>
                             </div>
                           </div>
                         )}
                         
                         {doc.image ? (
                           <Image src={doc.image} alt={doc.name} fill className="object-cover object-top" />
                         ) : (
                           <span className="text-[#5B328C] font-semibold opacity-50 text-lg">No Image</span>
                         )}
                      </div>
                      
                      <div className="flex-grow flex flex-col items-center text-center">
                        <h3 className="font-bold text-[26px] leading-[160%] text-[#2A255B]">{doc.name}</h3>
                        <div className="w-[151px] border-t-2 border-[#2A255B] my-1"></div>
                        <p className="font-medium text-[14px] leading-[180%] text-[#0C0200] mt-1 line-clamp-2">{designationText}</p>
                        <p className="font-medium text-[16px] leading-[180%] text-[#0C0200] mb-8">{doc.qualification}</p>
                        
                        {/* Buttons Group */}
                        <div className="flex gap-3 mt-auto w-full px-1">
                          <Link href={`/doctors/${doc.url || doc.doctorId}`} className="flex-[3]">
                            <button className="w-full bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)] text-white font-medium text-[12px] leading-[160%] py-3 rounded-[20px] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm">
                              <Calendar className="w-4 h-4" /> Book an Appointment
                            </button>
                          </Link>
                          <a href="tel:+919603911911" className="flex-[2]">
                            <button className="w-full bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)] text-white font-medium text-[12px] leading-[160%] py-3 rounded-[20px] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm">
                              <Phone className="w-4 h-4" /> Call Now
                            </button>
                          </a>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Slider Dots (Only shows if > 3 doctors) */}
              {doctors.length > 3 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                  {doctors.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToDoctor(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        activeDoctorIndex === idx 
                          ? "w-4 h-4 bg-[#663399]" 
                          : "w-3 h-3 bg-gray-300 hover:bg-[#7E57A8]"
                      }`}
                      aria-label={`Go to doctor ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
      )}


      {/* --- 4. TREATMENTS & PROCEDURES --- */}
      {(pageData.treatmentsProcedures?.list?.length || 0) > 0 && (
        <section className="py-20 bg-[#F5F8FC]">
          <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32 text-center">
            
            {/* Section Title */}
            <h2 className="text-[32px] font-semibold leading-none text-[#663399] mb-4">
              {pageData.treatmentsProcedures.title}
            </h2>
            
            {/* Section Description */}
            <div 
              className="text-[21px] font-medium leading-none text-[#0C0200] max-w-3xl mx-auto mb-12 text-center"
              dangerouslySetInnerHTML={{ __html: pageData.treatmentsProcedures.description.replace(/&nbsp;/g, ' ') }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 text-left">
              {pageData.treatmentsProcedures.list.map((item, index) => (
                <div 
                  key={index} 
                  className={`p-8 rounded-2xl flex flex-col justify-center ${
                    index === 0 
                      ? 'md:col-span-1 md:row-span-2 bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)] shadow-md'
                      : 'md:col-span-1 md:row-span-1 bg-[#EEF8FF] shadow-[0px_0px_4px_0px_#00000040]'
                  }`}
                >
                  {/* Card Title */}
                  <h3 className={`font-semibold leading-[156%] mb-3 ${
                    index === 0 ? 'text-[26px] text-white' : 'text-[21px] text-[#663399]'
                  }`}>
                    {item.title}
                  </h3>
                  
                  {/* Card Description */}
                  <p className={`font-normal leading-[156%] ${
                    index === 0 ? 'text-[18px] text-white' : 'text-[16px] text-[#000000]'
                  }`}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            
          </div>
        </section>
      )}

      {/* --- 5. BLOGS SECTION --- */}
      {blogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32">
            
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="font-semibold text-[32px] leading-[48px] text-[#663399] mb-4">
                Blogs
              </h2>
              <p className="font-medium text-[21px] leading-[32px] text-[#0C0200] max-w-[1035px] mx-auto">
                Discover expert-led articles on health conditions, treatments and wellness to help you make confident decisions.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Featured Blog (Left Side) -> Takes blogs[0] */}
              <Link 
                href={`/blog/${blogs[0].url || blogs[0].blogId}`} 
                className="w-full lg:w-[56%] bg-[#663399] rounded-[24px] overflow-hidden flex flex-col shadow-md group cursor-pointer transition-transform hover:-translate-y-1 duration-300"
              >
                {/* Featured Image Container */}
                <div className="relative w-auto aspect-[11/5] bg-[#D9D9D9] overflow-hidden m-6 mb-0 rounded-[16px] w-[calc(100%-48px)] flex items-center justify-center">
                   {blogs[0].blogImage ? (
                     <Image 
                       src={blogs[0].blogImage} 
                       alt={blogs[0].blogTitle || "Featured Blog"} 
                       fill 
                       className="object-cover group-hover:scale-105 transition-transform duration-700" 
                     />
                   ) : (
                     <span className="text-[#663399] font-medium opacity-50">No Image</span>
                   )}
                </div>
                
                {/* Featured Content */}
                <div className="p-6 md:p-8 text-white flex flex-col flex-grow justify-center">
                   <h3 className="font-bold text-[24px] leading-[150%] mb-3 group-hover:text-[#EEF8FF] transition-colors line-clamp-2">
                     {blogs[0].blogTitle}
                   </h3>
                   {/* Uses metaDescription first, falls back to stripping HTML from extraFields */}
                   <p className="font-normal text-[16px] leading-[160%] text-white/90 line-clamp-3">
                     {blogs[0].metaDescription || blogs[0].extraFields?.[0]?.description?.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') || "Click to read more about this topic."}
                   </p>
                </div>
              </Link>

              {/* List Blogs (Right Side) -> Takes blogs.slice(1) */}
              <div className="w-full lg:w-[44%] bg-[rgba(217,217,217,0.25)] rounded-[24px] p-6 lg:p-8 flex flex-col h-full relative">
                 
                 {/* View All Button */}
                 <div className="absolute top-6 right-6 z-10">
                   <Link href="/blog">
                     <button className="bg-[#663399] text-white text-[14px] font-semibold px-6 py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                       View All
                     </button>
                   </Link>
                 </div>
                 
                 {/* Scrollable List OR Empty State */}
                 {blogs.length > 1 ? (
                   <div className="flex flex-col gap-6 pt-14 h-full overflow-y-auto pr-2 custom-scrollbar">
                      {blogs.slice(1).map((blog, idx) => (
                        <Link 
                          href={`/blog/${blog.url || blog.blogId}`} 
                          key={blog.blogId || idx} 
                          className="flex gap-5 items-center group cursor-pointer"
                        >
                           {/* Blog Thumbnail Box */}
                           <div className="w-[120px] h-[80px] md:w-[140px] md:h-[90px] relative rounded-[12px] bg-[#663399] shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
                              {blog.blogImage ? (
                                <Image src={blog.blogImage} alt={blog.blogTitle || "Blog thumbnail"} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                              ) : (
                                <span className="text-white text-[10px] opacity-50">No Image</span>
                              )}
                           </div>
                           
                           {/* Blog Title */}
                           <div>
                             <h4 className="font-semibold text-[16px] leading-[150%] text-[#0C0200] group-hover:text-[#663399] transition-colors pr-2 line-clamp-3">
                               {blog.blogTitle}
                             </h4>
                           </div>
                        </Link>
                      ))}
                   </div>
                 ) : (
                   /* Fallback when only 1 blog exists to maintain the 56/44 structural layout */
                   <div className="flex flex-col items-center justify-center h-full pt-14 text-[#663399]/60 font-medium text-center px-4">
                      <p>More expert articles for this specialty are coming soon.</p>
                   </div>
                 )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* --- 6. APPOINTMENT CTA SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32">
          <div className="flex flex-col lg:flex-row shadow-xl rounded-[32px] overflow-hidden border-0 bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)]">
            
            {/* Left Purple Side */}
            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center text-white relative">
               
               {/* Badge */}
               <div className="bg-[rgba(231,216,245,0.21)] w-fit px-5 py-2.5 rounded-[22px] flex items-center gap-2 mb-8">
                 <Calendar className="w-4 h-4 text-white" /> 
                 <span className="font-semibold text-[14px] leading-[21px] text-white">Book an Appointment</span>
               </div>
               
               <h2 className="font-semibold text-[32px] leading-[48px] text-white mb-6">
                 Take the first step toward<br/>a pain-free life.
               </h2>
               
               <p className="font-medium text-[16px] leading-[170%] text-white mb-10 max-w-md">
                 Share your details and our care team will reach out to confirm your consultation with a specialist.
               </p>
               
               <ul className="space-y-5 mb-8">
                 {['Same-day appointments available', 'Insurance & cashless support', 'Seamless patient support services'].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 font-medium text-[14px] leading-[170%] text-white">
                     <div className="w-[9px] h-[9px] bg-white rounded-full shrink-0"></div> {item}
                   </li>
                 ))}
               </ul>

               <hr className="border-[rgba(220,241,255,0.55)]" />
            </div>

            {/* Right Form Side */}
            <div className="lg:w-1/2 bg-[#EEF8FF] p-10 lg:p-16 flex flex-col justify-center">
               <h3 className="font-semibold text-[24px] leading-[36px] text-[#663399] mb-2">Patient Details</h3>
               <p className="font-medium text-[16px] leading-[170%] text-[#000000] mb-8">
                 Share your details and our care team will reach out to confirm your consultation with a specialist.
               </p>
               
               <form className="space-y-6" onSubmit={handleSection6Submit}>
                 <div>
                   <label className="block font-semibold text-[16px] leading-[24px] text-[#250F3C] mb-2 ml-4">Patient Name*</label>
                   <input 
                     type="text" 
                     required
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     placeholder="Enter Your Full Name" 
                     className="w-full bg-white px-6 py-4 rounded-[30px] shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#5B328C]/50 transition-all text-[#250F3C] placeholder:font-medium placeholder:text-[12px] placeholder:text-[#807090] placeholder:opacity-50" 
                   />
                 </div>
                 <div>
                   <label className="block font-semibold text-[16px] leading-[24px] text-[#250F3C] mb-2 ml-4">Mobile Number*</label>
                   <input 
                     type="tel" 
                     required
                     value={formData.mobile}
                     onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                     placeholder="10 - digit mobile number" 
                     className="w-full bg-white px-6 py-4 rounded-[30px] shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#5B328C]/50 transition-all text-[#250F3C] placeholder:font-medium placeholder:text-[12px] placeholder:text-[#807090] placeholder:opacity-50" 
                   />
                 </div>
                 <div>
                   <label className="block font-semibold text-[16px] leading-[24px] text-[#250F3C] mb-2 ml-4">Concern</label>
                   <input 
                     type="text" 
                     value={formData.concern}
                     onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                     placeholder="Define" 
                     className="w-full bg-white px-6 py-4 rounded-[30px] shadow-[0px_0px_4px_-1px_rgba(0,0,0,0.25)] outline-none focus:ring-2 focus:ring-[#5B328C]/50 transition-all text-[#250F3C] placeholder:font-medium placeholder:text-[12px] placeholder:text-[#807090] placeholder:opacity-50" 
                   />
                 </div>
                 
                 <div className="pt-2">
                   <button 
                     type="submit"
                     disabled={isSubmittingForm || !formData.name || !formData.mobile}
                     className="cursor-pointer mx-auto w-full md:w-auto bg-[linear-gradient(90deg,#0066A9_0%,#663399_100%)] text-white font-semibold text-[21px] leading-[32px] py-3.5 px-10 rounded-[32px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isSubmittingForm ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                       </>
                     ) : (
                       <>
                         <Calendar className="w-5 h-5" /> Book an Appointment
                       </>
                     )}
                   </button>
                 </div>
               </form>
            </div>
            
          </div>
        </div>
      </section>

      {/* --- 7. FAQS --- */}
      {(pageData.faqs?.length || 0) > 0 && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32">
            
            {/* Section Heading */}
            <h2 className="text-[32px] font-semibold leading-none text-center text-[#663399] mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {pageData.faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer.replace(/&nbsp;/g, ' ')} 
                  isOpen={openFaq === index} 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                />
              ))}
            </div>
            
          </div>
        </section>
      )}

      {/* Custom Scrollbar CSS for Blog List and Doctor Carousel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <AppointmentPopup 
  isOpen={isPopupOpen} 
  onClose={() => setIsPopupOpen(false)} 
/>

    </div>
  );
}