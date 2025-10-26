import { NextRequest } from "next/server";

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sseHeader() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  } as const;
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

      send("status", JSON.stringify({ state: "starting" }));

      try {
        const res = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            input: [
              { role: "system", content: "You are a concise, helpful tutor." },
              { role: "user", content: userInput },
            ],
            stream: true,
          }),
        });

        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => "");
          send("error", JSON.stringify({ status: res.status, body: text }));
          controller.close();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        send("status", JSON.stringify({ state: "streaming" }));

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split(/\r?\n/).filter(Boolean);
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const payload = line.slice(6);
              send("openai", payload);
            }
          }
        }

        send("done", "{}");
        controller.close();
      } catch (err: any) {
        send(
          "error",
          JSON.stringify({ message: err?.message || "stream error" }),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, { status: 200, headers: sseHeader() });
}
