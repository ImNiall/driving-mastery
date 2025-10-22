import type { Metadata } from "next";
import dynamic from "next/dynamic";
import BackToDashboardLink from "@/components/BackToDashboardLink";

const ChatKitWidget = dynamic(() => import("@/components/chat/ChatKitWidget"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Theo Mentor",
  description:
    "Access the Theo AI mentor for tailored driving theory coaching.",
};

export default function MentorPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col gap-8 px-3 py-8 sm:gap-10 sm:px-6 sm:py-12">
      <div style={{ padding: 8, fontSize: 12, opacity: 0.6 }}>
        mentor page alive
      </div>
      <BackToDashboardLink />
      <section className="space-y-3 sm:space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
          Theo, your AI Mentor
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg">
          Ask follow-up questions, break down tricky topics, or request a
          revision plan. Theo uses your Driving Mastery progress to keep your
          study on track.
        </p>
      </section>

      <ChatKitWidget />
    </main>
  );
}
