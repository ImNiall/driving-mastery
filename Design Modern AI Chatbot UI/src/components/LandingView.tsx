import { ActionCard } from "./ActionCard";
import {
  Lightbulb,
  Code,
  BookOpen,
  Sparkles,
  FileText,
  MessageCircle,
  Calculator,
  Languages,
} from "lucide-react";

interface LandingViewProps {
  onStartChat: (prompt: string) => void;
}

export function LandingView({ onStartChat }: LandingViewProps) {
  const actions = [
    {
      icon: Lightbulb,
      title: "Explain",
      description: "Break down complex topics into simple, easy-to-understand explanations",
      prompt: "Can you explain ",
    },
    {
      icon: Code,
      title: "Generate Code",
      description: "Create code snippets, functions, or full applications in any language",
      prompt: "Help me write code for ",
    },
    {
      icon: BookOpen,
      title: "Learn",
      description: "Get help understanding new concepts, subjects, or skills step-by-step",
      prompt: "I want to learn about ",
    },
    {
      icon: FileText,
      title: "Summarize",
      description: "Condense long texts, articles, or documents into key points",
      prompt: "Can you summarize ",
    },
    {
      icon: Calculator,
      title: "Solve Problems",
      description: "Work through math problems, logic puzzles, or analytical challenges",
      prompt: "Help me solve ",
    },
    {
      icon: Languages,
      title: "Translate",
      description: "Convert text between languages while preserving meaning and context",
      prompt: "Translate this to ",
    },
    {
      icon: MessageCircle,
      title: "Brainstorm",
      description: "Generate creative ideas, solutions, or approaches for your projects",
      prompt: "Let's brainstorm ideas for ",
    },
    {
      icon: Sparkles,
      title: "Improve Writing",
      description: "Enhance your text with better clarity, grammar, and style",
      prompt: "Help me improve this text: ",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-3">
            Good day! How may I assist you today?
          </h1>
          <p className="text-gray-600">
            Choose from quick actions below or start a new chat
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {actions.map((action, index) => (
            <ActionCard
              key={index}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={() => onStartChat(action.prompt)}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Explore</h3>
            <p className="text-gray-600">
              Discover how Chat A.I+ can help you with writing, learning, coding, and creative
              tasks. Try different prompts to unlock its full potential.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Capabilities</h3>
            <p className="text-gray-600">
              Chat A.I+ can write, analyze, code, translate, and answer questions across a wide
              range of topics with contextual understanding.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Limitations</h3>
            <p className="text-gray-600">
              May occasionally generate incorrect information. Does not have access to real-time
              data or the ability to browse the internet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
