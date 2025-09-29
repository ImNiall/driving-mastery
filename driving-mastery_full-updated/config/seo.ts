// Use a safe cast to avoid TS errors on ImportMeta typings
export const SITE_URL = ((import.meta as any).env?.VITE_SITE_URL as string) || "https://example.com";
export const DEFAULT_OG = `${SITE_URL}/og.png`;
