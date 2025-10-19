import { Category } from "@/types";

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
