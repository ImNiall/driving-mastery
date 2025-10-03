import React from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * Hook to determine when authentication is fully initialized
 * Prevents rendering stateful components before auth is ready
 */
export function useAuthReady(supabase: ReturnType<typeof createClient>) {
  const [ready, setReady] = React.useState(false);
  
  React.useEffect(() => {
    let cancelled = false;
    
    // Force initial auth resolution
    (async () => {
      try {
        await supabase.auth.getSession();
        if (!cancelled) setReady(true);
      } catch (err) {
        console.error("Auth initialization error:", err);
        // Still mark as ready to avoid blocking the UI indefinitely
        if (!cancelled) setReady(true);
      }
    })();
    
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      if (!cancelled) setReady(true);
    });
    
    return () => { 
      cancelled = true; 
      authListener.subscription?.unsubscribe(); 
    };
  }, [supabase]);
  
  return ready;
}
