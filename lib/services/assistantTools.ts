import { supabaseAdmin } from "@/lib/supabase/admin";

export type AssistantToolResult =
  | Record<string, unknown>
  | string
  | number
  | null;

type ToolHandler = (
  args: Record<string, unknown>,
) => Promise<AssistantToolResult>;

async function getWeakestCategory(args: Record<string, unknown>) {
  const userId = args.userId ?? args.user_uuid;
  if (!userId || typeof userId !== "string") {
    throw new Error("userId is required to fetch weakest category");
  }

  const { data, error } = await supabaseAdmin.rpc("get_weakest_category", {
    user_uuid: userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  const payload = (Array.isArray(data) ? data[0] : data) as {
    dvsa_category: string | null;
    average_score: number | null;
  } | null;

  return (
    payload ?? {
      dvsa_category: null,
      average_score: null,
    }
  );
}

const toolHandlers: Record<string, ToolHandler> = {
  getWeakestCategory,
};

export async function handleAssistantToolCall(
  name: string,
  args: Record<string, unknown>,
): Promise<AssistantToolResult> {
  const handler = toolHandlers[name];
  if (!handler) {
    throw new Error(`Unsupported assistant tool: ${name}`);
  }
  return handler(args);
}
