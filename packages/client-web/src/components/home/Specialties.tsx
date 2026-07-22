"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCirclePlay } from "react-icons/fa6";

// --- STATIC DATA STRUCTURE (Ready for Dynamic Replacement) ---
const specialtiesData = [
  {
    id: "general-medicine",
    name: "General Medicine",
    description: "Comprehensive care for adults with a focus on early diagnosis, prevention, and effective treatment of everyday and long-term health conditions.",
    mainImage: "/specialties/general-medicine-main.png",
    features: [
      { title: "Diabetes &\nHypertension", image: "/specialties/diabetes-feat.png" },
      { title: "Thyroid & Chronic\nConditions", image: "/specialties/thyroid-feat.png" },
      { title: "Fever &\nInfections", image: "/specialties/fever-feat.png" },
    ],
    topProcedures: [
      "Liver & pancreatic disease care",
      "Stomach & gut related treatments",
      "Kidney & bladder disease management",
      "Diabetic foot care (non-healing ulcers)"
    ]
  },
  {
    id: "gynecology-obstetrics",
    name: "Gynecology & Obstetrics",
    description: "Expert care for women at every stage of life, from adolescence to pregnancy and menopause.",
    mainImage: "/specialties/gynecology-main.webp",
    features: [
      { title: "PCOS &\nMenstrual Disorders", image: "/specialties/pcos.webp" },
      { title: "Pregnancy\nCare", image: "/specialties/pcos-feat.webp" },
      { title: "Menopause\nManagement", image: "/specialties/menopause-feat.webp" },
    ],
    topProcedures: [
      "Antenatal & Postnatal Care",
      "Normal & Cesarean Deliveries",
      "Laparoscopic Gynecological Surgeries",
      "Infertility Evaluation"
    ]
  },
  {
    id: "pediatrics-neonatology",
    name: "Pediatrics & Neonatology",
    description: "Specialized healthcare for infants, children, and newborns with compassionate care.",
    mainImage: "/specialties/pediatrics-main.webp",
    features: [
      { title: "Childhood\nInfections", image: "/specialties/childhood-feat.webp" },
      { title: "Growth &\nDevelopment", image: "/specialties/growth-feat.webp" },
      { title: "Newborn\nCare", image: "/specialties/newborn-feat.webp" },
    ],
    topProcedures: [
      "Vaccination Programs",
      "Neonatal Care",
      "Pediatric Consultations",
      "Nutritional Guidance"
    ]
  },
  // {
  //   id: "functional-medicine-rheumatology",
  //   name: "Functional Medicine & Rheumatology",
  //   description: "Advanced care for autoimmune diseases, joint disorders, and chronic inflammatory conditions.",
  //   mainImage: "/specialties/rheumatology-main.jpg",
  //   features: [
  //     { title: "Arthritis\nCare", image: "/specialties/arthritis-feat.jpg" },
  //     { title: "Lupus\nManagement", image: "/specialties/lupus-feat.jpg" },
  //     { title: "Autoimmune\nDisorders", image: "/specialties/autoimmune-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Arthritis Management",
  //     "Autoimmune Disease Treatment",
  //     "Joint Pain Evaluation",
  //     "Lifestyle-Based Functional Care"
  //   ]
  // },
  {
    id: "neurology",
    name: "Neurology",
    description: "Comprehensive diagnosis and treatment of disorders affecting the brain, spine, and nerves.",
    mainImage: "/specialties/neurology-main.webp",
    features: [
      { title: "Stroke\nManagement", image: "/specialties/stroke-feat.webp" },
      { title: "Epilepsy\nCare", image: "/specialties/epilepsy-feat.webp" },
      { title: "Migraine &\nHeadaches", image: "/specialties/migraine-feat.webp" },
    ],
    topProcedures: [
      "Stroke Management",
      "EEG Evaluation",
      "Neurological Assessments",
      "Headache Management"
    ]
  },
  // {
  //   id: "neurosurgery",
  //   name: "Neurosurgery",
  //   description: "Advanced surgical solutions for brain, spine, and nervous system disorders.",
  //   mainImage: "/specialties/neurosurgery-main.jpg",
  //   features: [
  //     { title: "Brain\nTumors", image: "/specialties/braintumor-feat.jpg" },
  //     { title: "Spine\nDisorders", image: "/specialties/spine-feat.jpg" },
  //     { title: "Head\nInjuries", image: "/specialties/headinjury-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Brain Surgery",
  //     "Spine Surgery",
  //     "Trauma Management",
  //     "Minimally Invasive Procedures"
  //   ]
  // },
  {
    id: "orthopedics-sports-injury",
    name: "Orthopedics & Sports Injury",
    description: "Expert treatment for bone, joint, muscle, and sports-related injuries.",
    mainImage: "/specialties/orthopedics-main.webp",
    features: [
      { title: "Fracture\nCare", image: "/specialties/fracture-feat.webp" },
      { title: "Joint\nPain", image: "/specialties/jointpain-feat.webp" },
      { title: "Sports\nInjuries", image: "/specialties/sports-feat.webp" },
    ],
    topProcedures: [
      "Joint Replacement",
      "Arthroscopy",
      "Fracture Care",
      "Sports Rehabilitation"
    ]
  }
  // {
  //   id: "general-laparoscopic-surgery",
  //   name: "General & Laparoscopic Surgery",
  //   description: "Safe and effective surgical care using modern minimally invasive techniques.",
  //   mainImage: "/specialties/generalsurgery-main.jpg",
  //   features: [
  //     { title: "Hernia\nTreatment", image: "/specialties/hernia-feat.jpg" },
  //     { title: "Gallbladder\nStones", image: "/specialties/gallbladder-feat.jpg" },
  //     { title: "Appendicitis\nCare", image: "/specialties/appendicitis-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Laparoscopic Surgery",
  //     "Hernia Repair",
  //     "Appendectomy",
  //     "Minor Surgical Procedures"
  //   ]
  // },
  // {
  //   id: "pulmonology",
  //   name: "Pulmonology",
  //   description: "Specialized respiratory care for lung and breathing disorders.",
  //   mainImage: "/specialties/pulmonology-main.jpg",
  //   features: [
  //     { title: "Asthma\nManagement", image: "/specialties/asthma-feat.jpg" },
  //     { title: "COPD\nCare", image: "/specialties/copd-feat.jpg" },
  //     { title: "Lung\nInfections", image: "/specialties/lung-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Pulmonary Function Tests",
  //     "Asthma Management",
  //     "Bronchoscopy",
  //     "Sleep Disorder Evaluation"
  //   ]
  // },
  // {
  //   id: "neuropsychiatry",
  //   name: "Neuropsychiatry",
  //   description: "Integrated care for mental health and neurological behavioral conditions.",
  //   mainImage: "/specialties/neuropsychiatry-main.jpg",
  //   features: [
  //     { title: "Anxiety\nDisorders", image: "/specialties/anxiety-feat.jpg" },
  //     { title: "Depression\nManagement", image: "/specialties/depression-feat.jpg" },
  //     { title: "Sleep\nDisorders", image: "/specialties/sleep-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Psychiatric Evaluation",
  //     "Counseling & Therapy",
  //     "Medication Management",
  //     "Behavioral Health Care"
  //   ]
  // },
  // {
  //   id: "urology-andrology",
  //   name: "Urology & Andrology",
  //   description: "Comprehensive care for urinary tract and male reproductive health concerns.",
  //   mainImage: "/specialties/urology-main.jpg",
  //   features: [
  //     { title: "Kidney\nStones", image: "/specialties/kidneystones-feat.jpg" },
  //     { title: "Prostate\nDisorders", image: "/specialties/prostate-feat.jpg" },
  //     { title: "Male\nInfertility", image: "/specialties/infertility-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Stone Management",
  //     "Prostate Treatment",
  //     "Andrology Consultation",
  //     "Urological Procedures"
  //   ]
  // },
  // {
  //   id: "nephrology",
  //   name: "Nephrology",
  //   description: "Expert management of kidney diseases and related health conditions.",
  //   mainImage: "/specialties/nephrology-main.jpg",
  //   features: [
  //     { title: "Chronic Kidney\nDisease", image: "/specialties/ckd-feat.jpg" },
  //     { title: "Kidney\nFailure", image: "/specialties/kidneyfailure-feat.jpg" },
  //     { title: "Electrolyte\nDisorders", image: "/specialties/electrolyte-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Dialysis Care",
  //     "Kidney Disease Management",
  //     "Hypertension Related to Kidney Disease",
  //     "Renal Evaluation"
  //   ]
  // },
  // {
  //   id: "anesthesia-critical-care",
  //   name: "Anesthesia & Critical Care",
  //   description: "Round-the-clock critical care support with advanced monitoring and life-saving interventions.",
  //   mainImage: "/specialties/criticalcare-main.jpg",
  //   features: [
  //     { title: "Critical\nIllness", image: "/specialties/criticalillness-feat.jpg" },
  //     { title: "Trauma\nCare", image: "/specialties/trauma-feat.jpg" },
  //     { title: "Post-Surgical\nRecovery", image: "/specialties/postsurgical-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "ICU Management",
  //     "Ventilator Support",
  //     "Emergency Care",
  //     "Pain Management"
  //   ]
  // },
  // {
  //   id: "oncology",
  //   name: "Oncology (Medical & Surgical)",
  //   description: "Comprehensive cancer care with advanced diagnosis, treatment, and follow-up.",
  //   mainImage: "/specialties/oncology-main.jpg",
  //   features: [
  //     { title: "Breast\nCancer", image: "/specialties/breastcancer-feat.jpg" },
  //     { title: "Lung\nCancer", image: "/specialties/lungcancer-feat.jpg" },
  //     { title: "Gastrointestinal\nCancers", image: "/specialties/gicancer-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Chemotherapy",
  //     "Cancer Surgery",
  //     "Cancer Screening",
  //     "Follow-up Care"
  //   ]
  // },
  // {
  //   id: "gastroenterology",
  //   name: "Gastroenterology",
  //   description: "Specialized care for digestive system, liver, pancreas, and gastrointestinal disorders.",
  //   mainImage: "/specialties/gastroenterology-main.jpg",
  //   features: [
  //     { title: "Acidity &\nGERD", image: "/specialties/gerd-feat.jpg" },
  //     { title: "Liver\nDiseases", image: "/specialties/liver-feat.jpg" },
  //     { title: "IBS & Digestive\nDisorders", image: "/specialties/ibs-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Endoscopy",
  //     "Colonoscopy",
  //     "Liver Disease Management",
  //     "Digestive Health Evaluation"
  //   ]
  // },
  // {
  //   id: "ent",
  //   name: "ENT (Ear, Nose & Throat)",
  //   description: "Expert treatment for disorders affecting the ear, nose, throat, head, and neck.",
  //   mainImage: "/specialties/ent-main.jpg",
  //   features: [
  //     { title: "Sinusitis\nTreatment", image: "/specialties/sinusitis-feat.jpg" },
  //     { title: "Hearing\nProblems", image: "/specialties/hearing-feat.jpg" },
  //     { title: "Tonsillitis\nCare", image: "/specialties/tonsillitis-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Endoscopic Sinus Surgery",
  //     "Hearing Assessment",
  //     "Tonsil & Adenoid Surgery",
  //     "Allergy Management"
  //   ]
  // },
  // {
  //   id: "dental",
  //   name: "Dental",
  //   description: "Complete oral healthcare for healthy teeth, gums, and confident smiles.",
  //   mainImage: "/specialties/dental-main.jpg",
  //   features: [
  //     { title: "Tooth\nDecay", image: "/specialties/toothdecay-feat.jpg" },
  //     { title: "Gum\nDisease", image: "/specialties/gumdisease-feat.jpg" },
  //     { title: "Missing\nTeeth", image: "/specialties/missingteeth-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Dental Fillings",
  //     "Root Canal Treatment",
  //     "Teeth Cleaning",
  //     "Dental Implants"
  //   ]
  // },
  // {
  //   id: "physiotherapy-rehabilitation",
  //   name: "Physiotherapy & Rehabilitation",
  //   description: "Personalized rehabilitation programs to restore movement, strength, and function.",
  //   mainImage: "/specialties/physiotherapy-main.jpg",
  //   features: [
  //     { title: "Back\nPain", image: "/specialties/backpain-feat.jpg" },
  //     { title: "Post-Surgery\nRecovery", image: "/specialties/postsurgery-feat.jpg" },
  //     { title: "Sports\nInjuries", image: "/specialties/sportsinjury-feat.jpg" },
  //   ],
  //   topProcedures: [
  //     "Pain Management Therapy",
  //     "Post-Surgical Rehabilitation",
  //     "Sports Injury Rehabilitation",
  //     "Mobility Improvement Programs"
  //   ]
  // }
];

export default function Specialties() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const currentSpecialty = specialtiesData[activeIndex];

  // Navigation Handlers
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? specialtiesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === specialtiesData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-4 lg:py-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 xl:px-16">
        

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#5B328C] mb-3 font-[Poppins]">
            Our Specialties
          </h2>
          <p className="text-gray-900 font-medium text-lg font-[Poppins]">
            Comprehensive Care for Every Need
          </p>
        </div>

        {/* Top Pill Navigation */}
        <div className="flex items-center gap-3 md:justify-center overflow-x-auto pb-6 hide-scrollbar">
          {specialtiesData.map((spec, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveIndex(idx)}
                className={`cursor-pointer w-auto font-[Poppins] whitespace-nowrap px-6 py-2.5 rounded-full border-2 font-medium text-lg transition-all duration-300 ${
                  isActive 
                    ? "bg-[#0066A9] border-[#0066A9] text-white shadow-md" 
                    : "bg-white border-[#0066A9] text-[#000000] hover:bg-blue-50"
                }`}
              >
                {spec.name}
              </button>
            );
          })}
          
          <Link href="/specialities">
            <button className="cursor-pointer font-[Poppins] whitespace-nowrap px-6 py-2.5 rounded-full border-2 border-[#0066A9] bg-white text-[#0066A9] font-semibold text-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
              View all <FaCirclePlay className="text-lg" />
            </button>
          </Link>
        </div>

        {/* Main Content Card Container */}
        <div className="relative mt-4 font-[Poppins]">
          
          {/* Outer Navigation Arrows (Positioned over the card edges) */}
          <button 
            onClick={handlePrev}
            className="cursor-pointer absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all"
          >
            {/* <FaChevronLeft className="text-sm md:text-lg mr-1" /> */}
            <Image 
                        src="/icons/leftArrow.png"
                        alt="Left Navigation"
                        fill 
                        className="object-cover"
                      />
          </button>

          <button 
            onClick={handleNext}
            className="cursor-pointer absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all"
          >
            {/* <FaChevronRight className="text-sm md:text-lg ml-1" /> */}
            <Image 
                        src="/icons/rightArrow.png"
                        alt="Right Navigation"
                        fill 
                        className="object-cover"
                      />
          </button>

          {/* Gradient Card */}
          <div style={{ background: 'linear-gradient(90deg, #663399 56.94%, #0066A9 116.43%)' }} className="rounded-[32px] md:rounded-[40px] shadow-2xl p-6 lg:p-10 min-h-[450px] flex items-center relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 w-full"
              >
                
                {/* Left Side: Main Image */}
                <div className="w-full lg:w-[35%] shrink-0">
                  <div className="relative w-full aspect-[4/3] lg:aspect-square bg-white/20 rounded-[24px] overflow-hidden">
                    {currentSpecialty.mainImage ? (
                      <Image 
                        src={currentSpecialty.mainImage} 
                        alt={currentSpecialty.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 font-medium">Image Not Available</div>
                    )}
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full lg:w-[65%] flex flex-col justify-center">
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {currentSpecialty.name}
                  </h3>
                  
                  <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl mb-2">
                    {currentSpecialty.description}
                  </p>
                  <Link href={`/specialties/${currentSpecialty.id}`} className="text-white font-semibold text-sm underline underline-offset-4 mb-8 inline-block hover:text-white/80">
                    Read More...
                  </Link>

                  {/* Features & Procedures Grid */}
                  <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-10">
                    
                    {/* Small Feature Cards */}
                    <div className="flex gap-4 lg:gap-6">
                      {currentSpecialty.features.map((feat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-3 w-32 md:w-36">
                          <div className="relative w-32 h-36 md:w-36 md:h-40 rounded-2xl overflow-hidden bg-white/20 shrink-0 shadow-sm border border-white/10">
                            {feat.image && (
                              <Image src={feat.image} alt={feat.title} fill className="object-cover" />
                            )}
                          </div>
                          <p className="text-white text-[11px] md:text-xs font-medium leading-snug whitespace-pre-line">
                            {feat.title}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Top Procedures List */}
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-4">Top Procedures</h4>
                      <ul className="space-y-3">
                        {currentSpecialty.topProcedures.map((proc, idx) => (
                          <li key={idx} className="text-white/90 text-sm flex items-start gap-2">
                            <span className="text-white text-[10px] mt-1.5 shrink-0">●</span>
                            <span className="leading-snug">{proc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Call to Action Buttons */}
                  <div className="flex gap-6">
                    <Link href={`/doctors?specialty=${currentSpecialty.id}`}>
                      <button className="cursor-pointer bg-[#FFFFFF] text-[#663399] hover:bg-gray-50 px-8 py-3 rounded-full font-semibold text-lg shadow-md transition-colors">
                        Find a doctor
                      </button>
                    </Link>
                    <Link href={`/specialties/${currentSpecialty.id}`}>
                      <button className="cursor-pointer bg-[#FFFFFF] text-[#663399] hover:bg-gray-50 px-8 py-3 rounded-full font-semibold text-lg shadow-md transition-colors">
                        Explore more
                      </button>
                    </Link>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Hide Scrollbar Style for the Tabs */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}