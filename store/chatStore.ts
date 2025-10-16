import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

import type { ChatMessage, ChatThread } from "@/types/chat";
import { generateId } from "@/utils/id";

const DEFAULT_THREAD_TITLE = "New chat";
const STORAGE_KEY = "chat-threads-state";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const storage = createJSONStorage(() =>
  typeof window === "undefined" ? noopStorage : window.localStorage,
);

type ChatState = {
  threads: ChatThread[];
  activeThreadId: string | null;
};

type ChatActions = {
  createThread: (options?: {
    id?: string;
    title?: string;
    messages?: ChatMessage[];
  }) => ChatThread;
  setActiveThread: (id: string | null) => void;
  addMessage: (threadId: string, message: ChatMessage) => void;
  updateMessage: (
    threadId: string,
    messageId: string,
    updates: Partial<ChatMessage>,
  ) => void;
  renameThread: (threadId: string, title: string) => void;
  deleteThread: (threadId: string) => void;
  touchThread: (threadId: string) => void;
};

function normalizeTitle(title: string) {
  const trimmed = title.trim();
  return trimmed.length ? trimmed : DEFAULT_THREAD_TITLE;
}

function createEmptyThread(
  id = generateId("thread"),
  title = DEFAULT_THREAD_TITLE,
  messages: ChatMessage[] = [],
): ChatThread {
  return {
    id,
    title: normalizeTitle(title),
    messages,
    updatedAt: new Date().toISOString(),
  };
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,
      createThread: (options) => {
        const id = options?.id ?? generateId("thread");
        const existing = get().threads.find((thread) => thread.id === id);
        if (existing) {
          set({ activeThreadId: existing.id });
          return existing;
        }
        const initialMessages = options?.messages ?? [];
        const thread = createEmptyThread(
          id,
          options?.title ?? DEFAULT_THREAD_TITLE,
          initialMessages,
        );
        set((state) => ({
          threads: [thread, ...state.threads],
          activeThreadId: thread.id,
        }));
        return thread;
      },
      setActiveThread: (id) => {
        set((state) => ({
          activeThreadId: state.threads.some((thread) => thread.id === id)
            ? id
            : state.activeThreadId,
        }));
      },
      addMessage: (threadId, message) => {
        set((state) => ({
          threads: state.threads.map((thread) => {
            if (thread.id !== threadId) return thread;
            return {
              ...thread,
              messages: [...thread.messages, message],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      updateMessage: (threadId, messageId, updates) => {
        set((state) => ({
          threads: state.threads.map((thread) => {
            if (thread.id !== threadId) return thread;
            const messages = thread.messages.map((message) =>
              message.id === messageId ? { ...message, ...updates } : message,
            );
            return { ...thread, messages };
          }),
        }));
      },
      renameThread: (threadId, title) => {
        const normalizedTitle = normalizeTitle(title);
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, title: normalizedTitle }
              : thread,
          ),
        }));
      },
      deleteThread: (threadId) => {
        set((state) => {
          const remaining = state.threads.filter(
            (thread) => thread.id !== threadId,
          );
          const nextActive =
            state.activeThreadId === threadId
              ? (remaining[0]?.id ?? null)
              : state.activeThreadId;
          return {
            threads: remaining,
            activeThreadId: nextActive,
          };
        });
      },
      touchThread: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, updatedAt: new Date().toISOString() }
              : thread,
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage,
      skipHydration: typeof window === "undefined",
      version: 1,
    },
  ),
);

export const chatStoreStorageKey = STORAGE_KEY;

export function resetChatStore() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  useChatStore.setState((state) => ({
    ...state,
    threads: [],
    activeThreadId: null,
  }));
}
