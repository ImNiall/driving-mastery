import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, QuizAction } from '../types';
import { getChatResponse } from '../services/openaiService';
import { SendIcon } from './icons';
import { useAuthCtx } from '../src/providers/AuthProvider';

interface ChatViewProps {
  onStartCustomQuiz: (action: QuizAction) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onStartCustomQuiz }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const { session } = useAuthCtx();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeChat = async () => {
        setIsLoading(true);
        // This initial message isn't shown to the user but prompts the AI's greeting.
        const initialUserMessage: ChatMessage = { role: 'user', text: 'Hi Theo.' };
        const token = session?.access_token;
        const { text, action } = await getChatResponse([initialUserMessage], token);
        
        const modelMessage: ChatMessage = { role: 'model', text, action };
        setMessages([modelMessage]);
        setIsLoading(false);
    };
    
    initializeChat();
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const token = session?.access_token;
    const { text, action } = await getChatResponse(newMessages, token);
    
    const modelMessage: ChatMessage = { role: 'model', text, action };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const renderInitialLoading = () => (
    <div className="flex justify-start">
        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl">
            <span className="animate-pulse">Your AI Mentor is getting ready...</span>
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] bg-white rounded-lg shadow-md">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 && isLoading ? renderInitialLoading() : messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
                 {msg.action?.type === 'start_quiz' && (
                  <button
                    onClick={() => onStartCustomQuiz(msg.action!)}
                    className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start {msg.action.questionCount}-Question Quiz on {msg.action.categories.join(', ')}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a rule, sign, or specific topic..."
            className="w-full bg-transparent p-3 border-none focus:ring-0"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || input.trim() === ''}
            className="p-2 rounded-full bg-brand-blue text-white disabled:bg-gray-300 transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;