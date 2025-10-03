import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, UserAnswer } from '../types';

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
  state: 'idle' | 'active' | 'finished';
  startedAt: string;
  
  // Actions
  setIndex: (index: number) => void;
  setQuestions: (questions: Question[]) => void;
  addAnswer: (answer: UserAnswer) => void;
  setState: (state: 'idle' | 'active' | 'finished') => void;
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
        state: 'idle',
        startedAt: new Date().toISOString(),
        
        // Actions
        setIndex: (index) => set({ currentIndex: index }),
        setQuestions: (questions) => set({ questions }),
        addAnswer: (answer) => set({ answers: [...get().answers, answer] }),
        setState: (state) => set({ state }),
        reset: () => set({
          currentIndex: 0,
          answers: [],
          state: 'idle',
          startedAt: new Date().toISOString(),
        }),
      }),
      {
        name: `quiz_${moduleSlug}_${attemptId}`, // unique per attempt and module
        storage: createJSONStorage(() => sessionStorage),
        version: 1,
      }
    )
  );
