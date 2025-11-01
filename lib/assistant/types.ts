import type { Json } from "@/src/types/supabase";

export type AssistantMessageRole = "user" | "assistant" | "system" | "tool";

export type AssistantMessageStatus =
  | "pending"
  | "complete"
  | "error"
  | "requires_action";

export type AssistantMessageRecord = {
  id: string;
  threadId: string;
  role: AssistantMessageRole;
  content: string;
  raw: Json | null;
  status: AssistantMessageStatus | null;
  createdAt: string;
  updatedAt: string;
};

export type AssistantThreadSummary = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: Json | null;
};

export type AssistantThreadDetail = AssistantThreadSummary & {
  openaiThreadId: string;
  messages: AssistantMessageRecord[];
};
