import type { Metadata } from "next";
import AssistantChat from "@/components/assistant/AssistantChat";
import BackToDashboardLink from "@/components/BackToDashboardLink";

export const metadata: Metadata = {
  title: "Theo Mentor",
  description:
    "Access the Theo AI mentor for tailored driving theory coaching.",
};

export default function MentorPage() {
  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-slate-100 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6">
        <header className="space-y-6">
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
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="h-[560px] md:h-[640px]">
            <AssistantChat />
          </div>
        </section>
      </div>
    </div>
  );
}
