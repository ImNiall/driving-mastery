import { createClient } from '@supabase/supabase-js';
import debounce from 'lodash.debounce';
import { Question, UserAnswer } from '../types';

/**
 * Debounced function to update quiz attempt progress in Supabase
 */
export const upsertQuizProgress = debounce(async (
  supabase: ReturnType<typeof createClient>,
  attemptId: string,
  moduleSlug: string,
  userId: string | null | undefined,
  currentIndex: number,
  state: 'idle' | 'active' | 'finished'
) => {
  try {
    console.log('[Supabase] Upserting quiz progress:', { attemptId, moduleSlug, currentIndex, state });
    
    await supabase
      .from('quiz_attempts')
      .upsert({
        id: attemptId,
        user_id: userId || null,
        module_slug: moduleSlug,
        current_index: currentIndex,
        state
      }, {
        onConflict: 'id'
      });
      
  } catch (err) {
    console.error('[Supabase] Failed to upsert quiz progress:', err);
  }
}, 400);

/**
 * Debounced function to save quiz answers in Supabase
 */
export const upsertQuizAnswers = debounce(async (
  supabase: ReturnType<typeof createClient>,
  attemptId: string,
  answers: UserAnswer[]
) => {
  if (!answers.length) return;
  
  try {
    console.log('[Supabase] Upserting quiz answers:', { attemptId, answerCount: answers.length });
    
    // Format answers for Supabase
    const formattedAnswers = answers.map((answer, index) => ({
      attempt_id: attemptId,
      q_index: index,
      answer: answer
    }));
    
    await supabase
      .from('quiz_answers')
      .upsert(formattedAnswers, {
        onConflict: 'attempt_id,q_index'
      });
      
  } catch (err) {
    console.error('[Supabase] Failed to upsert quiz answers:', err);
  }
}, 400);

/**
 * Debounced function to save quiz questions in Supabase
 */
export const upsertQuizQuestions = debounce(async (
  supabase: ReturnType<typeof createClient>,
  attemptId: string,
  questions: Question[]
) => {
  try {
    console.log('[Supabase] Upserting quiz questions:', { attemptId, questionCount: questions.length });
    
    await supabase
      .from('quiz_attempts')
      .update({
        questions: questions
      })
      .eq('id', attemptId);
      
  } catch (err) {
    console.error('[Supabase] Failed to upsert quiz questions:', err);
  }
}, 400);

/**
 * Load quiz attempt data from Supabase
 */
export async function loadQuizAttempt(
  supabase: ReturnType<typeof createClient>,
  attemptId: string
) {
  try {
    console.log('[Supabase] Loading quiz attempt:', { attemptId });
    
    const [attemptResponse, answersResponse] = await Promise.all([
      supabase
        .from('quiz_attempts')
        .select('*')
        .eq('id', attemptId)
        .single(),
      supabase
        .from('quiz_answers')
        .select('*')
        .eq('attempt_id', attemptId)
        .order('q_index', { ascending: true })
    ]);
    
    return {
      attempt: attemptResponse.data,
      answers: answersResponse.data || [],
      error: attemptResponse.error || answersResponse.error
    };
    
  } catch (err) {
    console.error('[Supabase] Failed to load quiz attempt:', err);
    return { attempt: null, answers: [], error: err };
  }
}
