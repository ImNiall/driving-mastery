import type { Metadata } from "next";
import MockTestPageClient from "./page.client";

const title = "Mock Driving Theory Test | Driving Mastery";
const description =
  "Sit a realistic mock driving theory exam with intelligent question selection, timers, and instant feedback to sharpen your DVSA readiness.";
const ogImage = "/og/mock-test.png";
const url = "/mock-test";

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
        alt: "Mock driving theory test interface",
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

export default function MockTestPage() {
  return <MockTestPageClient />;
}
