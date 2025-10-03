// Generate a random UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Creates or retrieves a stable quiz attempt ID
 * This ID persists across component remounts and page refreshes
 */
export function getOrCreateAttemptId(storageKey = "quiz_attempt_id") {
  // Only run in browser environment
  if (typeof window === "undefined") return "";
  
  let id = sessionStorage.getItem(storageKey);
  if (!id) {
    id = generateUUID();
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
