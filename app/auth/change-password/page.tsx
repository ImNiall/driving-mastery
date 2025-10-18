import type { Metadata } from "next";
import ChangePasswordPageClient from "./page.client";

export const dynamic = "force-dynamic";

const title = "Change Driving Mastery Password";
const description =
  "Securely update your Driving Mastery password after requesting a reset link or recovery email.";
const ogImage = "/og/auth-change.png";
const url = "/auth/change-password";

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
        alt: "Change Driving Mastery password screen",
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

export default function ChangePasswordPage() {
  return <ChangePasswordPageClient />;
}
