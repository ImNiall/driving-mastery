import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

type WeakestCategory = {
  dvsa_category: string | null;
  average_score: number | null;
} | null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase environment variables are not set");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function POST(request: NextRequest) {
  let body: { user_uuid?: string };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const userUuid = body?.user_uuid;

  if (!userUuid || typeof userUuid !== "string") {
    return new Response(JSON.stringify({ error: "user_uuid is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { data, error } = await supabase.rpc("get_weakest_category", {
    user_uuid: userUuid,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const payload = (data as WeakestCategory) || {
    dvsa_category: null,
    average_score: null,
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export async function GET() {
  return new Response(null, { status: 405 });
}
