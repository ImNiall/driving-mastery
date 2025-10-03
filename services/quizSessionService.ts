import { createClient } from '@supabase/supabase-js';
import { UserAnswer, Question as QuestionType } from '../types';

// Types for quiz sessions
export interface QuizSession {
  id?: string;
  user_id: string;
  module_slug: string;
  current_index: number;
  questions: QuestionType[];
  answers: UserAnswer[];
  state: 'idle' | 'active' | 'finished';
  created_at?: string;
  updated_at?: string;
}

// Initialize Supabase client
// Try to get credentials from various sources
let supabaseUrl: string;
let supabaseAnonKey: string;

// Check Vite env (client-side)
if (typeof import.meta !== 'undefined' && import.meta.env) {
  // @ts-ignore - Vite env variables
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // @ts-ignore - Vite env variables
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

// Check process.env (server-side) if not found in Vite env
if (!supabaseUrl && typeof process !== 'undefined' && process.env) {
  supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
}

// Create a singleton client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase URL or anon key');
      throw new Error('Supabase configuration missing');
    }
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

/**
 * Get the current quiz session for a user and module
 */
export async function getQuizSession(userId: string, moduleSlug: string): Promise<QuizSession | null> {
  try {
    console.log('[QuizSessionService] Getting session for:', { userId, moduleSlug });
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('module_slug', moduleSlug)
      .single();
    
    console.log('[QuizSessionService] Get session result:', { success: !error, error: error?.message, hasData: !!data });
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No session found - this is not an error
        return null;
      }
      console.error('Error fetching quiz session:', error);
      throw error;
    }
    
    return data as QuizSession;
  } catch (err) {
    console.error('Failed to get quiz session:', err);
    return null;
  }
}

/**
 * Create or update a quiz session
 */
export async function upsertQuizSession(session: QuizSession): Promise<QuizSession | null> {
  try {
    console.log('[QuizSessionService] Upserting session:', { 
      userId: session.user_id, 
      moduleSlug: session.module_slug,
      index: session.current_index,
      state: session.state
    });
    const supabase = getSupabaseClient();
    // Type assertion to handle Supabase typing issues
    const { data, error } = await supabase
      .from('quiz_sessions')
      .upsert(session as any, { onConflict: 'user_id,module_slug' })
      .select()
      .single();
      
    console.log('[QuizSessionService] Upsert result:', { success: !error, error: error?.message, sessionId: data?.id });
    
    if (error) {
      console.error('Error upserting quiz session:', error);
      throw error;
    }
    
    return data as QuizSession;
  } catch (err) {
    console.error('Failed to upsert quiz session:', err);
    return null;
  }
}

/**
 * Delete a quiz session
 */
export async function deleteQuizSession(userId: string, moduleSlug: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('quiz_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('module_slug', moduleSlug);
    
    if (error) {
      console.error('Error deleting quiz session:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to delete quiz session:', err);
    return false;
  }
}

/**
 * Get all quiz sessions for a user
 */
export async function getUserQuizSessions(userId: string): Promise<QuizSession[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user quiz sessions:', error);
      throw error;
    }
    
    return data as QuizSession[];
  } catch (err) {
    console.error('Failed to get user quiz sessions:', err);
    return [];
  }
}

/**
 * Zustand-specific functions for quiz state persistence
 */
type ZustandPayload = { quizId: string; state: any };

/**
 * Upsert a quiz session with Zustand state
 */
export async function upsertZustandQuizSession(userId: string, payload: ZustandPayload) {
  try {
    const supabase = getSupabaseClient();
    return supabase.from('quiz_sessions').upsert({
      user_id: userId, // Clerk user IDs are UUIDs, so this will work with our UUID column
      quiz_id: payload.quizId, 
      state: payload.state, 
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,quiz_id' });
  } catch (err) {
    console.error('Failed to upsert Zustand quiz session:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch a quiz session for Zustand state
 */
export async function fetchZustandQuizSession(userId: string, quizId: string) {
  try {
    const supabase = getSupabaseClient();
    return supabase.from('quiz_sessions').select('*').eq('user_id', userId).eq('quiz_id', quizId).maybeSingle();
  } catch (err) {
    console.error('Failed to fetch Zustand quiz session:', err);
    return { data: null, error: err };
  }
}
