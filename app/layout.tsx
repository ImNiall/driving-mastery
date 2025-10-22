import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";
import SWKillRegister from "./sw-kill-register";
import AppNav from "@/components/AppNav";
import Footer from "@/components/Footer";
import { env } from "@/lib/env";

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
    images: [
      {
        url: "/og/default.png",
        width: 1200,
        height: 630,
        alt: "Driving Mastery default share image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Driving Mastery",
    description:
      "AI-powered practice tests, micro-learning, and hazard perception training.",
    images: ["/og/default.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="chatkit-loader"
          src={
            env.NEXT_PUBLIC_CHATKIT_LOADER_URL ??
            "https://cdn.openai.com/chatkit/latest/chatkit.js"
          }
          strategy="afterInteractive"
        />
        <SWKillRegister />
        <AppNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
