"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage, QuizAction } from "@/types";
import { getChatResponse } from "@/lib/services/chat";
import { ChatIcon, SendIcon, SpinnerIcon } from "@/components/icons";

type ChatWindowProps = {
  className?: string;
  initialContextMessage?: string | null;
  onStartSuggestedQuiz?: (action: QuizAction) => void;
};

export default function ChatWindow({
  className,
  initialContextMessage = null,
  onStartSuggestedQuiz,
}: ChatWindowProps) {
  const router = useRouter();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [initialised, setInitialised] = React.useState(false);
  const [threadId, setThreadId] = React.useState<string | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  const getAssistantResponse = React.useCallback(
    async (history: ChatMessage[], existingThreadId?: string) => {
      const latest = history[history.length - 1]?.text ?? "";
      if (!latest) {
        return { text: "", threadId: existingThreadId ?? null };
      }

      const response = await fetch("/api/assistant-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: latest,
          threadId: existingThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Assistant request failed");
      }

      const data = (await response.json()) as {
        text?: string;
        threadId?: string;
      };
      return {
        text: data.text ?? "",
        threadId: data.threadId ?? existingThreadId ?? null,
      };
    },
    [],
  );

  React.useEffect(() => {
    if (initialised) return;
    let cancelled = false;
    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const initialUser: ChatMessage = {
          role: "user",
          text: initialContextMessage || "Hi Theo.",
        };
        const { text, threadId: newThreadId } = await getAssistantResponse([
          initialUser,
        ]);
        if (cancelled) return;
        const aiMessage: ChatMessage = { role: "model", text };
        setThreadId(newThreadId ?? null);
        setMessages([aiMessage]);
      } catch (error) {
        if (!cancelled) {
          setMessages([
            {
              role: "model",
              text: "I’m having trouble connecting right now. Please try again in a moment.",
            },
          ]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setInitialised(true);
        }
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [getAssistantResponse, initialContextMessage, initialised]);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = React.useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const history = [...messages, userMessage];
    try {
      const { text, threadId: newThreadId } = await getAssistantResponse(
        history,
        threadId ?? undefined,
      );
      setThreadId(newThreadId ?? null);
      const aiMessage: ChatMessage = { role: "model", text };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I couldn’t reach the assistant just now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [getAssistantResponse, input, isLoading, messages, threadId]);

  const handleQuizStart = React.useCallback(
    (action: QuizAction) => {
      if (onStartSuggestedQuiz) {
        onStartSuggestedQuiz(action);
        return;
      }
      router.push("/mock-test");
    },
    [onStartSuggestedQuiz, router],
  );

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:rounded-3xl ${className ?? ""}`}
    >
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue sm:h-11 sm:w-11">
            <ChatIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue sm:text-sm">
              AI Mentor
            </p>
            <p className="text-xs text-slate-500 sm:text-sm">
              Ask Theo anything about the UK theory test.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 text-sm leading-relaxed text-slate-800 sm:px-5 sm:py-6">
        {!initialised && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-slate-600">
              Theo is getting ready…
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm sm:max-w-[75%] sm:text-base ${
                msg.role === "user"
                  ? "bg-brand-blue text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              <p>{msg.text}</p>
              {msg.action?.type === "start_quiz" && (
                <button
                  onClick={() => handleQuizStart(msg.action!)}
                  className="mt-3 w-full rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-brand-blue transition hover:bg-white"
                >
                  Start {msg.action.questionCount}-question quiz
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 p-3 text-brand-blue">
              <SpinnerIcon className="h-5 w-5 text-brand-blue" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <footer className="border-t border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-2 sm:gap-3 sm:px-3">
          <input
            type="text"
            className="w-full bg-transparent py-2 text-sm outline-none sm:text-base"
            placeholder="Ask a question about driving theory…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-white transition hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
