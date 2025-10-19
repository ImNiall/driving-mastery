import type { Metadata } from "next";
import StudyGroupsPageClient from "./page.client";

const title = "Study Groups | Driving Mastery";
const description =
  "Join study groups to learn together and compete with friends in your driving theory preparation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/study-groups",
  },
};

export default function StudyGroupsPage() {
  return <StudyGroupsPageClient />;
}
