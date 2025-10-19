import type { Metadata } from "next";
import ProfilePageClient from "./page.client";

const title = "Profile Settings | Driving Mastery";
const description =
  "Update your profile settings and display name for the leaderboard.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
