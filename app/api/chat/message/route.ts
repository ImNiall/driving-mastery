// Minimal Next.js API route for chat message CRUD
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

export async function GET(req: NextRequest) {
  // List all messages for a session (session_id from query)
  const session_id = req.nextUrl.searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest) {
  // Add a message (expects { session_id, user_id, role, content })
  const body = await req.json();
  if (!body?.session_id || !body?.user_id || !body?.role || !body?.content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([
      {
        session_id: body.session_id,
        user_id: body.user_id,
        role: body.role,
        content: body.content,
      },
    ])
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}
