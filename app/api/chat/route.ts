import { NextRequest } from "next/server";

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OpenAIResponseError = Error & {
  status?: number;
  body?: string;
};

const TOOL_DEFINITION = {
  type: "function",
  name: "getWeakestCategory",
  description:
    "Returns the learner's weakest DVSA category by average quiz score.",
  parameters: {
    type: "object",
    properties: {
      user_uuid: {
        type: "string",
        description:
          "Supabase user UUID whose weakest DVSA category should be retrieved.",
      },
    },
    required: ["user_uuid"],
  },
} as const;

function sseHeader() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  } as const;
}

function describeStatus(message: string) {
  return JSON.stringify({ message });
}

async function createResponse(payload: Record<string, unknown>) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    // Log error to server console for debugging
    console.error("[OpenAI API error]", res.status, text);
    const error: OpenAIResponseError = new Error(
      text || `OpenAI error ${res.status}`,
    );
    error.status = res.status;
    error.body = text;
    throw error;
  }

  return res.json();
}

async function submitToolOutputs(
  responseId: string,
  toolOutputs: Array<{ tool_call_id: string; output: string }>,
) {
  const res = await fetch(
    `https://api.openai.com/v1/responses/${responseId}/submit_tool_outputs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ tool_outputs: toolOutputs }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `OpenAI tool submit error ${res.status}`);
  }

  return res.json();
}

async function executeToolCall(req: NextRequest, toolCall: any) {
  if (!toolCall || toolCall.type !== "function") {
    throw new Error("Unsupported tool call payload");
  }

  if (toolCall.name !== "getWeakestCategory") {
    throw new Error(`Unknown tool: ${toolCall.name}`);
  }

  let args: { user_uuid?: string } = {};
  try {
    args = toolCall.arguments ? JSON.parse(toolCall.arguments) : {};
  } catch (err) {
    throw new Error("Invalid tool arguments");
  }

  if (!args.user_uuid) {
    throw new Error("getWeakestCategory requires user_uuid");
  }

  const origin = new URL(req.url);
  const toolResponse = await fetch(
    `${origin.origin}/api/get-weakest-category`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_uuid: args.user_uuid }),
    },
  );

  if (!toolResponse.ok) {
    const text = await toolResponse.text().catch(() => "");
    throw new Error(text || "Failed to load progress data");
  }

  return toolResponse.json();
}

function extractOutputText(response: any): string {
  if (!response) return "";

  const textChunks: string[] = [];

  const output = response.output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (typeof item?.text === "string") {
        textChunks.push(item.text);
      }
      if (Array.isArray(item?.content)) {
        for (const part of item.content) {
          if (typeof part?.text === "string") {
            textChunks.push(part.text);
          }
        }
      }
    }
  }

  if (textChunks.length === 0 && typeof response?.output_text === "string") {
    textChunks.push(response.output_text);
  }

  return textChunks.join("\n").trim();
}

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return new Response("Missing OPENAI_API_KEY", { status: 500 });
  }

  let userInput = "";
  try {
    const body = await req.json();
    userInput = String(body?.message ?? "");
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  if (!userInput) {
    return new Response("message required", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: string) =>
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${data}\n\n`),
        );

      send("status", describeStatus("Connecting to assistant…"));

      try {
        let response = await createResponse({
          model: MODEL,
          input: [
            {
              role: "system",
              content: `You are Driving Mastery Mentor — an AI assistant trained to help UK learner drivers prepare for their theory and hazard perception tests. You are not affiliated with the DVSA, but your knowledge and feedback align with DVSA standards.

Your role is to:
- Educate: Explain Highway Code rules, road signs, and DVSA topics in a friendly, clear way.
- Mentor: Track learner progress, highlight weak areas, and encourage steady improvement.
- Assist: Answer questions about studying, test format, scoring, bookings, or preparation strategies.

Conversation guidelines:
1. First message: greet briefly, ask an open question, and offer 2–3 simple examples (e.g. quizzes, DVSA topics, progress checks). Keep it short.
2. If the learner replies with uncertainty ("not sure", "what can you do"), list 5–6 capabilities in clear bullet points, then invite them to choose.
3. Never assume their intent. Ask what they want to work on before launching into answers.
4. Keep responses concise and motivating; avoid long paragraphs unless they request detail.
5. Maintain a professional, encouraging tone focused on helping them pass their tests.

Tool usage:
- Tool name: getWeakestCategory. Call it when the learner asks about their weakest area or similar progress insights. Supply the Supabase user UUID as \\"user_uuid\\"; if you do not have it, politely ask the learner to provide or explain why you cannot fetch it.
- If the tool returns both dvsa_category and average_score: say "Your weakest category is **{{dvsa_category}}**, with an average score of **{{average_score}}%. Would you like to practise that topic now?"
- If dvsa_category is present but average_score is null: say "Your weakest category is likely **{{dvsa_category}}**, but there's not enough quiz data for a score yet. Want to take a quick quiz to help me track your progress?"
- If the tool returns null or errors, let the learner know and offer next steps (e.g., take quizzes so data can be collected).

Quiz behaviour:
- When a learner says "quiz me" or requests practice on a topic, present a short 3–5 question quiz.
- Each question should have answers labelled A/B/C with concise wording.
- Provide feedback after they answer or at the end, depending on their request.

Hazard perception guidance:
- Explain that there are 14 clips, with one clip containing two developing hazards.
- Warn that random clicking loses points.
- Offer practice tips or further explanation when asked.

General rules:
- Reference real data via tools when available; never invent scores.
- Encourage the learner with clear next steps (study plan, modules, mock tests).
- Keep every reply actionable and aligned with DVSA expectations.
- Thank them or offer further help before ending the conversation.`,
            },
            { role: "user", content: userInput },
          ],
          tools: [TOOL_DEFINITION],
        });

        while (
          response?.required_action?.type === "submit_tool_outputs" &&
          Array.isArray(
            response?.required_action?.submit_tool_outputs?.tool_calls,
          )
        ) {
          const toolCalls =
            response.required_action.submit_tool_outputs.tool_calls;
          send("status", describeStatus("Gathering your progress data…"));

          const toolOutputs = [] as Array<{
            tool_call_id: string;
            output: string;
          }>;

          for (const call of toolCalls) {
            const result = await executeToolCall(req, call);
            toolOutputs.push({
              tool_call_id: call.id,
              output: JSON.stringify(result),
            });
          }

          response = await submitToolOutputs(response.id, toolOutputs);
        }

        const answer = extractOutputText(response);
        if (!answer) {
          throw new Error("Assistant returned no content");
        }

        send("status", describeStatus("Responding…"));
        send("assistant_message", JSON.stringify({ content: answer }));
        send("done", "{}");
        controller.close();
      } catch (err: unknown) {
        const error = err as OpenAIResponseError;
        console.error("/api/chat error", error);
        send(
          "error",
          JSON.stringify({
            message: error?.message || "assistant_error",
            status:
              typeof error?.status === "number" ? error.status : undefined,
            detail: error?.body || undefined,
          }),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, { status: 200, headers: sseHeader() });
}
