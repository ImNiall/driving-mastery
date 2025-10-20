import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

// Use implicit flow for local development, PKCE for production
const isProduction = process.env.NODE_ENV === "production";
const flowType = isProduction ? "pkce" : "implicit";

declare global {
  // eslint-disable-next-line no-var
  var __supabase__: ReturnType<typeof createClient> | undefined;
}

export const supabase =
  global.__supabase__ ??
  (global.__supabase__ = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: process.env.NODE_ENV === "development" ? "implicit" : "pkce",
      },
      global: {
        headers: {
          "X-Client-Info": "supabase-js-web",
        },
      },
    },
  ));
