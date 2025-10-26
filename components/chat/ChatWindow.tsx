"use client";

import {
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

export type ChatMessageRecord = {
  id: string;
  session_id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

type ChatWindowProps = {
  messages: ChatMessageRecord[];
  sessionTitle?: string | null;
  isLoadingMessages?: boolean;
  isSending?: boolean;
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
  onStartNewChat?: () => void;
  errorMessage?: string | null;
};

function formatTimeAgo(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EmptyState({
  onStartNewChat,
  disabled,
}: Pick<ChatWindowProps, "onStartNewChat"> & { disabled?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center text-slate-500">
      <div className="inline-flex size-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-900">
          Start a new conversation
        </h3>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Theo remembers your recent sessions. Create a new chat to ask follow
          up questions, revisit weak spots, or request a fresh study plan.
        </p>
      </div>
      <button
        type="button"
        onClick={onStartNewChat}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        <Sparkles className="h-4 w-4" />
        New chat
      </button>
    </div>
  );
}

export function ChatWindow({
  messages,
  sessionTitle,
  isLoadingMessages = false,
  isSending = false,
  onSendMessage,
  disabled = false,
  onStartNewChat,
  errorMessage,
}: ChatWindowProps) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const [autoScrolled, setAutoScrolled] = useState(false);

  const hasMessages = messages.length > 0;

  const sortedMessages = useMemo(
    () =>
      [...messages].sort((a, b) => {
        const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
        return aTime - bTime;
      }),
    [messages],
  );

  useEffect(() => {
    if (hasMessages) {
      const timeout = setTimeout(
        () => {
          endRef.current?.scrollIntoView({ behavior: "smooth" });
          setAutoScrolled(true);
        },
        autoScrolled ? 50 : 150,
      );
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [sortedMessages, hasMessages, autoScrolled]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const text = draft.trim();
      if (!text) return;
      setDraft("");
      await onSendMessage(text);
    },
    [draft, onSendMessage],
  );

  const placeholder =
    "Ask Theo to review your progress, break down a tricky topic, or draft a new study plan…";

  return (
    <section className="relative flex h-full flex-1 flex-col overflow-hidden rounded-[40px] border border-white/60 bg-white/90 shadow-2xl shadow-indigo-100 backdrop-blur">
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-8 py-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-600 shadow-inner shadow-indigo-200">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {sessionTitle?.trim() || "Theo, your AI Mentor"}
            </h2>
            <p className="text-sm text-slate-500">
              Ask follow-up questions or request tailored revision support.
            </p>
          </div>
        </div>
        {(isLoadingMessages || isSending) && (
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/90 px-3 py-2 text-xs font-medium text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking…
          </div>
        )}
      </header>

      <div className="relative flex-1 overflow-hidden">
        {isLoadingMessages && !hasMessages ? (
          <div className="flex h-full flex-col gap-4 px-8 py-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-1/4 rounded-full bg-slate-100" />
                    <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                    <div className="h-3 w-3/5 rounded-full bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasMessages ? (
          <div className="flex h-full flex-col gap-6 overflow-y-auto px-6 py-8 sm:px-10">
            {sortedMessages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-6 shadow-sm sm:max-w-[70%] ${
                      isUser
                        ? "rounded-br-md bg-indigo-600 text-white shadow-indigo-200"
                        : "rounded-bl-md bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="whitespace-pre-wrap text-base">
                        {message.content}
                      </p>
                      <span
                        className={`block text-xs font-medium ${
                          isUser ? "text-indigo-100/80" : "text-slate-500"
                        }`}
                      >
                        {formatTimeAgo(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        ) : (
          <EmptyState onStartNewChat={onStartNewChat} disabled={disabled} />
        )}
      </div>

      <footer className="relative border-t border-slate-100 px-6 py-6 sm:px-8">
        {errorMessage ? (
          <div className="mb-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {errorMessage}
          </div>
        ) : null}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/60 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-200"
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder}
            className="h-14 max-h-36 w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
            rows={2}
            disabled={disabled || isSending}
          />
          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40"
              disabled
              aria-label="Attach file (coming soon)"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={disabled || isSending || !draft.trim()}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:opacity-50"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </footer>
    </section>
  );
}

export default ChatWindow;
