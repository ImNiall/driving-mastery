import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const resolveBaseUrl = () => {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return undefined;
};

export async function askTheo(userId: string, userMessage: string) {
  const workflowId = process.env.WORKFLOW_ID;
  if (!workflowId) {
    throw new Error("WORKFLOW_ID is not configured");
  }

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    throw new Error("APP_BASE_URL is not configured");
  }

  let res: any = await (client.responses as any).create({
    workflow: workflowId,
    input: [{ role: "user", content: userMessage }],
    metadata: { user_id: userId },
  });

  while (res.required_action?.type === "submit_tool_outputs") {
    const calls = res.required_action.submit_tool_outputs.tool_calls;

    const outputs = await Promise.all(
      calls.map(async (tc: any) => {
        const fn = tc.function.name;
        const args = tc.function.arguments
          ? JSON.parse(tc.function.arguments)
          : {};

        if (fn === "get_user_progress") {
          const r = await fetch(
            `${baseUrl}/api/agent-tools/get_user_progress`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(args),
            },
          );
          if (!r.ok) {
            return {
              tool_call_id: tc.id,
              output: JSON.stringify({
                error: "tool_http_error",
                status: r.status,
              }),
            };
          }
          const json = await r.json();
          return { tool_call_id: tc.id, output: JSON.stringify(json) };
        }

        return {
          tool_call_id: tc.id,
          output: JSON.stringify({ error: "unhandled_tool", name: fn }),
        };
      }),
    );

    res = await (client.responses as any).submitToolOutputs({
      response_id: res.id,
      tool_outputs: outputs,
    });
  }

  return res.output_text ?? "";
}
