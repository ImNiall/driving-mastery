import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.ASSISTANT_ID ?? "";
const pollIntervalMs = 1200;
const maxPollAttempts = 8;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMessageToAssistant({
  threadId,
  message,
}: {
  threadId: string;
  message: string;
}) {
  if (!assistantId) {
    throw new Error("Assistant is not configured");
  }

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  let attempts = 0;
  while (runStatus.status !== "completed") {
    if (runStatus.status === "requires_action") {
      throw new Error("Assistant run requires additional action");
    }
    if (runStatus.status === "failed") {
      throw new Error("Assistant run failed");
    }
    if (runStatus.status === "cancelled" || runStatus.status === "expired") {
      throw new Error(`Assistant run ${runStatus.status}`);
    }
    if (attempts >= maxPollAttempts) {
      throw new Error("Assistant response timed out");
    }
    await delay(pollIntervalMs);
    attempts += 1;
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  const lastMessage = messages.data.find((m) => m.role === "assistant");

  return {
    text:
      lastMessage?.content[0]?.type === "text"
        ? lastMessage.content[0].text.value
        : "",
    threadId,
  };
}

export async function createThread() {
  const thread = await openai.beta.threads.create();
  return thread.id;
}
