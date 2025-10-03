import { v4 as uuid } from "uuid";

/**
 * Creates or retrieves a stable quiz attempt ID
 * This ID persists across component remounts and page refreshes
 */
export function getOrCreateAttemptId(storageKey = "quiz_attempt_id") {
  // Only run in browser environment
  if (typeof window === "undefined") return "";
  
  let id = sessionStorage.getItem(storageKey);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(storageKey, id);
    
    // Also put it in the URL so refreshes/bookmarks resume correctly
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("attempt", id);
      history.replaceState({}, "", url.toString());
    } catch (e) {
      console.error("Failed to update URL with attempt ID:", e);
    }
  }
  
  return id;
}

/**
 * Creates or retrieves a module-specific attempt ID
 */
export function getOrCreateModuleAttemptId(moduleSlug: string) {
  return getOrCreateAttemptId(`quiz_attempt_${moduleSlug}`);
}
