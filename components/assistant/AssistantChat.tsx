"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import { AssistantStream } from "openai/lib/AssistantStream";
import type { AssistantStreamEvents } from "openai/lib/AssistantStream";
import type { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import styles from "./assistant-chat.module.css";

type StreamEvent = Parameters<AssistantStreamEvents["event"]>[0];
type RequiresActionEvent = Extract<
  StreamEvent,
  { event: "thread.run.requires_action" }
>;

type MessageRole = "user" | "assistant" | "code";

type Message = {
  role: MessageRole;
  text: string;
};

type AssistantChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall,
  ) => Promise<string>;
};

function UserMessage({ text }: { text: string }) {
  return <div className={styles.userMessage}>{text}</div>;
}

function AssistantMessage({ text }: { text: string }) {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
}

function CodeMessage({ text }: { text: string }) {
  return (
    <div className={styles.codeMessage}>
      {text.split("\n").map((line, index) => (
        <div key={index}>
          <span>{`${index + 1}. `}</span>
          {line}
        </div>
      ))}
    </div>
  );
}

function MessageItem({ role, text }: Message) {
  if (role === "user") return <UserMessage text={text} />;
  if (role === "assistant") return <AssistantMessage text={text} />;
  if (role === "code") return <CodeMessage text={text} />;
  return null;
}

const AssistantChat = ({
  functionCallHandler = async () => "",
}: AssistantChatProps) => {
  const [threadId, setThreadId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;
    const createThread = async () => {
      try {
        const response = await fetch("/api/assistants/threads", {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(`Thread creation failed (${response.status})`);
        }
        const data = (await response.json()) as { threadId: string };
        if (!cancelled) {
          setThreadId(data.threadId);
        }
      } catch (error) {
        console.error("[AssistantChat] failed to create thread", error);
        if (!cancelled) {
          setInputDisabled(true);
        }
      }
    };
    void createThread();
    return () => {
      cancelled = true;
    };
  }, []);

  const appendMessage = useCallback((role: MessageRole, text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  }, []);

  const appendToLastMessage = useCallback((delta: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1]!;
      const updated: Message = { ...last, text: `${last.text}${delta}` };
      return [...prev.slice(0, -1), updated];
    });
  }, []);

  const annotateLastMessage = useCallback((annotations: any[]) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1]!;
      const updated: Message = { ...last };
      annotations.forEach((annotation) => {
        if (annotation?.type === "file_path") {
          updated.text = updated.text.replaceAll(
            annotation.text,
            `/api/files/${annotation.file_path.file_id}`,
          );
        }
      });
      return [...prev.slice(0, -1), updated];
    });
  }, []);

  const handleTextCreated = useCallback(() => {
    appendMessage("assistant", "");
  }, [appendMessage]);

  const handleTextDelta = useCallback(
    (delta: { value?: string; annotations?: unknown[] }) => {
      if (typeof delta.value === "string") {
        appendToLastMessage(delta.value);
      }
      if (Array.isArray(delta.annotations) && delta.annotations.length > 0) {
        annotateLastMessage(delta.annotations as any[]);
      }
    },
    [appendToLastMessage, annotateLastMessage],
  );

  const handleImageFileDone = useCallback(
    (image: { file_id: string }) => {
      appendToLastMessage(
        `\n![${image.file_id}](/api/files/${image.file_id})\n`,
      );
    },
    [appendToLastMessage],
  );

  const handleToolCallCreated = useCallback(
    (toolCall: { type?: string }) => {
      if (toolCall?.type === "code_interpreter") {
        appendMessage("code", "");
      }
    },
    [appendMessage],
  );

  const handleToolCallDelta = useCallback(
    (delta: { type?: string; code_interpreter?: { input?: string } }) => {
      if (delta?.type === "code_interpreter") {
        const input = delta.code_interpreter?.input;
        if (typeof input === "string" && input.length > 0) {
          appendToLastMessage(input);
        }
      }
    },
    [appendToLastMessage],
  );

  function handleRunCompleted() {
    setInputDisabled(false);
  }

  async function handleRequiresAction(event: RequiresActionEvent) {
    const runId = event.data.id;
    const requiredAction = event.data.required_action;
    if (!requiredAction || requiredAction.type !== "submit_tool_outputs") {
      handleRunCompleted();
      return;
    }

    const toolCalls = (requiredAction.submit_tool_outputs.tool_calls ??
      []) as RequiredActionFunctionToolCall[];
    setInputDisabled(true);
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall: RequiredActionFunctionToolCall) => {
        const result = await functionCallHandler(toolCall);
        return {
          output: result,
          tool_call_id: toolCall.id,
        };
      }),
    );

    const response = await fetch(
      `/api/assistants/threads/${threadId}/actions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, toolCallOutputs }),
      },
    );
    if (!response.body) {
      throw new Error("Assistant action stream missing");
    }
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  }

  function handleReadableStream(stream: AssistantStream) {
    stream.on("textCreated", handleTextCreated);
    stream.on("textDelta", handleTextDelta);
    stream.on("imageFileDone", handleImageFileDone);
    stream.on("toolCallCreated", handleToolCallCreated);
    stream.on("toolCallDelta", handleToolCallDelta);
    stream.on("event", (event) => {
      if (event.event === "thread.run.requires_action") {
        handleRequiresAction(event as RequiresActionEvent);
      }
      if (event.event === "thread.run.completed") {
        handleRunCompleted();
      }
    });
  }

  async function sendMessage(text: string) {
    const response = await fetch(
      `/api/assistants/threads/${threadId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content: text }),
      },
    );
    if (!response.body) {
      throw new Error("Assistant response stream missing");
    }
    const stream = AssistantStream.fromReadableStream(response.body);
    handleReadableStream(stream);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed || !threadId) return;
    appendMessage("user", trimmed);
    setUserInput("");
    setInputDisabled(true);
    try {
      await sendMessage(trimmed);
    } catch (error) {
      console.error("[AssistantChat] send error", error);
      appendMessage(
        "assistant",
        "There was a problem sending that message. Please try again.",
      );
      setInputDisabled(false);
    }
  };

  const inputPlaceholder = useMemo(() => {
    if (!threadId) return "Preparing assistant…";
    if (inputDisabled) return "Assistant thinking…";
    return "Ask me anything about your driving theory prep";
  }, [inputDisabled, threadId]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((message, index) => (
          <MessageItem key={`${message.role}-${index}`} {...message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          placeholder={inputPlaceholder}
          disabled={!threadId || inputDisabled}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled || !threadId}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AssistantChat;
