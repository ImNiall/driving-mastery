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
    <div className="bg-gradient-to-br from-slate-100 via-white to-slate-100 min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:gap-10 lg:px-8 lg:pb-20 lg:pt-14">
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

        <section className="flex flex-1 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60 sm:p-6 lg:p-8">
          <div className="flex h-[70vh] min-h-[520px] w-full flex-col md:h-[600px] lg:h-[680px]">
            <AssistantChat />
          </div>
        </section>
      </div>
    </div>
  );
}
