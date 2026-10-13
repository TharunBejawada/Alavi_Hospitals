import { NextResponse } from "next/server";
import { API_URL } from "../../config";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const res = await fetch(`${API_URL}/llms-full.txt`, {
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
        console.error("Failed to proxy /llms-full.txt from API:", error);
    }

    // Resilient fallback if backend is offline during static crawl
    const fallback = `# Alavi Hospitals

> Alavi Hospitals is a premier multi-speciality tertiary healthcare hospital in Hyderabad, India, offering advanced medical care across cardiology, neurosciences, orthopaedics, oncology, gastroenterology, nephrology, and 24/7 critical care.

- Homepage: https://alavihospitals.in

==================================================
FULL COMPREHENSIVE RESOURCE DIRECTORY FOR LLM CONTEXT
==================================================

### Alavi Hospitals Clinical Directory & Services
For live updated datasets, please visit https://alavihospitals.in/llms-full.txt directly.
`;

    return new NextResponse(fallback, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    });
}
