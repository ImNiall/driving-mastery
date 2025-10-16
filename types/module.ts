export type ModuleSection = {
  id: string;
  title: string;
  body?: string;
  items?: string[];
};

export type QuizOption = {
  id: string;
  label: string;
  correct?: boolean;
  explanation?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type ModuleChecklistItem = {
  id: string;
  label: string;
  done?: boolean;
};

export type ModulePracticeTip = {
  id: string;
  label: string;
  detail?: string;
  tone?: "default" | "theo";
};

export type Module = {
  slug: string;
  title: string;
  summary: string;
  progress: number;
  stepIndex: number;
  steps: string[];
  sections: ModuleSection[];
  checklist?: ModuleChecklistItem[];
  practiceTips?: ModulePracticeTip[];
  quiz?: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
  heroImage?: string;
  estimatedDuration?: string;
  difficulty?: string;
};
