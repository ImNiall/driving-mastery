import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SWKillRegister from "./sw-kill-register";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.drivingmastery.co.uk",
  ),
  title: "Driving Mastery — Pass Your UK Driving Theory",
  description:
    "AI-powered practice tests, micro-learning, and hazard perception training for the UK DVSA theory test.",
  openGraph: {
    title: "Driving Mastery",
    description:
      "AI-powered practice tests, micro-learning, and hazard perception training.",
    url: "/",
    siteName: "Driving Mastery",
    type: "website",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SWKillRegister />
        <AppNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
