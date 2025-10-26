import dynamic from "next/dynamic";

const ChatLayout = dynamic(() => import("@/components/chat/ChatLayout"), {
  ssr: false,
});

export default function ChatPage() {
  return (
    <ChatLayout
      headerSlot={
        <div className="space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 lg:justify-start">
            Theo, your AI mentor
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Persistent chat with Driving Mastery&apos;s AI coach
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 md:text-base lg:mx-0">
              Revisit previous sessions, create new study plans, and pick up
              exactly where you left off. Theo remembers your goals so you can
              stay focused on passing the theory test.
            </p>
          </div>
        </div>
      }
    />
  );
}
