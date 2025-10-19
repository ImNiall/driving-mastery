import type { Metadata } from "next";
import MembershipsPageClient from "./page.client";

const title = "Driving Mastery Memberships | Plans & Pricing";
const description =
  "Compare Driving Mastery memberships to unlock AI coaching, advanced analytics, and premium study modules for the DVSA theory test.";
const ogImage = "/og/memberships.png";
const url = "/memberships";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Driving Mastery memberships comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function MembershipsPage() {
  return <MembershipsPageClient />;
}
