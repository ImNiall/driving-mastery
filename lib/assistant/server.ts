import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/supabase";
import type {
  AssistantMessageRecord,
  AssistantThreadDetail,
  AssistantThreadSummary,
} from "./types";

type DbThreadRow = Database["public"]["Tables"]["assistant_threads"]["Row"];
type DbMessageRow = Database["public"]["Tables"]["assistant_messages"]["Row"];
type DbClient = SupabaseClient<Database>;

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
    status: row.status ?? null,
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
