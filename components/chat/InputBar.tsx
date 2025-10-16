"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Mic, Paperclip, Send } from "lucide-react";

export type InputBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isDisabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
};

const InputBar = forwardRef<HTMLTextAreaElement, InputBarProps>(
  ({ value, onChange, onSubmit, isDisabled, placeholder, autoFocus }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    useEffect(() => {
      if (autoFocus) {
        textareaRef.current?.focus();
      }
    }, [autoFocus]);

    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
    }, [value]);

    const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
      event,
    ) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!value.trim() || isDisabled) return;
        onSubmit();
      }
    };

    return (
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <label htmlFor="chat-input" className="sr-only">
            Message Chat A.I+
          </label>
          <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
            <div className="flex items-center gap-1 px-3 py-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </div>
            <textarea
              id="chat-input"
              ref={textareaRef}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder ?? "Ask anything..."}
              disabled={isDisabled}
              rows={1}
              className="min-h-[44px] max-h-[240px] flex-1 resize-none bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <div className="flex items-center gap-1 px-3 py-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                aria-label="Record voice message"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!value.trim() || isDisabled) return;
                  onSubmit();
                }}
                disabled={!value.trim() || isDisabled}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            Press Enter to send • Shift + Enter for a new line
          </p>
        </div>
      </div>
    );
  },
);

InputBar.displayName = "InputBar";

export default InputBar;
