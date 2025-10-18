import type { Metadata } from "next";
import AuthPageClient from "./page.client";

const title = "Sign In to Driving Mastery | Driving Theory Study";
const description =
  "Create or access your Driving Mastery account to sync progress, unlock Theo mentor chat, and continue DVSA theory revision.";
const ogImage = "/og/auth.png";
const url = "/auth";

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
        alt: "Driving Mastery authentication screen",
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

export default function AuthPage() {
  return <AuthPageClient />;
}
