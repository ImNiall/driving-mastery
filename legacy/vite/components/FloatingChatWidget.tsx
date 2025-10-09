import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, QuizAction } from "../types";
import { getChatResponse } from "../services/openaiService";
import { ChatIcon, SendIcon, SpinnerIcon, XIcon } from "./icons";

interface FloatingChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomQuiz: (action: QuizAction) => void;
  initialContextMessage: string | null; // A message to prime the conversation
}

const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  isOpen,
  onClose,
  onStartCustomQuiz,
  initialContextMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isInitialized.current) {
      isInitialized.current = true;

      const initializeChat = async () => {
        setIsLoading(true);
        // This initial message isn't shown to the user but prompts the AI's greeting.
        // If there's a specific context (like from a quiz), use it. Otherwise, use a generic greeting.
        const initialUserMessage: ChatMessage = {
          role: "user",
          text: initialContextMessage || "Hi Theo.",
        };
        const { text, action } = await getChatResponse([initialUserMessage]);
        const modelMessage: ChatMessage = { role: "model", text, action };
        setMessages([modelMessage]);
        setIsLoading(false);
      };

      initializeChat();
    }
  }, [isOpen, initialContextMessage]);

  // When the widget is closed, reset its initialized state so it can be re-initialized next time it opens
  useEffect(() => {
    if (!isOpen) {
      isInitialized.current = false;
      setMessages([]); // Clear messages on close
    }
  }, [isOpen]);

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;
    const userMessage: ChatMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    const { text, action } = await getChatResponse(newMessages);
    const modelMessage: ChatMessage = { role: "model", text, action };
    setMessages((prev) => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <div
      className={`
        absolute bottom-20 right-0
        bg-white rounded-lg shadow-2xl w-96 max-w-[calc(100vw-2rem)] h-[70vh] max-h-[500px] flex flex-col
        transition-all duration-300 ease-in-out transform origin-bottom-right
        ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"}
    `}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-slate-50 rounded-t-lg">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <ChatIcon className="w-6 h-6 mr-2 text-brand-blue" />
          AI Mentor
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
          aria-label="Close chat"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {!isInitialized.current && isLoading ? (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
              <span className="animate-pulse text-sm">
                AI Mentor is getting ready...
              </span>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-brand-blue text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.action?.type === "start_quiz" && (
                  <button
                    onClick={() => onStartCustomQuiz(msg.action!)}
                    className="mt-2 w-full bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Start {msg.action.questionCount}-Question Quiz
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        {isInitialized.current && isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-2 rounded-lg">
              <SpinnerIcon className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a quick question..."
            className="w-full bg-transparent p-2 border-none focus:ring-0 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="p-2 rounded-full bg-brand-blue text-white disabled:bg-gray-300 transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingChatWidget;
