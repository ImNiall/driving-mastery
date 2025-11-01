import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/app/openai";
import { mapMessageRow, mapThreadRow } from "@/lib/assistant/server";
import type { AssistantMessageRecord } from "@/lib/assistant/types";
import { getSupabaseRouteContext } from "@/lib/supabase/server";

export const runtime = "nodejs";

const THREAD_LIST_DEFAULT_LIMIT = 20;
const THREAD_LIST_MAX_LIMIT = 100;
const INITIAL_MESSAGE_LIMIT = 30;

const createThreadSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    metadata: z.record(z.any()).optional(),
    reset: z.boolean().optional(),
  })
  .strip();

type ThreadResponse = {
  threadId: string;
  openaiThreadId: string;
  title: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  messages: AssistantMessageRecord[];
  nextCursor: string | null;
};

export async function POST(request: NextRequest) {
  const { supabase, user } = await getSupabaseRouteContext(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = createThreadSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { reset = false, title, metadata } = parsed.data;
  const messageLimit = INITIAL_MESSAGE_LIMIT;

  if (!reset) {
    const { data: existingThread, error: existingError } = await supabase
      .from("assistant_threads")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError && existingError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Failed to load threads", details: existingError.message },
        { status: 500 },
      );
    }

    if (existingThread) {
      const { data: messageRows, error: messagesError } = await supabase
        .from("assistant_messages")
        .select("*")
        .eq("thread_id", existingThread.id)
        .order("created_at", { ascending: false })
        .limit(messageLimit + 1);

      if (messagesError) {
        return NextResponse.json(
          { error: "Failed to load messages", details: messagesError.message },
          { status: 500 },
        );
      }

      const hasMore =
        (messageRows?.length ?? 0) > messageLimit && messageLimit > 0;
      const trimmed = (messageRows ?? []).slice(0, messageLimit);
      const messages = trimmed.map(mapMessageRow);
      const nextCursor =
        hasMore && messages.length > 0
          ? messages[messages.length - 1]!.createdAt
          : null;

      const response: ThreadResponse = {
        threadId: existingThread.id,
        openaiThreadId: existingThread.openai_thread_id,
        title: existingThread.title,
        metadata:
          (existingThread.metadata as Record<string, unknown> | null) ?? null,
        createdAt: existingThread.created_at,
        updatedAt: existingThread.updated_at,
        messages,
        nextCursor,
      };

      return NextResponse.json(response);
    }
  }

  const thread = await openai.beta.threads.create();

  const { data: insertedThread, error: insertError } = await supabase
    .from("assistant_threads")
    .insert({
      user_id: user.id,
      openai_thread_id: thread.id,
      title: title ?? null,
      metadata: metadata ?? null,
    })
    .select("*")
    .single();

  if (insertError || !insertedThread) {
    return NextResponse.json(
      {
        error: "Failed to create thread",
        details: insertError?.message ?? null,
      },
      { status: 500 },
    );
  }

  const response: ThreadResponse = {
    threadId: insertedThread.id,
    openaiThreadId: insertedThread.openai_thread_id,
    title: insertedThread.title ?? title ?? null,
    metadata:
      (insertedThread.metadata as Record<string, unknown> | null) ??
      metadata ??
      null,
    createdAt: insertedThread.created_at,
    updatedAt: insertedThread.updated_at,
    messages: [],
    nextCursor: null,
  };

  return NextResponse.json(response, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { supabase, user } = await getSupabaseRouteContext(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), THREAD_LIST_MAX_LIMIT)
    : THREAD_LIST_DEFAULT_LIMIT;

  const { data, error } = await supabase
    .from("assistant_threads")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json(
      { error: "Failed to list threads", details: error.message },
      { status: 500 },
    );
  }

  const threads = (data ?? []).map((row) => {
    const summary = mapThreadRow(row);
    return {
      id: summary.id,
      title: summary.title,
      createdAt: summary.createdAt,
      updatedAt: summary.updatedAt,
    };
  });

  return NextResponse.json(threads);
}
