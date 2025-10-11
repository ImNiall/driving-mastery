import { Category, LeaderboardEntry } from "@/types";

export const DVSA_CATEGORIES: Category[] = Object.values(Category);

export const MASTERY_POINTS = {
  CORRECT_ANSWER: 10,
  ACCURACY_BONUS: {
    PASS: 25, // 86%+
    EXCELLENT: 50, // 90%+
    FLAWLESS: 100, // 100%
  },
  MODULE_MASTERY: 150,
};

export const LEADERBOARD_MOCK_DATA: LeaderboardEntry[] = [
  { name: "Amelia K.", masteryPoints: 1820 },
  { name: "Kai B.", masteryPoints: 1765 },
  { name: "Sanjay R.", masteryPoints: 1650 },
  { name: "Mia L.", masteryPoints: 1515 },
  { name: "Elliot N.", masteryPoints: 1430 },
];
