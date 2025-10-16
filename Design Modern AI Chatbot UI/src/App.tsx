import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { LandingView } from "./components/LandingView";
import { ChatView } from "./components/ChatView";
import { InputBar } from "./components/InputBar";
import { Button } from "./components/ui/button";
import { Menu } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  messages: Message[];
}

// Mock AI responses
const mockResponses = [
  "I'd be happy to help you with that! Let me break this down for you step by step.",
  "That's a great question! Here's what you need to know:",
  "I understand what you're looking for. Let me provide you with a comprehensive answer.",
  "Absolutely! I can help you with that. Here's a detailed explanation:",
  "Great! Let me assist you with that request.",
];

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const createNewConversation = (initialMessage?: string) => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: initialMessage || "New Conversation",
      timestamp: formatTimestamp(),
      preview: initialMessage || "Start chatting...",
      messages: [],
    };

    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newConv.id);

    if (initialMessage) {
      // Add user message and simulate AI response
      setTimeout(() => {
        handleSendMessage(initialMessage, newConv.id);
      }, 100);
    }

    // Close sidebar on mobile after creating conversation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleStartChat = (prompt: string) => {
    createNewConversation(prompt);
  };

  const handleSendMessage = (content: string, convId?: string) => {
    const targetId = convId || currentConversationId;
    if (!targetId) {
      createNewConversation(content);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: formatTime(),
    };

    setConversations((convs) =>
      convs.map((conv) => {
        if (conv.id === targetId) {
          const updatedMessages = [...conv.messages, userMessage];
          return {
            ...conv,
            messages: updatedMessages,
            preview: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            title: conv.messages.length === 0 ? content.substring(0, 40) : conv.title,
          };
        }
        return conv;
      })
    );

    // Simulate AI typing and response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: formatTime(),
      };

      setConversations((convs) =>
        convs.map((conv) =>
          conv.id === targetId
            ? { ...conv, messages: [...conv.messages, aiMessage] }
            : conv
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <span className="text-white text-xs">AI</span>
            </div>
            <span className="font-semibold">Chat A.I+</span>
          </div>
        </div>

        {/* Content Area */}
        {currentConversation ? (
          <>
            <ChatView
              conversationTitle={currentConversation.title}
              messages={currentConversation.messages}
              isTyping={isTyping}
            />
            <InputBar onSend={handleSendMessage} disabled={isTyping} />
          </>
        ) : (
          <>
            <LandingView onStartChat={handleStartChat} />
            <InputBar onSend={(msg) => createNewConversation(msg)} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
