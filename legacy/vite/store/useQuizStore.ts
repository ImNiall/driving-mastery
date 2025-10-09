import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Question, UserAnswer } from "../types";

// Custom serializer to handle circular references
const customSerializer = {
  serialize: (state: any) => {
    try {
      // Use a replacer function to handle circular references
      const seen = new WeakSet();
      const replacer = (key: string, value: any) => {
        // Skip __proto__ properties
        if (key === "__proto__") return undefined;

        // Handle circular references
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular Reference]";
          }
          seen.add(value);
        }
        return value;
      };

      return JSON.stringify(state, replacer);
    } catch (err) {
      console.error("Failed to serialize state:", err);
      return JSON.stringify({});
    }
  },
  deserialize: (str: string) => {
    try {
      return JSON.parse(str);
    } catch (err) {
      console.error("Failed to deserialize state:", err);
      return {};
    }
  },
};

/**
 * Quiz state store that persists across component remounts
 * Uses Zustand with sessionStorage persistence
 */
export interface QuizState {
  // Core identifiers
  attemptId: string;
  moduleSlug: string;

  // Quiz state
  questions: Question[];
  currentIndex: number;
  answers: UserAnswer[];
  state: "idle" | "active" | "finished";
  startedAt: string;

  // Actions
  setIndex: (index: number) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: UserAnswer) => void;
  setState: (state: "idle" | "active" | "finished") => void;
  reset: () => void;
}

export const makeQuizStore = (attemptId: string, moduleSlug: string) =>
  create<QuizState>()(
    persist(
      (set, get) => ({
        // Core identifiers
        attemptId,
        moduleSlug,

        // Quiz state
        questions: [],
        currentIndex: 0,
        answers: [],
        state: "idle",
        startedAt: new Date().toISOString(),

        // Actions
        setIndex: (index) => set({ currentIndex: index }),
        setQuestions: (questions) => set({ questions }),
        addAnswer: (answer) => set({ answers: [...get().answers, answer] }),
        setState: (state) => set({ state }),
        reset: () =>
          set({
            currentIndex: 0,
            answers: [],
            state: "idle",
            startedAt: new Date().toISOString(),
          }),
      }),
      {
        name: `quiz_${moduleSlug}_${attemptId}`, // unique per attempt and module
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            const str = sessionStorage.getItem(name);
            if (!str) return null;
            return customSerializer.deserialize(str);
          },
          setItem: (name, value) => {
            sessionStorage.setItem(name, customSerializer.serialize(value));
          },
          removeItem: (name) => sessionStorage.removeItem(name),
        })),
        version: 1,
      },
    ),
  );
