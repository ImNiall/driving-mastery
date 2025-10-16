"use client";

import { Check, Menu, Pencil, Share2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export type TopBarProps = {
  title: string;
  onRename: (title: string) => void;
  onDelete: () => void;
  onShare: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function TopBar({
  title,
  onRename,
  onDelete,
  onShare,
  onToggleSidebar,
  isSidebarOpen,
}: TopBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(title);
    }
  }, [title, isEditing]);

  const handleRenameSubmit = () => {
    setIsEditing(false);
    const trimmed = draftTitle.trim();
    if (!trimmed) return onRename(title);
    if (trimmed === title) return;
    onRename(trimmed);
  };

  return (
    <header className="border-b border-gray-200 bg-white/80 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 lg:hidden"
            aria-label="Toggle conversation list"
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <label htmlFor="chat-title" className="sr-only">
                  Conversation title
                </label>
                <input
                  id="chat-title"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleRenameSubmit();
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      setIsEditing(false);
                      setDraftTitle(title);
                    }
                  }}
                  autoFocus
                  className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleRenameSubmit}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  aria-label="Save title"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-gray-900">
                  {title}
                </h1>
                <p className="text-sm text-gray-500">
                  Chat A.I+ is ready to assist
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="hidden h-10 items-center justify-center rounded-full border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:flex"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:hidden"
                aria-label="Rename conversation"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onShare}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Share conversation"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            aria-label="Delete conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
