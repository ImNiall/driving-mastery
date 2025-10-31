let assistantId =
  process.env.OPENAI_ASSISTANT_ID && process.env.OPENAI_ASSISTANT_ID.length > 0
    ? process.env.OPENAI_ASSISTANT_ID
    : "";

if (!assistantId) {
  console.warn(
    "[assistant-config] OPENAI_ASSISTANT_ID is not set. Assistant endpoints will be disabled.",
  );
}

export { assistantId };
