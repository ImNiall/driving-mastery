"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import MessageBubble from "./MessageBubble";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import InputBar from "./InputBar";
import { useChatStore } from "@/store/chatStore";
import { generateId } from "@/utils/id";
import { getAssistantResponse } from "@/lib/chat/assistant";
import type { ChatMessage } from "@/types/chat";

export type ChatConversationProps = {
  threadId: string;
  seed?: string;
};

const DEFAULT_TITLE = "New chat";

export default function ChatConversation({
  threadId,
  seed,
}: ChatConversationProps) {
  const router = useRouter();
  const threads = useChatStore((state) => state.threads);
  const thread = useChatStore((state) =>
    state.threads.find((conversation) => conversation.id === threadId),
  );
  const createThread = useChatStore((state) => state.createThread);
  const setActiveThread = useChatStore((state) => state.setActiveThread);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const renameThread = useChatStore((state) => state.renameThread);
  const deleteThread = useChatStore((state) => state.deleteThread);
  const touchThread = useChatStore((state) => state.touchThread);

  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const seedAppliedRef = useRef(false);

  useEffect(() => {
    if (!thread) {
      const created = createThread({ id: threadId });
      if (created.id !== threadId) {
        router.replace(
          `/chat/${created.id}${seed ? `?seed=${encodeURIComponent(seed)}` : ""}`,
        );
      }
    }
  }, [createThread, router, seed, thread, threadId]);

  useEffect(() => {
    setActiveThread(threadId);
  }, [setActiveThread, threadId]);

  useEffect(() => {
    if (!seedAppliedRef.current && seed) {
      setInputValue(seed);
      seedAppliedRef.current = true;
    }
  }, [seed]);

  useEffect(() => {
    if (thread?.title) {
      const previous = document.title;
      document.title = `${thread.title} | Chat A.I+`;
      return () => {
        document.title = previous;
      };
    }
    return undefined;
  }, [thread?.title]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [thread?.id]);

  useEffect(() => {
    const target = messagesEndRef.current;
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [thread?.messages.length, isResponding]);

  useEffect(() => {
    const timer = announcement
      ? window.setTimeout(() => setAnnouncement(null), 2500)
      : null;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [announcement]);

  const sortedThreads = useMemo(() => {
    return [...threads].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [threads]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !thread || isResponding) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateId("msg"),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    addMessage(thread.id, userMessage);
    setInputValue("");
    setSidebarOpen(false);

    const existingTitle = useChatStore
      .getState()
      .threads.find((item) => item.id === thread.id)?.title;
    if (!existingTitle || existingTitle === DEFAULT_TITLE) {
      const shortened =
        trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
      renameThread(thread.id, shortened);
    }

    setIsResponding(true);
    const assistantId = generateId("msg");
    const placeholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    addMessage(thread.id, placeholder);
    setTypingMessageId(assistantId);

    try {
      const updatedThread = useChatStore
        .getState()
        .threads.find((item) => item.id === thread.id);
      const history = updatedThread?.messages ?? [];
      const response = await getAssistantResponse(history);
      updateMessage(thread.id, assistantId, {
        content: response,
        createdAt: new Date().toISOString(),
      });
      touchThread(thread.id);
    } catch (error) {
      updateMessage(thread.id, assistantId, {
        content:
          "I ran into an issue generating a response. Please try again or adjust your prompt.",
      });
      touchThread(thread.id);
    } finally {
      setIsResponding(false);
      setTypingMessageId(null);
    }
  };

  const handleDeleteThread = (id: string) => {
    deleteThread(id);
    const state = useChatStore.getState();
    const nextId = state.activeThreadId ?? state.threads[0]?.id;
    if (nextId) {
      router.push(`/chat/${nextId}`);
    } else {
      router.push(`/chat`);
    }
  };

  const handleShare = async () => {
    const title = thread?.title ?? "Chat A.I+ conversation";
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard?.writeText(url);
      setAnnouncement("Link copied to clipboard");
    } catch (error) {
      setAnnouncement("Unable to share conversation");
    }
  };

  const handleSelectThread = (id: string) => {
    if (id === threadId) {
      setSidebarOpen(false);
      return;
    }
    router.push(`/chat/${id}`);
    setSidebarOpen(false);
  };

  const messages = thread?.messages ?? [];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white">
      <Sidebar
        threads={sortedThreads}
        activeThreadId={threadId}
        onSelectThread={handleSelectThread}
        onNewThread={() => {
          const next = createThread();
          router.push(`/chat/${next.id}`);
          setSidebarOpen(false);
        }}
        onDeleteThread={handleDeleteThread}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-full flex-1 flex-col bg-white lg:ml-[280px]">
        <TopBar
          title={thread?.title ?? DEFAULT_TITLE}
          onRename={(newTitle) => renameThread(threadId, newTitle)}
          onDelete={() => handleDeleteThread(threadId)}
          onShare={handleShare}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />
        {announcement ? (
          <div
            className="bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-700"
            aria-live="polite"
          >
            {announcement}
          </div>
        ) : null}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div
            className="mx-auto flex w-full max-w-4xl flex-col gap-6"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
                Start the conversation by asking a question or choosing a quick
                action.
              </div>
            ) : null}
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isTyping={
                  typingMessageId === message.id &&
                  message.role === "assistant" &&
                  !message.content
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <InputBar
          ref={inputRef}
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSend}
          isDisabled={isResponding}
          autoFocus
          placeholder="Ask follow-up questions or start a new topic..."
        />
      </div>
    </div>
  );
}
