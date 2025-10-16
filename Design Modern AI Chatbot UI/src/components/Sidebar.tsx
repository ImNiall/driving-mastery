import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Plus, Search, Settings, LogOut, MessageSquare, Menu, X } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Chat A.I+</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <Separator />

        {/* Conversation History */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {conversations.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Start your first chat!</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg
                    transition-colors duration-150
                    ${
                      currentConversationId === conversation.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {conversation.preview}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <div className="p-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-400 text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            <Button variant="ghost" size="sm" className="flex-1">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
