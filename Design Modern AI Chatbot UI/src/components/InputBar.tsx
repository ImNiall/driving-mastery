import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Paperclip, Mic } from "lucide-react";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <div className="flex items-center gap-1 px-3 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-gray-600"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind..."
            disabled={disabled}
            className="
              flex-1 border-0 bg-transparent resize-none
              focus-visible:ring-0 focus-visible:ring-offset-0
              min-h-[44px] max-h-[200px]
              py-3 px-0
            "
            rows={1}
          />

          <div className="flex items-center gap-1 px-3 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-gray-600"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              size="icon"
              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
