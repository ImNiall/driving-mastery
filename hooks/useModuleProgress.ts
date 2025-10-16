import React from "react";

const STORAGE_PREFIX = "module:";

function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function useModuleProgress() {
  return React.useCallback((slug: string, fallback: number = 0) => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(
        `${STORAGE_PREFIX}${slug}:progress`,
      );
      if (!raw) return fallback;
      return clampProgress(Number.parseFloat(raw));
    } catch {
      return fallback;
    }
  }, []);
}
