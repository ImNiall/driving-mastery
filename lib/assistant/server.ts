import type { SupabaseRouteClient } from "@/lib/supabase/server";
import type {
  AssistantMessageRecord,
  AssistantThreadDetail,
  AssistantThreadSummary,
  AssistantMessageStatus,
} from "./types";
import type { Database } from "@/src/types/supabase";

type DbThreadRow = Database["public"]["Tables"]["assistant_threads"]["Row"];
type DbMessageRow = Database["public"]["Tables"]["assistant_messages"]["Row"];
type DbClient = SupabaseRouteClient;

const MESSAGE_STATUS_VALUES: ReadonlyArray<AssistantMessageStatus> = [
  "pending",
  "complete",
  "error",
  "requires_action",
];

function normalizeStatus(value: string | null): AssistantMessageStatus | null {
  if (!value) return null;
  return MESSAGE_STATUS_VALUES.includes(value as AssistantMessageStatus)
    ? (value as AssistantMessageStatus)
    : null;
}

export function mapThreadRow(row: DbThreadRow): AssistantThreadSummary {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: row.metadata ?? null,
  };
}

export function mapThreadDetail(
  row: DbThreadRow,
  messages: DbMessageRow[],
): AssistantThreadDetail {
  return {
    ...mapThreadRow(row),
    openaiThreadId: row.openai_thread_id,
    messages: messages.map(mapMessageRow),
  };
}

export function mapMessageRow(row: DbMessageRow): AssistantMessageRecord {
  return {
    id: row.id,
    threadId: row.thread_id,
    role: row.role as AssistantMessageRecord["role"],
    content: row.content,
    raw: row.raw ?? null,
    status: normalizeStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchThreadForUser(
  client: DbClient,
  threadId: string,
  userId: string,
) {
  const { data, error } = await client
    .from("assistant_threads")
    .select("*")
    .eq("id", threadId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return { data: null, error };
  }

  return { data, error: null as null };
}

export function deriveThreadTitleFromContent(content: string) {
  const trimmed = content.trim();
  if (!trimmed) return null;
  const words = trimmed.split(/\s+/).slice(0, 6);
  const base = words.join(" ");
  return base.length === trimmed.length ? base : `${base}…`;
}
