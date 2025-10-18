import type { Metadata } from "next";
import LeaderboardPageClient from "./page.client";

const title = "Driving Theory Leaderboard | Driving Mastery";
const description =
  "Compare mastery points with other learners and climb the Driving Mastery leaderboard as you complete theory practice.";
const ogImage = "/og/leaderboard.png";
const url = "/leaderboard";

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
        alt: "Driving Mastery leaderboard screenshot",
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

export default function LeaderboardPage() {
  return <LeaderboardPageClient />;
}
