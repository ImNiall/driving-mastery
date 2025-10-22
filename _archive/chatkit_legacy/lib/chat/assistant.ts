import type { ChatMessage } from "@/types/chat";

function summarize(content: string) {
  const trimmed = content.trim();
  if (trimmed.length <= 240) {
    return trimmed;
  }
  return `${trimmed.slice(0, 237)}...`;
}

export async function getAssistantResponse(
  history: ChatMessage[],
): Promise<string> {
  const lastUser = [...history]
    .reverse()
    .find((message) => message.role === "user");
  const base = lastUser?.content ?? "How can I help you today?";
  const summary = summarize(base);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [
    "(Mock response)",
    "I heard you say:",
    summary || "I did not catch that, but I'm here to help!",
  ].join("\n\n");
}
