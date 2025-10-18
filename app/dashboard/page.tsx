import type { Metadata } from "next";
import DashboardPageClient from "./page.client";

const title = "Driving Theory Dashboard | Driving Mastery";
const description =
  "Track quiz performance, review mastery points, and launch Theo mentor sessions to focus your UK driving theory revision.";
const ogImage = "/og/dashboard.png";
const url = "/dashboard";

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
        alt: "Driving Mastery dashboard overview",
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

export default function DashboardPage() {
  return <DashboardPageClient />;
}
