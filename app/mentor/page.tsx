import type { Metadata } from "next";
import ChatKitWidget from "@/components/chat/ChatKitWidget";

export const metadata: Metadata = {
  title: "Theo Mentor",
  description:
    "Access the Theo AI mentor for tailored driving theory coaching.",
};

export default function MentorPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:py-12">
      <section className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Theo, your AI Mentor
        </h1>
        <p className="text-base leading-relaxed text-slate-600 md:text-lg">
          Ask follow-up questions, breakdown tricky topics, or request a
          revision plan. Theo uses your Driving Mastery progress to keep your
          study on track.
        </p>
      </section>

      <ChatKitWidget />
    </main>
  );
}
