import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Calendar, Phone } from "lucide-react";
import { API_URL } from "../../../config";
import type { Treatment } from "../../../../../core/src/types";

export default async function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  let treatment: Treatment | null = null;

  try {
    const res = await axios.get(`${API_URL}/api/treatments/getByUrl/${params.slug}`);
    treatment = res.data.Item;
  } catch (error) {
    console.error("Failed to fetch treatment details.");
  }

  if (!treatment || !treatment.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-2xl text-[#5B328C]">
        Page Not Found
      </div>
    );
  }

  return (
    <div className="font-['Poppins'] min-h-screen bg-[#FAFAFA] pb-20">

      {/* HERO */}
      <section className="relative w-full h-[350px] md:h-[420px] flex items-center">
        <div className="absolute inset-0 bg-[#663399] z-0"></div>

        {treatment.bannerImage && (
          <div className="absolute inset-y-0 right-0 w-full md:w-[70%] lg:w-[60%] z-0">
            <Image
              src={treatment.bannerImage}
              alt={treatment.title}
              fill
              className="object-cover object-right"
              priority
            />
          </div>
        )}

        <div
          className="absolute inset-0 z-10"
          style={{ background: "linear-gradient(90deg, #663399 48.93%, rgba(0, 102, 169, 0) 77.09%)" }}
        ></div>

        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-12 lg:pl-28 xl:px-16 xl:pl-32 relative z-20">
          <div className="max-w-xl text-white">
            <span className="inline-block text-sm font-semibold uppercase tracking-wide text-white/70 mb-3">
              {treatment.itemType === "condition" ? "Condition" : "Procedure"}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight mb-4">
              {treatment.title}
            </h1>
            <div className="flex flex-wrap gap-6">
              <a href="tel:+919603911911">
                <button className="cursor-pointer bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors">
                  <Phone className="w-5 h-5" /> +91 9603 911 911
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className="max-w-[1000px] w-full mx-auto px-8">
          <div
            className="prose max-w-none text-[16px] leading-[180%] text-[#0C0200]"
            dangerouslySetInnerHTML={{ __html: (treatment.content || "").replace(/&nbsp;/g, " ") }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1000px] w-full mx-auto px-8">
        <div className="bg-[linear-gradient(302.64deg,#0066A9_-26.31%,#663399_118.83%)] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="font-semibold text-[22px] leading-[32px] mb-1">Have questions about this?</h3>
            <p className="text-white/90">Talk to one of our specialists today.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a href="tel:+919603911911">
              <button className="bg-white text-[#663399] font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> Call Now
              </button>
            </a>
            <Link href="/doctors">
              <button className="border-2 border-white text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Calendar className="w-4 h-4" /> Book an Appointment
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
