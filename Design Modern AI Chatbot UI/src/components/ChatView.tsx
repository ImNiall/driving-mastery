import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ChatMessage } from "./ChatMessage";
import { Badge } from "./ui/badge";
import { MoreVertical, Edit2, Trash2, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatViewProps {
  conversationTitle: string;
  messages: Message[];
  isTyping?: boolean;
}

export function ChatView({ conversationTitle, messages, isTyping }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [quickActions] = useState([
    "Explain in detail",
    "Make it shorter",
    "Give examples",
    "Continue",
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-900 truncate">{conversationTitle}</h2>
            <p className="text-gray-500">Chat A.I+ is ready to assist</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit2 className="w-4 h-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length > 0 && (
        <div className="border-b border-gray-100 px-6 py-3 bg-gray-50">
          <div className="max-w-4xl mx-auto flex gap-2 overflow-x-auto">
            {quickActions.map((action, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                {action}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">AI</span>
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
