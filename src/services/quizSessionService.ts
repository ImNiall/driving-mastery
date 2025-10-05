import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  (import.meta as any).env?.VITE_SUPABASE_URL as string, 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string
);

type Payload = { quizId: string; state: any };

export async function upsertQuizSession(userId: string, payload: Payload) {
  return supabase.from('quiz_sessions').upsert({
    user_id: userId, 
    quiz_id: payload.quizId, 
    state: payload.state, 
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,quiz_id' });
}

export async function fetchQuizSession(userId: string, quizId: string) {
  return supabase.from('quiz_sessions').select('*').eq('user_id', userId).eq('quiz_id', quizId).maybeSingle();
}
