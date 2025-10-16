"use client";

import Link from "next/link";
import { Bookmark, Share2, ChevronRight } from "lucide-react";
import React from "react";

interface ModuleHeaderProps {
  slug: string;
  title: string;
  summary: string;
  progress: number;
  moduleNumber: number;
  totalModules: number;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
  nextModule?: { slug: string; title: string } | null;
}

export default function ModuleHeader({
  slug,
  title,
  summary,
  progress,
  moduleNumber,
  totalModules,
  onBookmark,
  onShare,
  isBookmarked = false,
  nextModule,
}: ModuleHeaderProps) {
  const bookmarkLabel = isBookmarked ? "Bookmarked" : "Bookmark";

  return (
    <header className="sticky top-0 z-10 -mx-4 mb-8 border-b border-slate-200 bg-white/90 px-4 py-6 backdrop-blur sm:rounded-3xl sm:border sm:px-6 sm:shadow-lg">
      <div className="mx-auto max-w-5xl space-y-4">
        <nav aria-label="breadcrumb">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition hover:text-brand-blue/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <span aria-hidden>←</span>
            Back to Modules
          </Link>
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              <span>
                Module {moduleNumber} of {totalModules}
              </span>
              <span aria-hidden>•</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
              {summary}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onBookmark}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/40 hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue/60"
            >
              <Bookmark
                className={`h-4 w-4 ${isBookmarked ? "fill-brand-blue text-brand-blue" : "text-slate-500"}`}
                aria-hidden="true"
              />
              {bookmarkLabel}
            </button>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-blue/40 hover:text-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue/60"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </button>
            {nextModule ? (
              <Link
                href={`/modules/${nextModule.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                Next module
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
