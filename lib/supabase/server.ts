import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  createClient,
  type AuthError,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { env } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";
import type { Database } from "@/src/types/supabase";

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

function createServiceRoleClient(): SupabaseClient<Database> {
  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return createClient<Database>(
    serverEnv.SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

type RouteContext = {
  supabase: SupabaseClient<Database>;
  user: User | null;
  error: AuthError | null;
  token: string | null;
  usingServiceRole: boolean;
};

export async function getSupabaseRouteContext(
  request: NextRequest,
): Promise<RouteContext> {
  const authHeader =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");
  const tokenMatch = authHeader?.match(/^Bearer\s+(.+)$/i);
  const token = tokenMatch?.[1]?.trim() || null;

  if (token && serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.auth.getUser(token);
    return {
      supabase,
      user: data?.user ?? null,
      error,
      token,
      usingServiceRole: true,
    };
  }

  if (token) {
    const supabase = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    );
    const { data, error } = await supabase.auth.getUser(token);
    return {
      supabase,
      user: data?.user ?? null,
      error,
      token,
      usingServiceRole: false,
    };
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  return {
    supabase,
    user: data?.user ?? null,
    error,
    token: null,
    usingServiceRole: false,
  };
}
