import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; 
import FloatingContact from "../components/FloatingContact";
import FloatingSideNav from "../components/FloatingSideNav";
import CanonicalTag from "../components/CanonicalTag";
import MobileBottomNav from '../components/MobileBottomNav';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Alavi Hospitals IDPL, Hyderabad | Multi-Specialty Care",
  description: "Alavi Hospitals in IDPL, Hyderabad offers multi-specialty care with expert doctors, modern facilities & 24x7 emergency services. Book an appointment today.",
  keywords: "Alavi Hospitals, hospital in IDPL Hyderabad, multi-specialty hospital Hyderabad, best hospital near IDPL, 24x7 emergency hospital Hyderabad",
  alternates: {
    canonical: "https://www.alavihospitals.in/",
  },
  openGraph: {
    title: "Alavi Hospitals IDPL, Hyderabad | Multi-Specialty Care",
    description: "Multi-specialty care with expert doctors, modern facilities & 24x7 emergency services in IDPL, Hyderabad.",
    url: "https://www.alavihospitals.in/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  verification: {
    google: "pW4_Pe0n4ElheXJSj5w1E3gdH52nCcnb5RjIIJ00W5Q",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <CanonicalTag />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-FVTSWDVH');
          `}
        </Script>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-345CJXQ4ME`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-345CJXQ4ME');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white flex flex-col min-h-screen`}>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-FVTSWDVH"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <FloatingSideNav />
        <main className="flex-grow">{children}</main>
        <Footer /> 
        <FloatingContact />
        <MobileBottomNav />
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar={false} 
        />
      </body>
    </html>
  );
}