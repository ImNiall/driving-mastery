import type { Metadata } from "next";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import ChatKitWidget from "@/components/chat/ChatKitWidget";

export const metadata: Metadata = {
  title: "Theo AI Mentor",
  description:
    "Chat with Theo, your AI driving mentor powered by OpenAI Agent Builder.",
};

export default function ChatPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:py-12">
      <BackToDashboardLink />
      <section className="space-y-3 text-center sm:space-y-4 md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Chat with Theo, your AI Mentor
        </h1>
        <p className="text-base leading-relaxed text-slate-600 md:text-lg">
          Theo uses your Driving Mastery progress and DVSA guidance to answer
          questions, plan revision, and keep you on track for the UK theory
          test.
        </p>
      </section>
      <ChatKitWidget />
    </main>
  );
}
