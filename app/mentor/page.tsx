import type { Metadata } from "next";
import dynamic from "next/dynamic";
import BackToDashboardLink from "@/components/BackToDashboardLink";

const ChatLayout = dynamic(() => import("@/components/chat/ChatLayout"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Theo Mentor",
  description:
    "Access the Theo AI mentor for tailored driving theory coaching.",
};

export default function MentorPage() {
  return (
    <ChatLayout
      headerSlot={
        <div className="space-y-6">
          <BackToDashboardLink variant="pill" />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Theo, your AI Mentor
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
              Ask follow-up questions, break down tricky topics, or request a
              revision plan. Theo uses your Driving Mastery progress to keep
              your study on track and adapts every conversation to your goals.
            </p>
          </div>
        </div>
      }
    />
  );
}
