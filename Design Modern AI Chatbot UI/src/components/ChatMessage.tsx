import { Avatar, AvatarFallback } from "./ui/avatar";
import { MessageSquare, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} group`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback
          className={
            isUser
              ? 'bg-gray-200 text-gray-700'
              : 'bg-gradient-to-br from-blue-600 to-blue-400 text-white'
          }
        >
          {isUser ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 space-y-2 ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {isUser ? 'You' : 'Chat A.I+'}
          </span>
          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {timestamp}
          </span>
        </div>

        <div
          className={`
            px-4 py-3 rounded-2xl max-w-[85%] 
            ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-900 rounded-tl-sm'
            }
          `}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}
