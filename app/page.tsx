import type { Metadata } from "next";
import Script from "next/script";
import HomePage from "./page.client";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.drivingmastery.co.uk";

const defaultImage = "/og/home.png";
const defaultTitle = "Driving Mastery | AI-Powered UK Driving Theory Revision";
const defaultDescription =
  "Prepare for the UK DVSA theory test with guided study plans, AI mentoring, and interactive mock exams tailored to your progress.";

export const metadata: Metadata = {
  title: defaultTitle,
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "Driving Mastery home hero graphic",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultImage],
  },
};

export default function HomePageRoute() {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Driving Mastery",
    url: SITE_URL,
    logo: new URL("/favicon.png", SITE_URL).toString(),
    sameAs: [SITE_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@drivingmastery.app",
      },
    ],
  };

  return (
    <>
      <Script id="ld-json-home" type="application/ld+json">
        {JSON.stringify(organizationLd)}
      </Script>
      <HomePage />
    </>
  );
}
