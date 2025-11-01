import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import {
  deriveThreadTitleFromContent,
  fetchThreadForUser,
  mapMessageRow,
} from "@/lib/assistant/server";
import { wireAssistantStreamPersistence } from "@/lib/assistant/stream";
import type { AssistantMessageRecord } from "@/lib/assistant/types";
import { getSupabaseRouteContext } from "@/lib/supabase/server";
import type { Database } from "@/src/types/supabase";

export const runtime = "nodejs";

const MESSAGE_PAGE_DEFAULT_LIMIT = 30;
const MESSAGE_PAGE_MAX_LIMIT = 100;
const MAX_MESSAGE_LENGTH = 4000;

const sendMessageSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(MAX_MESSAGE_LENGTH, "Message is too long"),
  })
  .strict();

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } },
) {
  const { supabase, user } = await getSupabaseRouteContext(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threadResult = await fetchThreadForUser(
    supabase,
    params.threadId,
    user.id,
  );

  const thread = threadResult.data;

  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), MESSAGE_PAGE_MAX_LIMIT)
    : MESSAGE_PAGE_DEFAULT_LIMIT;

  const cursor = request.nextUrl.searchParams.get("cursor");
  if (cursor && Number.isNaN(Date.parse(cursor))) {
    return NextResponse.json(
      { error: "Invalid cursor supplied" },
      { status: 400 },
    );
  }

  let query = supabase
    .from("assistant_messages")
    .select("*")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      { error: "Failed to load messages", details: error.message },
      { status: 500 },
    );
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  const sliced = rows.slice(0, limit);
  const messages: AssistantMessageRecord[] = sliced.map(mapMessageRow);
  const nextCursor =
    hasMore && sliced.length > 0 ? sliced[sliced.length - 1]!.created_at : null;

  return NextResponse.json({
    messages,
    nextCursor,
    hasMore,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } },
) {
  if (!assistantId) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 500 },
    );
  }

  const { supabase, user } = await getSupabaseRouteContext(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threadResult = await fetchThreadForUser(
    supabase,
    params.threadId,
    user.id,
  );

  const thread = threadResult.data;

  if (!thread) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = sendMessageSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const content = parsed.data.content.trim();

  const { data: insertedUserMessage, error: insertUserError } = await supabase
    .from("assistant_messages")
    .insert({
      thread_id: thread.id,
      role: "user",
      content,
      status: "pending",
    } satisfies Database["public"]["Tables"]["assistant_messages"]["Insert"])
    .select("*")
    .single();

  if (insertUserError || !insertedUserMessage) {
    return NextResponse.json(
      { error: "Failed to store message", details: insertUserError?.message },
      { status: 500 },
    );
  }

  try {
    await openai.beta.threads.messages.create(thread.openai_thread_id, {
      role: "user",
      content,
    });
    await supabase
      .from("assistant_messages")
      .update({
        status: "complete",
      } satisfies Database["public"]["Tables"]["assistant_messages"]["Update"])
      .eq("id", insertedUserMessage.id);
  } catch (error) {
    await supabase
      .from("assistant_messages")
      .update({
        status: "error",
      } satisfies Database["public"]["Tables"]["assistant_messages"]["Update"])
      .eq("id", insertedUserMessage.id);

    console.error("[assistant-message] failed to send to OpenAI", {
      threadId: thread.id,
      error,
    });

    return NextResponse.json(
      { error: "Failed to send message to assistant." },
      { status: 502 },
    );
  }

  if (!thread.title) {
    const derivedTitle = deriveThreadTitleFromContent(content);
    if (derivedTitle) {
      await supabase
        .from("assistant_threads")
        .update({
          title: derivedTitle,
        } satisfies Database["public"]["Tables"]["assistant_threads"]["Update"])
        .eq("id", thread.id)
        .eq("user_id", user.id);
    }
  }

  const { data: assistantMessageRow, error: assistantMessageError } =
    await supabase
      .from("assistant_messages")
      .insert({
        thread_id: thread.id,
        role: "assistant",
        content: "",
        status: "pending",
      } satisfies Database["public"]["Tables"]["assistant_messages"]["Insert"])
      .select("*")
      .single();

  if (assistantMessageError || !assistantMessageRow) {
    return NextResponse.json(
      {
        error: "Failed to prepare assistant response",
        details: assistantMessageError?.message,
      },
      { status: 500 },
    );
  }

  let stream;
  try {
    stream = openai.beta.threads.runs.stream(thread.openai_thread_id, {
      assistant_id: assistantId,
    });
  } catch (error) {
    await supabase
      .from("assistant_messages")
      .update({ status: "error" })
      .eq("id", assistantMessageRow.id);
    console.error("[assistant-message] failed to start assistant stream", {
      threadId: thread.id,
      error,
    });
    return NextResponse.json(
      { error: "Failed to start assistant run." },
      { status: 502 },
    );
  }

  wireAssistantStreamPersistence(stream, {
    supabase,
    assistantMessageId: assistantMessageRow.id,
    threadId: thread.id,
  });

  return new Response(stream.toReadableStream());
}
