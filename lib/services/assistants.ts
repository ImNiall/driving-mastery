import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.ASSISTANT_ID!;

export async function sendMessageToAssistant({
  threadId,
  message,
}: {
  threadId: string;
  message: string;
}) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  while (runStatus.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
