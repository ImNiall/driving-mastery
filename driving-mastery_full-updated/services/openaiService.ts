import { ChatMessage, QuizAction } from "../types";

export const getChatResponse = async (
  history: ChatMessage[],
  token?: string
): Promise<{ text: string; action?: QuizAction }> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({ history }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`API error ${resp.status}: ${errText}`);
    }
    const data = await resp.json();
    return { text: data.text as string, action: data.action as QuizAction | undefined };
  } catch (err) {
    console.error('Error calling /api/chat:', err);
    return { text: "Sorry, I couldn't reach the chat service right now. Please try again in a moment." };
  }
};
