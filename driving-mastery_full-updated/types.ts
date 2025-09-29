export enum Category {
  ALERTNESS = "Alertness",
  ATTITUDE = "Attitude",
  SAFETY_AND_YOUR_VEHICLE = "Safety and your vehicle",
  SAFETY_MARGINS = "Safety margins",
  HAZARD_AWARENESS = "Hazard awareness",
  VULNERABLE_ROAD_USERS = "Vulnerable road users",
  OTHER_TYPES_OF_VEHICLE = "Other types of vehicle",
  VEHICLE_HANDLING = "Vehicle handling",
  MOTORWAY_RULES = "Motorway rules",
  RULES_OF_THE_ROAD = "Rules of the road",
  ROAD_AND_TRAFFIC_SIGNS = "Road and traffic signs",
  DOCUMENTS = "Documents",
  INCIDENTS_ACCIDENTS_EMERGENCIES = "Incidents, accidents and emergencies",
  VEHICLE_LOADING = "Vehicle loading"
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  options: Answer[];
  explanation: string;
  category: Category;
  image?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
}

export interface QuizResult {
  category: Category;
  correct: number;
  total: number;
}

export interface QuizAttempt {
  length: number;
  score: number;
  total: number;
  date: string;
}

export interface StudyPlanStep {
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
}

export interface StudyPlan {
  name: string;
  description: string;
  steps: StudyPlanStep[];
}

export interface LearningModule {
  slug: string;
  title: string;
  category: Category;
  summary: string;
  content: string; // Markdown content
}

export interface QuizAction {
    type: 'start_quiz';
    categories: Category[];
    questionCount: number;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    action?: QuizAction;
}

export interface FinalQuizResults {
  results: QuizResult[];
  totalCorrect: number;
  totalQuestions: number;
  finalUserAnswers: UserAnswer[];
  questions: Question[];
  flaggedQuestions: number[];
  date: string;
  pointsEarned: number;
}

export interface LeaderboardEntry {
  name: string;
  masteryPoints: number;
}

export type View = 'dashboard' | 'quiz-start' | 'quiz' | 'modules' | 'chat' | 'quiz-results' | 'leaderboard' | 'auth';