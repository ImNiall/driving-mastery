import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/app/openai";
import { fetchThreadForUser } from "@/lib/assistant/server";
import { wireAssistantStreamPersistence } from "@/lib/assistant/stream";
import { getSupabaseRouteContext } from "@/lib/supabase/server";
import type { Database, Json } from "@/src/types/supabase";

export const runtime = "nodejs";

const toolOutputsSchema = z
  .object({
    runId: z.string().min(1),
    toolCallOutputs: z
      .array(
        z.object({
          tool_call_id: z.string().min(1),
          output: z.string().optional().default(""),
        }),
      )
      .min(1),
  })
  .strict();

export async function POST(
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

  const body = await request.json().catch(() => ({}));
  const parsed = toolOutputsSchema.safeParse(body ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { runId, toolCallOutputs } = parsed.data;

  const toolInsertions = await Promise.all(
    toolCallOutputs.map((toolCall) =>
      supabase
        .from("assistant_messages")
        .insert({
          thread_id: thread.id,
          role: "tool",
          content: toolCall.output ?? "",
          raw: toolCall as unknown as Json,
          status: "complete",
        } satisfies Database["public"]["Tables"]["assistant_messages"]["Insert"])
        .select("*")
        .single(),
    ),
  );

  for (const insertResult of toolInsertions) {
    if (insertResult.error) {
      return NextResponse.json(
        {
          error: "Failed to store tool output",
          details: insertResult.error.message,
        },
        { status: 500 },
      );
    }
  }

  const { data: existingAssistantMessage, error: existingAssistantError } =
    await supabase
      .from("assistant_messages")
      .select("*")
      .eq("thread_id", thread.id)
      .eq("role", "assistant")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (existingAssistantError && existingAssistantError.code !== "PGRST116") {
    return NextResponse.json(
      {
        error: "Failed to load assistant message",
        details: existingAssistantError.message,
      },
      { status: 500 },
    );
  }

  let assistantMessageId: string;
  let initialContent = "";

  if (
    existingAssistantMessage &&
    existingAssistantMessage.status === "requires_action"
  ) {
    assistantMessageId = existingAssistantMessage.id;
    initialContent = existingAssistantMessage.content ?? "";
    await supabase
      .from("assistant_messages")
      .update({
        status: "pending",
      } satisfies Database["public"]["Tables"]["assistant_messages"]["Update"])
      .eq("id", assistantMessageId);
  } else {
    const { data: assistantMessageRow, error: assistantMessageError } =
      await supabase
        .from("assistant_messages")
        .insert({
          thread_id: threadResult.data.id,
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
    assistantMessageId = assistantMessageRow.id;
  }

  let stream;
  try {
    stream = openai.beta.threads.runs.submitToolOutputsStream(
      thread.openai_thread_id,
      runId,
      { tool_outputs: toolCallOutputs },
    );
  } catch (error) {
    await supabase
      .from("assistant_messages")
      .update({
        status: "error",
      } satisfies Database["public"]["Tables"]["assistant_messages"]["Update"])
      .eq("id", assistantMessageId);
    console.error("[assistant-actions] failed to submit tool outputs", {
      threadId: thread.id,
      error,
    });
    return NextResponse.json(
      { error: "Failed to submit tool outputs to assistant." },
      { status: 502 },
    );
  }

  wireAssistantStreamPersistence(stream, {
    supabase,
    assistantMessageId,
    threadId: thread.id,
    initialContent,
  });

  return new Response(stream.toReadableStream());
}
