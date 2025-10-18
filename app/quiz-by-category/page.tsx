import type { Metadata } from "next";
import QuizByCategoryPageClient from "./page.client";

const title = "Quiz by DVSA Category | Driving Mastery";
const description =
  "Drill down into any DVSA category with focused 10-question quizzes, timers, and progress tracking tailored to your weak spots.";
const ogImage = "/og/quiz-category.png";
const url = "/quiz-by-category";

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
        alt: "Category quiz interface preview",
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

export default function QuizByCategoryPage() {
  return <QuizByCategoryPageClient />;
}
