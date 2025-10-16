"use client";

import React from "react";
import type { ModuleChecklistItem } from "@/types/module";

interface ChecklistProps {
  slug: string;
  items: ModuleChecklistItem[];
  onProgressChange?: (value: number) => void;
}

function storageKey(slug: string) {
  return `module:${slug}:checklist`;
}

function calculateProgress(
  state: Record<string, boolean>,
  items: ModuleChecklistItem[],
) {
  const total = items.length || 1;
  const completed = items.filter((item) => state[item.id]).length;
  return Math.round((completed / total) * 100);
}

export default function Checklist({
  slug,
  items,
  onProgressChange,
}: ChecklistProps) {
  const [state, setState] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey(slug));
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setState(parsed);
      }
    } catch (error) {
      console.warn("[checklist] failed to read localStorage", error);
    }
  }, [slug]);

  const progress = React.useMemo(
    () => calculateProgress(state, items),
    [state, items],
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(state));
    } catch (error) {
      console.warn("[checklist] failed to persist state", error);
    }
    onProgressChange?.(progress);
  }, [slug, state, progress, onProgressChange]);

  const handleToggle = (id: string) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Ready-for-Test Checklist
          </h2>
          <p className="text-sm text-slate-500">
            Tick each habit you can demonstrate consistently on lessons.
          </p>
        </div>
        <div className="text-sm font-semibold text-brand-blue">
          {progress}% complete
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-blue transition-all"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => {
          const checked = !!state[item.id] || item.done;
          return (
            <li
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                  checked={checked}
                  onChange={() => handleToggle(item.id)}
                />
                <span>{item.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
