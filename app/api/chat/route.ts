import { NextRequest } from "next/server";

const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID ?? "";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID || !OPENAI_MODEL) {
    return new Response("Missing OpenAI credentials, assistant ID, or model", {
      status: 500,
    });
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

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      assistant_id: OPENAI_ASSISTANT_ID,
      model: OPENAI_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userInput,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return new Response(text || "OpenAI Assistants API error", {
      status: res.status,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
