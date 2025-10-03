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
// @ts-ignore - Vite env variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL as string;
// @ts-ignore - Vite env variables
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY as string;

// Create a singleton client
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
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
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('module_slug', moduleSlug)
      .single();
    
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
    const supabase = getSupabaseClient();
    // Type assertion to handle Supabase typing issues
    const { data, error } = await supabase
      .from('quiz_sessions')
      .upsert(session as any, { onConflict: 'user_id,module_slug' })
      .select()
      .single();
    
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
