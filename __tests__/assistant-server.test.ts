import { describe, expect, it } from "vitest";
import {
  deriveThreadTitleFromContent,
  mapMessageRow,
  mapThreadRow,
} from "@/lib/assistant/server";
import type { Database } from "@/src/types/supabase";

describe("assistant server helpers", () => {
  const sampleThread: Database["public"]["Tables"]["assistant_threads"]["Row"] =
    {
      id: "thread-123",
      user_id: "user-1",
      openai_thread_id: "oa-456",
      title: "Sample Thread",
      metadata: { foo: "bar" },
      created_at: "2024-11-01T10:15:00.000Z",
      updated_at: "2024-11-01T10:20:00.000Z",
    };

  const sampleMessage: Database["public"]["Tables"]["assistant_messages"]["Row"] =
    {
      id: "message-789",
      thread_id: sampleThread.id,
      role: "assistant",
      content: "Hello there!",
      raw: { delta: "value" },
      status: "complete",
      created_at: "2024-11-01T10:18:00.000Z",
      updated_at: "2024-11-01T10:19:00.000Z",
    };

  it("maps thread rows to summaries", () => {
    const summary = mapThreadRow(sampleThread);
    expect(summary).toEqual({
      id: "thread-123",
      title: "Sample Thread",
      metadata: { foo: "bar" },
      createdAt: "2024-11-01T10:15:00.000Z",
      updatedAt: "2024-11-01T10:20:00.000Z",
    });
  });

  it("maps message rows", () => {
    const mapped = mapMessageRow(sampleMessage);
    expect(mapped).toEqual({
      id: "message-789",
      threadId: "thread-123",
      role: "assistant",
      content: "Hello there!",
      raw: { delta: "value" },
      status: "complete",
      createdAt: "2024-11-01T10:18:00.000Z",
      updatedAt: "2024-11-01T10:19:00.000Z",
    });
  });

  it("derives concise titles from message content", () => {
    expect(
      deriveThreadTitleFromContent(
        "Practise stopping distances for wet conditions please",
      ),
    ).toBe("Practise stopping distances for wet conditions…");

    expect(deriveThreadTitleFromContent("Short title")).toBe("Short title");
    expect(deriveThreadTitleFromContent("   ")).toBeNull();
  });
});
