import { NextRequest, NextResponse } from "next/server";
import { fetchThreadForUser, mapMessageRow } from "@/lib/assistant/server";
import type { AssistantMessageRecord } from "@/lib/assistant/types";
import { getSupabaseRouteContext } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MESSAGE_LIMIT_DEFAULT = 30;
const MESSAGE_LIMIT_MAX = 100;

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
    ? Math.min(Math.max(Math.trunc(limitParam), 1), MESSAGE_LIMIT_MAX)
    : MESSAGE_LIMIT_DEFAULT;

  const { data: messageRows, error: messagesError } = await supabase
    .from("assistant_messages")
    .select("*")
    .eq("thread_id", thread.id)
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (messagesError) {
    return NextResponse.json(
      { error: "Failed to load messages", details: messagesError.message },
      { status: 500 },
    );
  }

  const hasMore = (messageRows?.length ?? 0) > limit;
  const trimmed = (messageRows ?? []).slice(0, limit);
  const messages: AssistantMessageRecord[] = trimmed.map(mapMessageRow);
  const nextCursor =
    hasMore && trimmed.length > 0
      ? trimmed[trimmed.length - 1]!.created_at
      : null;

  return NextResponse.json({
    threadId: thread.id,
    openaiThreadId: thread.openai_thread_id,
    title: thread.title,
    metadata: thread.metadata,
    createdAt: thread.created_at,
    updatedAt: thread.updated_at,
    messages,
    nextCursor,
  });
}
