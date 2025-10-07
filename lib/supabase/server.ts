import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}
