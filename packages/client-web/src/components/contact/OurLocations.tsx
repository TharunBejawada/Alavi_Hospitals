"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLocationDot,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaStar
} from "react-icons/fa6";

// --- STATIC DATA WITH EMBEDDED TESTIMONIALS ---
const locations = [
  {
    id: 1,
    name: "IDPL Branch",
    address: "12-234, Adarsh Nagar Main Road Adarsh Nagar, Opp. IDPL Colony Balanagar, Secunderabad Hyderabad, Telangana 500037",
    image: "/hospital-idpl.jpg",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.321!2d78.435!3d17.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sin!4v1",
    testimonials: [
      {
        id: 101,
        patient: "Shireesh Kumari",
        text: "We recently consulted Dr. Pradeep Reddy for our 9-month-old baby, who was suffering from a viral infection. From the very first consultation, Dr. Pradeep Reddy examined our baby thoroughly, explained the condition clearly, and reassured us with his calm and caring approach. His diagnosis was accurate, and the treatment he prescribed worked very well. He monitored our baby's progress closely and was always available to answer our concerns, giving us confidence and peace of mind throughout the recovery. His patience, kindness, and genuine concern for children make him an outstanding pediatrician.",
        rating: 5,
        isPurple: true,
      },
      {
        id: 102,
        patient: "ravi ravinder",
        text: "Dr.chandra Shaker is good general and diabetic. He's treatment very good.he is my family doctor. He's medication and suggestions very well. Alavi hospitals idpl chintal are best in this areas",
        rating: 5,
        isPurple: false,
      },
      {
        id: 103,
        patient: "Jasmitha Devi",
        text: "My daughter jasmitha devi attacked dengue fever since five days . Now she cured successfully with the help of Our beloved respectful Dr. Chandrasekhar sir and Dr Rabbani sir and all other doctors and reach and every staff member nurses and everyone helped us a lot. I am very much pleased and appreciated of nurses . Mainly Dr sir was in out of station even though took a personal care on my daughter with the conference of other doctors and staff members... So I am very greatful and thankful to our Dr. Chandrasekhar sir. Thanq so much sir for everything and we all are going with happily return to home on behalf of your valuable support to us sir.",
        rating: 5,
        isPurple: true,
      },
      {
        id: 104,
        patient: "Dharavath Laxmi",
        text: "I really appreciate Dr. Kalyani madam Because she fought for me and my baby with full effort and caring with positive and politely.and also joined My new born baby was joined alavi hospital admitted in NICU due to pre matured delivery. In NICU Dr.Pradeep sir and team was very excellent caring and Day by Day interaction,clear all the problems and supporting to parents. ( Highly recommended Dr. Pradeep Reddy sir ) Finally handover my baby with in 9 days.i really appreciate Dr.Pradeep reddy sir's with his excellent carring. Once again thanks to Dr.Pradeep Reddy sir.",
        rating: 5,
        isPurple: false,
      },
      {
        id: 105,
        patient: "devrajmd Md",
        text: "Dr Kalyani madam is excellent.she is gynic specialist. My wife ashwini is patient of kalyani doctor. After long 5 year wait for pregnancy my wife concive and her suggestions and caring.recently my wife normal delivered.baby and wife safe under the kalyani madam Especially once again thank you madam I suggested kalyani doctor for all pregnancy ladies.",
        rating: 5,
        isPurple: true,
      },
      {
        id: 106,
        patient: "Mohd Sammu",
        text: "Dr.kalyani madam is very good in this hospital.in my pregnancy time Mainly herprecautions and suggestions.she is very good treatment.overall staff and nurses very good responsible.i suggest for pregnancy ladies this hospital Dr.pradeep reddy is very good treatments on my baby.dr.chandra shekhar sir is very good treatment on diabetics patients",
        rating: 5,
        isPurple: false,
      },
    ]
  },
  {
    id: 2,
    name: "Chintal Branch",
    address: "5-120/2, Jeedimetla Main Road Opposite Asian Sha Theater Shiva Nagar, Chintal Hyderabad, Telangana 500054",
    image: "/hospital-chintal.jpg",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.321!2d78.435!3d17.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sin!4v2",
    testimonials: [
      {
        id: 201,
        patient: "ravi jan",
        text: "We had a wonderful experience at Alavi Hospital.\n\nA special thanks to Dr. Kalyani ma’am and Dr. Pradeep sir for their exceptional care and support throughout. They handled everything with great professionalism and kindness, which made us feel very comfortable during this important time.\nWe are blessed with a baby girl, and we are truly grateful for the care we received.\nThe hospital is very well maintained, and the staff are attentive, supportive, and take great care of patients.\nHighly recommended for anyone looking for quality maternity care.",
        rating: 5,
        isPurple: true,
      },
      {
        id: 202,
        patient: "shrinivas shreev",
        text: "Respected Sir,\nDr.M.Chandra Shekar garu,\nAlavi hospital\nchintal branch.\n\nSubject: Complaint Regarding Staff Behavior at Hospital Reception\n\nI would like to bring to your kind attention an issue regarding the behavior of the hospital reception staff and nursing staff.\n\nFirst of all,\nI sincerely appreciate your excellent service and dedication. You treat patients with great care, patience, and professionalism, which is truly commendable.\nHowever, I regret to inform you that the reception staff and one of the nursing staff member(sister) are behaving irresponsibly and rudely towards patients and their attendants. They often use sarcastic and disrespectful language, which creates discomfort and dissatisfaction among visitors.\nThis is not an isolated incident; many patients and their attendants are facing similar issues during their visits to the hospital.\nI kindly request you to take this matter seriously and take appropriate action to ensure that all patients are treated with respect and dignity.\nThank you for your attention to this matter.\n\nThank you sir.",
        rating: 5,
        isPurple: false,
      },
      {
        id: 203,
        patient: "Ramu K",
        text: "Dr pradeep reddy sir is very supportive and kind he answered all my questions patiently and gave useful advice.tha treatment was effective and l started feeling better soon. I am thankful for his care.i am very happy with the service thank you so mach sir.",
        rating: 5,
        isPurple: true,
      },
      {
        id: 204,
        patient: "Pragathi Kongari",
        text: "I recently visited the hospital. As iam suffering from stomach pain since many days after consulting Dr Kalyani I have received the best treatment and understood my situation.Iam happy with her expertise and care. Iam grateful for your service and alavi hospitals.",
        rating: 5,
        isPurple: false,
      },
      {
        id: 205,
        patient: "mahi Karasala",
        text: "Dr chandrashekhar sir is very patient and listen carefully treatment worked well. Staff is also supportive overall a very good experience.",
        rating: 5,
        isPurple: true,
      },
    ]
  },
];

// --- TESTIMONIALS CAROUSEL COMPONENT (5 SECONDS AUTO ROTATION) ---
const LocationTestimonials = ({ testimonials }: { testimonials: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 seconds auto slide timeout
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentItem1 = testimonials[currentIndex];
  const currentItem2 = testimonials[(currentIndex + 1) % testimonials.length];

  return (
    <div className="w-full flex flex-col h-full">
      {/* Testimonials Header */}
      <div className="flex flex-row justify-between items-center gap-3 mb-6">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#5B328C]">
          What Our Patient Says About Us
        </h3>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={prevSlide}
            aria-label="Previous Testimonial"
            className="w-8 h-8 rounded-full bg-[#5B328C] text-white flex items-center justify-center hover:bg-[#4a2873] transition-colors shadow-sm"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Testimonial"
            className="w-8 h-8 rounded-full bg-[#5B328C] text-white flex items-center justify-center hover:bg-[#4a2873] transition-colors shadow-sm"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow min-h-[320px] sm:min-h-[350px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem1.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-5 sm:p-6 md:p-8 rounded-2xl flex flex-col justify-between h-full min-h-[320px] sm:min-h-[350px] shadow-sm transition-shadow hover:shadow-md ${currentItem1.isPurple
                ? "bg-gradient-to-b from-[#4A419D] to-[#663399] text-white"
                : "bg-white text-gray-800 border border-gray-100"
              }`}
          >
            <div className="flex-1 flex flex-col justify-start">
              <FaQuoteLeft className={`text-2xl md:text-3xl mb-2.5 ${currentItem1.isPurple ? "text-white/30" : "text-[#5B328C]/30"}`} />
              <p className={`text-[13.5px] sm:text-[14px] leading-relaxed whitespace-pre-line line-clamp-10 md:line-clamp-[12] ${currentItem1.isPurple ? "text-white/90" : "text-gray-600"}`}>
                {currentItem1.text}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-current border-opacity-10">
              <FaUser className={`text-3xl ${currentItem1.isPurple ? "text-white/70" : "text-gray-300"}`} />
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl mb-0.5">{currentItem1.patient}</span>
                <div className="flex text-[#FBBF24] text-xs md:text-sm gap-0.5">
                  {[...Array(currentItem1.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {testimonials.length > 1 && (
            <motion.div
              key={currentItem2.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`hidden md:flex p-5 sm:p-6 md:p-8 rounded-2xl flex-col justify-between h-full min-h-[320px] sm:min-h-[350px] shadow-sm transition-shadow hover:shadow-md ${currentItem2.isPurple
                  ? "bg-gradient-to-b from-[#4A419D] to-[#663399] text-white"
                  : "bg-white text-gray-800 border border-gray-100"
                }`}
            >
              <div className="flex-1 flex flex-col justify-start">
                <FaQuoteLeft className={`text-2xl md:text-3xl mb-2.5 ${currentItem2.isPurple ? "text-white/30" : "text-[#5B328C]/30"}`} />
                <p className={`text-[13.5px] sm:text-[14px] leading-relaxed whitespace-pre-line line-clamp-10 md:line-clamp-[12] ${currentItem2.isPurple ? "text-white/90" : "text-gray-600"}`}>
                  {currentItem2.text}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-current border-opacity-10">
                <FaUser className={`text-3xl ${currentItem2.isPurple ? "text-white/70" : "text-gray-300"}`} />
                <div className="flex flex-col">
                  <span className="font-bold text-lg md:text-xl mb-0.5">{currentItem2.patient}</span>
                  <div className="flex text-[#FBBF24] text-sm gap-0.5">
                    {[...Array(currentItem2.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function OurLocations() {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const toggleMap = (id: number) => {
    setActiveLocation((prev) => (prev === id ? null : id));
  };

  return (
    <section className="font-[Inter] py-20 bg-[#FAFAFA] overflow-hidden min-h-screen">
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:pl-28 xl:pl-36 lg:pr-12 space-y-16">

        {locations.map((loc) => {
          const isMapOpen = activeLocation === loc.id;

          return (
            <div key={loc.id} className="flex flex-col gap-6">

              {/* TOP ROW: Location Card (Left) + Testimonials (Right) */}
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* LEFT: Location Card */}
                <motion.div layout className="w-full lg:w-1/3 flex flex-col rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-[#4A419D] shrink-0">
                  {/* Building Image */}
                  <div className="relative w-full aspect-[4/3] bg-[#4A419D]">
                    <Image
                      src={loc.image}
                      alt={loc.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Purple Details Box */}
                  <div className="p-6 flex flex-col flex-grow text-white">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <FaLocationDot className="text-[#5B328C] text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1.5">{loc.name}</h3>
                        <p className="text-white/80 text-[14px] leading-relaxed">
                          {loc.address}
                        </p>
                      </div>
                    </div>

                    {/* View Map Button */}
                    <div className="mt-auto flex justify-center">
                      <button
                        onClick={() => toggleMap(loc.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 text-xl font-semibold transition-all duration-300 ${isMapOpen
                          ? "bg-white text-[#5B328C] border-white shadow-md"
                          : "bg-transparent text-white border-white/50 hover:bg-white/10"
                          }`}
                      >
                        <FaLocationDot /> {isMapOpen ? "Close Map" : "View on Map"}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT: Testimonials Carousel Section */}
                <motion.div layout className="w-full lg:w-2/3 flex flex-col">
                  <LocationTestimonials testimonials={loc.testimonials} />
                </motion.div>
              </div>

              {/* BOTTOM ROW: Expandable Map */}
              <AnimatePresence>
                {isMapOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full overflow-hidden"
                  >
                    <div className="w-full h-[350px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-lg border-4 border-white mt-2 relative bg-gray-200">
                      <iframe
                        src={loc.mapUrl}
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </section>
  );
}