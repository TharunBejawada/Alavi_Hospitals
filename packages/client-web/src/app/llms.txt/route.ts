import { NextResponse } from "next/server";
import { API_URL } from "../../config";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const res = await fetch(`${API_URL}/llms.txt`, {
            cache: "no-store",
            headers: {
                Accept: "text/plain",
            },
        });

        if (res.ok) {
            const text = await res.text();
            return new NextResponse(text, {
                status: 200,
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
                },
            });
        }
    } catch (error) {
        console.error("Failed to proxy /llms.txt from API:", error);
    }

    // Resilient fallback if backend is offline during static crawl
    const fallback = `# Alavi Hospitals

> Alavi Hospitals is a premier multi-speciality tertiary healthcare hospital in Hyderabad, India, offering advanced medical care across cardiology, neurosciences, orthopaedics, oncology, gastroenterology, nephrology, and 24/7 critical care.

- Homepage: https://alavihospitals.in

## Core Hospital Resources
- [Alavi Hospitals Official Homepage](https://alavihospitals.in/)	[Leading multi-speciality tertiary healthcare hospital in Hyderabad, India]
- [About Alavi Hospitals](https://alavihospitals.in/about)	[Leadership, clinical excellence, modern infrastructure]
- [Consultant Specialists & Doctors Directory](https://alavihospitals.in/doctors)	[Directory of senior surgeons, physicians, and medical consultants]
- [Centres of Excellence & Specialities](https://alavihospitals.in/specialities)	[Specialized clinical departments]
- [Treatments & Surgical Procedures](https://alavihospitals.in/treatments)	[Comprehensive medical treatments and robotic surgeries]
- [Preventive Health Checkup Packages](https://alavihospitals.in/health-packages)	[Master health screenings and wellness profiles]
- [Contact, Appointments & Emergency](https://alavihospitals.in/contact)	[24/7 emergency hotline and consultation bookings]
`;

    return new NextResponse(fallback, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
