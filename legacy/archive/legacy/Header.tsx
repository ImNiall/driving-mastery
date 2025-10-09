import React from "react";
import { supabase } from "../src/lib/supabase";
import { useAuthCtx } from "../src/providers/AuthProvider";
import { View } from "../types";
import {
  HomeIcon,
  QuizIcon,
  BookOpenIcon,
  ChatIcon,
  TrophyIcon,
} from "./icons";

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: "dashboard", icon: HomeIcon, label: "Dashboard" },
    { id: "leaderboard", icon: TrophyIcon, label: "Leaderboard" },
    { id: "quiz", icon: QuizIcon, label: "Quiz" },
    { id: "modules", icon: BookOpenIcon, label: "Modules" },
    { id: "chat", icon: ChatIcon, label: "AI Mentor" },
    { id: "pricing", icon: TrophyIcon, label: "Pricing" },
  ] as const;

  const { user } = useAuthCtx();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-blue">Driving Mastery</h1>
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                currentView === item.id
                  ? "bg-brand-blue-light text-brand-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </button>
          ))}
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-sm text-gray-600 mr-2">
            {user?.email ? `Hello, ${user.email}` : "Guest"}
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </nav>
      </div>
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t border-t border-gray-200 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center p-2 w-full text-xs transition-colors duration-200 ${
              currentView === item.id ? "text-brand-blue" : "text-gray-500"
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
