import type { SupabaseClient } from "@supabase/supabase-js";
import type { AssistantStream } from "openai/lib/AssistantStream";
import type { Database, Json } from "@/src/types/supabase";

type DbClient = SupabaseClient<Database>;

type PersistStreamOptions = {
  supabase: DbClient;
  assistantMessageId: string;
  threadId: string;
  flushIntervalMs?: number;
  initialContent?: string;
};

const DEFAULT_FLUSH_INTERVAL_MS = 250;

export function wireAssistantStreamPersistence(
  stream: AssistantStream,
  {
    supabase,
    assistantMessageId,
    threadId,
    flushIntervalMs = DEFAULT_FLUSH_INTERVAL_MS,
    initialContent = "",
  }: PersistStreamOptions,
) {
  let accumulatedText = initialContent;
  let finalAssistantPayload: Json | null = null;
  let flushTimer: NodeJS.Timeout | null = null;
  let lastUpdate: Promise<unknown> = Promise.resolve();

  const queueUpdate = (
    payload: Partial<
      Database["public"]["Tables"]["assistant_messages"]["Update"]
    >,
  ) => {
    lastUpdate = lastUpdate
      .catch(() => null)
      .then(() =>
        supabase
          .from("assistant_messages")
          .update(payload)
          .eq("id", assistantMessageId),
      )
      .catch((error) => {
        console.error(
          "[assistant-stream] failed to persist assistant message update",
          { threadId, assistantMessageId, error },
        );
      });
  };

  const flushContent = (force = false) => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (!force) {
      flushTimer = setTimeout(() => {
        flushTimer = null;
        queueUpdate({ content: accumulatedText });
      }, flushIntervalMs);
      return;
    }
    queueUpdate({ content: accumulatedText });
  };

  stream.on("textDelta", (delta) => {
    if (typeof delta.value === "string") {
      accumulatedText += delta.value;
      flushContent();
    }
  });

  stream.on("imageFileDone", (image) => {
    accumulatedText += `\n![${image.file_id}](/api/files/${image.file_id})\n`;
    flushContent();
  });

  stream.on("event", (event) => {
    if (event.event === "thread.message.completed") {
      if (event.data?.role === "assistant") {
        finalAssistantPayload = event.data as unknown as Json;
      }
    }

    if (event.event === "thread.run.completed") {
      flushContent(true);
      queueUpdate({
        content: accumulatedText,
        status: "complete",
        raw: finalAssistantPayload,
      });
    }

    if (
      event.event === "thread.run.requires_action" ||
      event.event === "thread.run.failed" ||
      event.event === "thread.run.cancelled" ||
      event.event === "thread.run.expired"
    ) {
      flushContent(true);
      queueUpdate({
        content: accumulatedText,
        status:
          event.event === "thread.run.requires_action"
            ? "requires_action"
            : "error",
        raw: finalAssistantPayload,
      });
    }
  });

  stream.on("error", (error) => {
    flushContent(true);
    queueUpdate({ status: "error" });
    console.error("[assistant-stream] stream error", {
      threadId,
      assistantMessageId,
      error,
    });
  });

  stream.on("end", () => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    void lastUpdate.catch(() => null);
  });
}
