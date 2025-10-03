import { getSupabaseClient } from './quizSessionService';

/**
 * Check if the quiz_sessions table exists in Supabase
 */
export async function checkQuizSessionsTable(): Promise<{exists: boolean; error?: string}> {
  try {
    console.log('[CheckSupabase] Verifying quiz_sessions table exists...');
    const supabase = getSupabaseClient();
    
    // Try to query the table structure
    const { data, error } = await supabase
      .from('quiz_sessions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('[CheckSupabase] Error checking table:', error);
      return { exists: false, error: error.message };
    }
    
    console.log('[CheckSupabase] Table check successful:', { exists: true });
    return { exists: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[CheckSupabase] Exception checking table:', errorMessage);
    return { exists: false, error: errorMessage };
  }
}

/**
 * Verify Supabase connection and configuration
 */
export async function verifySupabaseSetup(): Promise<{
  connected: boolean;
  tableExists: boolean;
  error?: string;
}> {
  try {
    console.log('[CheckSupabase] Verifying Supabase connection...');
    const supabase = getSupabaseClient();
    
    // Check if we can connect to Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('[CheckSupabase] Connection error:', error);
      return { connected: false, tableExists: false, error: error.message };
    }
    
    console.log('[CheckSupabase] Connection successful');
    
    // Check if the quiz_sessions table exists
    const tableCheck = await checkQuizSessionsTable();
    
    return { 
      connected: true, 
      tableExists: tableCheck.exists,
      error: tableCheck.error
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[CheckSupabase] Exception during verification:', errorMessage);
    return { connected: false, tableExists: false, error: errorMessage };
  }
}
