import { UserAnswer } from '../types';

const WRONG_ANSWERS_KEY = 'driving_mastery_wrong_answers';

// Interface for storing wrong answers by module slug
interface WrongAnswersByModule {
  [moduleSlug: string]: UserAnswer[];
}

/**
 * Store wrong answers from a quiz session
 * @param wrongAnswers Array of wrong UserAnswer objects
 */
export const storeWrongAnswers = (wrongAnswers: UserAnswer[]): void => {
  try {
    // Get existing wrong answers
    const existingData = localStorage.getItem(WRONG_ANSWERS_KEY);
    const existingWrongAnswers: WrongAnswersByModule = existingData ? JSON.parse(existingData) : {};
    
    // Group new wrong answers by module slug
    const newWrongAnswersByModule: WrongAnswersByModule = {};
    
    wrongAnswers.forEach(answer => {
      if (!answer.moduleSlug) return;
      
      if (!newWrongAnswersByModule[answer.moduleSlug]) {
        newWrongAnswersByModule[answer.moduleSlug] = [];
      }
      
      newWrongAnswersByModule[answer.moduleSlug].push(answer);
    });
    
    // Merge with existing data
    const mergedData: WrongAnswersByModule = { ...existingWrongAnswers };
    
    Object.keys(newWrongAnswersByModule).forEach(moduleSlug => {
      if (!mergedData[moduleSlug]) {
        mergedData[moduleSlug] = [];
      }
      
      // Add new wrong answers, avoiding duplicates by questionId
      const existingIds = new Set(mergedData[moduleSlug].map(a => a.questionId));
      
      newWrongAnswersByModule[moduleSlug].forEach(answer => {
        if (!existingIds.has(answer.questionId)) {
          mergedData[moduleSlug].push(answer);
        }
      });
    });
    
    // Store back to localStorage
    localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(mergedData));
  } catch (e) {
    console.error('[wrongAnswers] Error storing wrong answers:', e);
  }
};

/**
 * Get wrong answers for a specific module
 * @param moduleSlug The module slug to get wrong answers for
 * @returns Array of wrong UserAnswer objects for the module
 */
export const getWrongAnswersForModule = (moduleSlug: string): UserAnswer[] => {
  try {
    const data = localStorage.getItem(WRONG_ANSWERS_KEY);
    if (!data) return [];
    
    const wrongAnswersByModule: WrongAnswersByModule = JSON.parse(data);
    return wrongAnswersByModule[moduleSlug] || [];
  } catch (e) {
    console.error('[wrongAnswers] Error getting wrong answers:', e);
    return [];
  }
};

/**
 * Clear wrong answers for a specific module
 * @param moduleSlug The module slug to clear wrong answers for
 */
export const clearWrongAnswersForModule = (moduleSlug: string): void => {
  try {
    const data = localStorage.getItem(WRONG_ANSWERS_KEY);
    if (!data) return;
    
    const wrongAnswersByModule: WrongAnswersByModule = JSON.parse(data);
    if (wrongAnswersByModule[moduleSlug]) {
      delete wrongAnswersByModule[moduleSlug];
      localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(wrongAnswersByModule));
    }
  } catch (e) {
    console.error('[wrongAnswers] Error clearing wrong answers:', e);
  }
};

/**
 * Clear all wrong answers
 */
export const clearAllWrongAnswers = (): void => {
  try {
    localStorage.removeItem(WRONG_ANSWERS_KEY);
  } catch (e) {
    console.error('[wrongAnswers] Error clearing all wrong answers:', e);
  }
};
