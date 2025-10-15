import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type AssistantToolResult =
  | Record<string, unknown>
  | string
  | number
  | null;

export type AssistantToolContext = {
  userId?: string | null;
};

type ToolHandler = (
  args: Record<string, unknown>,
  context: AssistantToolContext,
) => Promise<AssistantToolResult>;

async function getWeakestCategory(
  args: Record<string, unknown>,
  context: AssistantToolContext,
) {
  const userId =
    (typeof args.userId === "string" && args.userId) ||
    (typeof args.user_uuid === "string" && args.user_uuid) ||
    (context.userId ?? undefined);

  if (!userId) {
    return {
      error: "missing_user_id",
      message: "No userId provided for weakest category lookup.",
    };
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return {
      error: "server_config",
      message: "Supabase credentials are not configured on the server.",
    };
  }

  const { data, error } = await supabaseAdmin.rpc("get_weakest_category", {
    user_uuid: userId,
  });

  if (error) {
    return {
      error: "supabase_error",
      message: error.message,
    };
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
  context: AssistantToolContext,
): Promise<AssistantToolResult> {
  const handler = toolHandlers[name];
  if (!handler) {
    return {
      error: "unsupported_tool",
      message: `Unsupported assistant tool: ${name}`,
    };
  }
  return handler(args, context);
}
