import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

type Answer = { qid: string; choice: string };

type State = {
  quizId: string | null;
  currentIndex: number;
  answers: Record<string, Answer>;
  startedAt: string | null;
};

type Actions = {
  start: (quizId: string) => void;
  goto: (i: number) => void;
  next: () => void;
  prev: () => void;
  answer: (qid: string, choice: string) => void;
  reset: () => void;
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const storage = createJSONStorage(() =>
  typeof window === "undefined" ? noopStorage : window.localStorage,
);

export const useQuizStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      quizId: null,
      currentIndex: 0,
      answers: {},
      startedAt: null,
      start: (quizId) =>
        set({
          quizId,
          currentIndex: 0,
          answers: {},
          startedAt: new Date().toISOString(),
        }),
      goto: (i) => set({ currentIndex: Math.max(0, i) }),
      next: () => set({ currentIndex: get().currentIndex + 1 }),
      prev: () => set({ currentIndex: Math.max(0, get().currentIndex - 1) }),
      answer: (qid, choice) =>
        set({ answers: { ...get().answers, [qid]: { qid, choice } } }),
      reset: () =>
        set({
          currentIndex: 0,
          answers: {},
          startedAt: new Date().toISOString(),
        }),
    }),
    {
      name: "quiz-state",
      storage,
      skipHydration: typeof window === "undefined",
    },
  ),
);
