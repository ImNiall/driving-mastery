import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

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
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }
  ));
