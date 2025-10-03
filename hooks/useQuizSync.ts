import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuizStore } from '../store/quizStore';
import { fetchZustandQuizSession, upsertZustandQuizSession } from '../services/quizSessionService';

let t: any;

export default function useQuizSync() {
  const { user, isSignedIn } = useUser();
  const state = useQuizStore();
  
  // Hydrate from DB once auth is known
  useEffect(() => {
    (async () => {
      if (!isSignedIn || !state.quizId || !user) return;
      
      try {
        // Ensure we're using the user ID as a string for maximum compatibility
        const userId = user.id.toString();
        const { data } = await fetchZustandQuizSession(userId, state.quizId);
        
        if (data?.state?.updated_at && (!state.startedAt || data.state.updated_at > state.startedAt)) {
          // naive reconcile: prefer DB if newer
          useQuizStore.setState({ ...state, ...data.state });
        }
      } catch (error) {
        console.error('Failed to hydrate quiz state from DB:', error);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, state.quizId, user]);
  
  // Debounced write-behind
  useEffect(() => {
    if (!isSignedIn || !state.quizId || !user) return;
    
    clearTimeout(t);
    t = setTimeout(() => {
      // Ensure we're using the user ID as a string for maximum compatibility
      const userId = user.id.toString();
      
      upsertZustandQuizSession(userId, { 
        quizId: state.quizId, 
        state: { ...state, updated_at: new Date().toISOString() } 
      }).catch(error => {
        console.error('Failed to sync quiz state to DB:', error);
      });
    }, 1200);
    
    return () => clearTimeout(t);
  }, [isSignedIn, state, user]);
}
