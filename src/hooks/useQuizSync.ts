import { useEffect } from 'react';
import { useAuthCtx } from '../../src/providers/AuthProvider';
import { useQuizStore } from '../../store/quizStore';
import { upsertQuizSession, fetchQuizSession } from '../services/quizSessionService';

let t: any;

export default function useQuizSync() {
  const { user } = useAuthCtx();
  const state = useQuizStore();
  
  // Hydrate from DB once auth is known
  useEffect(() => {
    (async () => {
      if (!user || !state.quizId) return;
      const { data } = await fetchQuizSession(String(user.id), state.quizId);
      if (data?.state?.updated_at && (!state.startedAt || data.state.updated_at > state.startedAt)) {
        // naive reconcile: prefer DB if newer
        useQuizStore.setState({ ...state, ...data.state });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, state.quizId]);
  
  // Debounced write-behind
  useEffect(() => {
    if (!user || !state.quizId) return;
    clearTimeout(t);
    t = setTimeout(() => {
      upsertQuizSession(String(user.id), { quizId: state.quizId, state: { ...state, updated_at: new Date().toISOString() } });
    }, 1200);
    return () => clearTimeout(t);
  }, [user, state]);
}
