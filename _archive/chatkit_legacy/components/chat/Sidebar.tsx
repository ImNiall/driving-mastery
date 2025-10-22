"use client";

import debounce from "lodash.debounce";
import {
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { ChatThread } from "@/types/chat";

export type SidebarProps = {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onNewThread: () => void;
  onDeleteThread: (threadId: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

function formatUpdatedAt(updatedAt: string) {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default function Sidebar({
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  isOpen,
  onClose,
}: SidebarProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        (value: string) => setSearchTerm(value.trim().toLowerCase()),
        300,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const filteredThreads = useMemo(() => {
    if (!searchTerm) return threads;
    return threads.filter((thread) => {
      const haystack = `${thread.title} ${thread.messages
        .map((message) => message.content)
        .join(" ")}`.toLowerCase();
      return haystack.includes(searchTerm);
    });
  }, [threads, searchTerm]);

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          aria-label="Close conversation list"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Chat conversations"
      >
        <div className="space-y-4 border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <MessageSquare className="h-4 w-4" />
              </span>
              Chat A.I+
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onNewThread}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <label htmlFor="chat-search" className="sr-only">
              Search conversations
            </label>
            <input
              id="chat-search"
              value={searchInput}
              onChange={(event) => {
                const value = event.target.value;
                setSearchInput(value);
                debouncedUpdate(value);
              }}
              placeholder="Search conversations"
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          {filteredThreads.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              {threads.length === 0 ? (
                <p>No conversations yet. Start a new one!</p>
              ) : (
                <p>No results for “{searchInput}”.</p>
              )}
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                const preview =
                  thread.messages.at(-1)?.content ?? "Start talking";
                return (
                  <li key={thread.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectThread(thread.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onSelectThread(thread.id);
                        }
                      }}
                      className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-blue-50 text-blue-800 shadow-inner"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium">
                            {thread.title}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatUpdatedAt(thread.updatedAt)}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {preview}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteThread(thread.id);
                        }}
                        className="invisible mt-1 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:text-red-600 focus-visible:visible focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 group-hover:visible"
                        aria-label={`Delete ${thread.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-sm font-semibold text-white">
              GA
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                Guest Account
              </p>
              <p className="truncate text-xs text-gray-500">
                Sign in to sync chats
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
