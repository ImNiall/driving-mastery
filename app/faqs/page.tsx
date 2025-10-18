import type { Metadata } from "next";
import FaqsPageClient from "./page.client";

const title = "Driving Theory FAQs | Driving Mastery";
const description =
  "Get answers about Driving Mastery memberships, AI mentor chat, mock theory tests, and managing your account.";
const ogImage = "/og/faqs.png";
const url = "/faqs";

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
        alt: "Driving Mastery FAQs overview",
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

export default function FaqsPage() {
  return <FaqsPageClient />;
}
