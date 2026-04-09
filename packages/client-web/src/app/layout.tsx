import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; 
import FloatingContact from "../components/FloatingContact";
import CanonicalTag from "../components/CanonicalTag";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Alavi Hospitals",
  description: "Alavi Hospitals | Hyderabad",
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
            })(window,document,'script','dataLayer','GTM-NKRLX977');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white flex flex-col min-h-screen`}>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-NKRLX977"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer /> 
        <FloatingContact />
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar={false} 
        />
      </body>
    </html>
  );
}