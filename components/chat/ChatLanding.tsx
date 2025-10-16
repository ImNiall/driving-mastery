"use client";

import {
  BookOpen,
  Calculator,
  Code,
  Languages,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ActionCard from "./ActionCard";
import InputBar from "./InputBar";
import { useChatStore } from "@/store/chatStore";

const ACTIONS = [
  {
    icon: Lightbulb,
    title: "Explain",
    description:
      "Break down complex driving topics into friendly, easy-to-understand steps.",
    prompt: "Explain the following concept like I'm learning to drive: ",
  },
  {
    icon: Code,
    title: "Generate Code",
    description:
      "Draft small pieces of code or pseudo-code for training resources.",
    prompt: "Write a quick script to help learners practise: ",
  },
  {
    icon: BookOpen,
    title: "Learn",
    description:
      "Study theory rules, road signs, and safe driving habits in minutes.",
    prompt: "Help me learn about: ",
  },
  {
    icon: Calculator,
    title: "Solve Problems",
    description: "Work through tricky practice questions step-by-step.",
    prompt: "Talk me through this theory question: ",
  },
  {
    icon: Languages,
    title: "Translate",
    description:
      "Translate explanations and tips into another language for revision.",
    prompt: "Translate this driving theory tip into Spanish: ",
  },
  {
    icon: MessageCircle,
    title: "Brainstorm",
    description: "Come up with scenario ideas and hazard perception prompts.",
    prompt: "Brainstorm a few hazard scenarios about: ",
  },
  {
    icon: Sparkles,
    title: "Improve Writing",
    description: "Polish announcements, lesson plans, or helpful blog posts.",
    prompt: "Improve the tone of this update: ",
  },
  {
    icon: Wand2,
    title: "Summarise",
    description: "Turn lengthy DVSA documentation into quick checklists.",
    prompt: "Summarise these notes for quick revision: ",
  },
] as const;

export default function ChatLanding() {
  const router = useRouter();
  const createThread = useChatStore((state) => state.createThread);
  const [draft, setDraft] = useState("");

  const startChat = (seed?: string) => {
    const thread = createThread();
    const query = seed ? `?seed=${encodeURIComponent(seed)}` : "";
    router.push(`/chat/${thread.id}${query}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-50">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <section className="rounded-3xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Chat A.I+
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Good day! How may I assist you?
                </h1>
                <p className="mt-3 max-w-2xl text-base text-gray-600">
                  Start a fresh conversation, pick a quick action, or type your
                  prompt below. Driving Mastery’s assistant is ready to help you
                  revise smarter.
                </p>
              </div>
              <button
                type="button"
                onClick={() => startChat()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <MessageSquare className="h-4 w-4" />
                New chat
              </button>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Popular quick actions
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ACTIONS.map((action) => (
                <ActionCard
                  key={action.title}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  onSelect={() => startChat(action.prompt)}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Explore</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Discover new ways Chat A.I+ can support your revision. Try
                prompts for theory explanations, hazard perception coaching, or
                personalised study plans.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Capabilities
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Chat A.I+ can summarise DVSA material, draft practice questions,
                translate study notes, and adapt guidance to your style.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Limitations
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Information may occasionally be incomplete or outdated.
                Double-check with official DVSA resources for critical details.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-gray-200 bg-white">
        <InputBar
          value={draft}
          onChange={setDraft}
          onSubmit={() => {
            if (!draft.trim()) return;
            const seed = draft.trim();
            setDraft("");
            startChat(seed);
          }}
          placeholder="Ask anything about the driving theory test..."
        />
      </div>
    </div>
  );
}
