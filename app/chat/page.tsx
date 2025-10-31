import AssistantChat from "@/components/assistant/AssistantChat";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-slate-100 py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6">
        <header className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white md:justify-start">
            Theo, your AI mentor
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Chat with Driving Mastery&apos;s assistant
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 md:text-base md:mx-0">
              Use the official OpenAI chat assistant interface to ask questions,
              plan study sessions, and get instant driving theory support.
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
