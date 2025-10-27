// Minimal Next.js API route for chat session CRUD
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

export async function GET(req: NextRequest) {
  // List all sessions for a user (user_id from query or header)
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at, archived")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sessions: data });
}

export async function POST(req: NextRequest) {
  // Create a new session (expects { user_id, title })
  const body = await req.json();
  if (!body?.user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([{ user_id: body.user_id, title: body.title || "New Chat" }])
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ session: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const sessionId = body?.session_id;
  const title = body?.title;

  if (!sessionId || typeof title !== "string") {
    return NextResponse.json(
      { error: "session_id and title are required" },
      { status: 400 },
    );
  }

  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return NextResponse.json(
      { error: "title cannot be empty" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .update({ title: trimmedTitle })
    .eq("id", sessionId)
    .select("id, title, created_at, archived")
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ session: data });
}
