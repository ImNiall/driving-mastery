import React from 'react';
import { Question as QuestionType, UserAnswer, Category, LearningModule } from '../types';
import { QUESTION_BANK } from '../constants';
import QuestionCard from './QuestionCard';
import { useAuth } from '@clerk/clerk-react';
import { getSupabaseClient } from '../services/quizSessionService';
import { makeQuizStore } from '../store/useQuizStore';
import { upsertQuizProgress, upsertQuizAnswers, upsertQuizQuestions, loadQuizAttempt } from '../services/supabaseWrites';
import { storeWrongAnswers } from '../services/historyService';

interface MiniQuizProps {
  module: LearningModule;
  onModuleMastery: (category: string) => void;
  attemptId: string;
}

const MiniQuizV2: React.FC<MiniQuizProps> = ({ module, onModuleMastery, attemptId }) => {
  // Log component lifecycle for debugging
  React.useEffect(() => {
    console.log('[MiniQuizV2] Component mounted', { attemptId, moduleSlug: module.slug });
    return () => console.log('[MiniQuizV2] Component unmounted', { attemptId, moduleSlug: module.slug });
  }, [attemptId, module.slug]);
  
  // Get auth from Clerk
  const { userId } = useAuth();
  
  // Create Zustand store for this quiz attempt
  const storeRef = React.useRef<ReturnType<typeof makeQuizStore>>();
  if (!storeRef.current) {
    console.log('[MiniQuizV2] Creating quiz store', { attemptId, moduleSlug: module.slug });
    storeRef.current = makeQuizStore(attemptId, module.slug);
  }
  const useQuizStore = storeRef.current;
  
  // Get Supabase client
  const supabase = React.useMemo(() => getSupabaseClient(), []);
  
  // Extract state from store
  const state = useQuizStore(state => state.state);
  const questions = useQuizStore(state => state.questions);
  const index = useQuizStore(state => state.currentIndex);
  const answers = useQuizStore(state => state.answers);
  
  // Local UI state
  const [selected, setSelected] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Hydrate quiz state from Supabase once on mount
  React.useEffect(() => {
    const hydrateFromServer = async () => {
      try {
        setIsLoading(true);
        console.log('[MiniQuizV2] Hydrating from server', { attemptId });
        
        // Try to load existing attempt
        const { attempt, answers: serverAnswers } = await loadQuizAttempt(supabase, attemptId);
        
        if (attempt) {
          console.log('[MiniQuizV2] Found existing attempt', { 
            currentIndex: attempt.current_index,
            state: attempt.state,
            questionCount: attempt.questions?.length || 0
          });
          
          // Only move forward, never backward
          const localIndex = useQuizStore.getState().currentIndex;
          if (attempt.current_index > localIndex) {
            useQuizStore.getState().setIndex(attempt.current_index);
          }
          
          // Set questions if available
          if (attempt.questions?.length) {
            useQuizStore.getState().setQuestions(attempt.questions);
          }
          
          // Set state
          useQuizStore.getState().setState(attempt.state);
          
          // Process answers if available
          if (serverAnswers?.length) {
            // Sort by q_index and extract answer data
            const sortedAnswers = serverAnswers
              .sort((a, b) => a.q_index - b.q_index)
              .map(row => row.answer);
              
            // Replace answers in store
            const currentAnswers = useQuizStore.getState().answers;
            if (sortedAnswers.length > currentAnswers.length) {
              // Only use server answers if there are more of them
              useQuizStore.setState({ answers: sortedAnswers });
            }
          }
        } else {
          // Create new quiz with random questions
          console.log('[MiniQuizV2] Creating new quiz', { attemptId, category: module.category });
          const filtered = QUESTION_BANK.filter(q => q.category === module.category);
          const shuffled = [...filtered].sort(() => Math.random() - 0.5);
          const selectedQuestions = shuffled.slice(0, 5);
          
          // Set in store
          useQuizStore.getState().setQuestions(selectedQuestions);
          
          // Create in Supabase
          await upsertQuizProgress(
            supabase,
            attemptId,
            module.slug,
            userId,
            0,
            'idle'
          );
          
          // Save questions
          await upsertQuizQuestions(supabase, attemptId, selectedQuestions);
        }
      } catch (err) {
        console.error('[MiniQuizV2] Error hydrating quiz state:', err);
        
        // Fallback to local questions if store is empty
        if (useQuizStore.getState().questions.length === 0) {
          const filtered = QUESTION_BANK.filter(q => q.category === module.category);
          const shuffled = [...filtered].sort(() => Math.random() - 0.5);
          const selectedQuestions = shuffled.slice(0, 5);
          useQuizStore.getState().setQuestions(selectedQuestions);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    hydrateFromServer();
    // Important: Only run this once on mount, don't add userId as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, module.category, module.slug, supabase]);
  
  // Subscribe to store changes and update Supabase
  React.useEffect(() => {
    if (!userId) return;
    
    // Subscribe to index changes
    const unsubIndex = useQuizStore.subscribe(
      state => state.currentIndex,
      (currentIndex, prevIndex) => {
        console.log('[MiniQuizV2] Index changed:', { prevIndex, currentIndex });
        if (questions.length > 0) {
          upsertQuizProgress(
            supabase,
            attemptId,
            module.slug,
            userId,
            currentIndex,
            useQuizStore.getState().state
          );
        }
      }
    );
    
    // Subscribe to state changes
    const unsubState = useQuizStore.subscribe(
      state => state.state,
      (newState, prevState) => {
        console.log('[MiniQuizV2] State changed:', { prevState, newState });
        if (questions.length > 0) {
          upsertQuizProgress(
            supabase,
            attemptId,
            module.slug,
            userId,
            useQuizStore.getState().currentIndex,
            newState
          );
        }
      }
    );
    
    // Subscribe to answers changes
    const unsubAnswers = useQuizStore.subscribe(
      state => state.answers,
      (newAnswers) => {
        console.log('[MiniQuizV2] Answers updated:', { count: newAnswers.length });
        if (newAnswers.length > 0) {
          upsertQuizAnswers(supabase, attemptId, newAnswers);
        }
      }
    );
    
    // Subscribe to questions changes
    const unsubQuestions = useQuizStore.subscribe(
      state => state.questions,
      (newQuestions) => {
        console.log('[MiniQuizV2] Questions updated:', { count: newQuestions.length });
        if (newQuestions.length > 0) {
          upsertQuizQuestions(supabase, attemptId, newQuestions);
        }
      }
    );
    
    // Update user ID when it becomes available
    if (userId) {
      upsertQuizProgress(
        supabase,
        attemptId,
        module.slug,
        userId,
        useQuizStore.getState().currentIndex,
        useQuizStore.getState().state
      );
    }
    
    return () => {
      unsubIndex();
      unsubState();
      unsubAnswers();
      unsubQuestions();
    };
  }, [attemptId, module.slug, questions.length, supabase, userId]);
  
  const score = answers.filter(a => a.isCorrect).length;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-slate-100 p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
          <span className="ml-3 text-gray-600">Loading quiz...</span>
        </div>
      </div>
    );
  }
  
  // Show message if no questions
  if (questions.length < 1) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">More practice questions for this module are coming soon!</p>
      </div>
    );
  }
  
  if (state === 'idle') {
    return (
      <div className="bg-slate-100 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800">Ready to test your knowledge?</h3>
        <button 
          className="mt-4 bg-brand-blue text-white font-semibold px-4 py-2 rounded" 
          disabled={isLoading}
          onClick={() => { 
            // Reset UI state
            setSelected(null); 
            setSubmitted(false); 
            
            // Update store state
            useQuizStore.setState({
              currentIndex: 0,
              answers: [],
              state: 'active'
            });
          }}
        >
          {isLoading ? 'Loading...' : 'Start Quiz'}
        </button>
      </div>
    );
  }
  
  if (state === 'finished') {
    const passMark = Math.ceil(0.8 * questions.length);
    return (
      <div className="bg-slate-100 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
        <p className="text-gray-600 mb-4">
          You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
        </p>
        
        {score >= passMark ? (
          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <p className="text-green-700 font-semibold">
              Well done! You've mastered this module.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded-lg mb-4">
            <p className="text-yellow-700 font-semibold">
              Keep practicing! You need {passMark} correct answers to master this module.
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <button 
            className="bg-brand-blue text-white font-semibold px-4 py-2 rounded" 
            onClick={() => {
              // Reset UI state
              setSelected(null);
              setSubmitted(false);
              
              // Reset store state
              useQuizStore.getState().reset();
            }}
          >
            {isLoading ? 'Loading...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }
  
  // active quiz state
  const currentQuestion = questions[index];
  
  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <p className="text-center text-sm font-semibold text-gray-600 mb-3">Question {index + 1} of {questions.length}</p>
      <QuestionCard
        question={currentQuestion}
        selectedOption={selected}
        isAnswered={submitted}
        onOptionSelect={(opt) => { if (!submitted) setSelected(opt); }}
      />
      <div className="mt-4">
        {submitted ? (
          <button className="w-full bg-brand-blue text-white py-2 rounded" onClick={() => {
            if (index < questions.length - 1) {
              // Go to next question
              const nextIndex = index + 1;
              useQuizStore.getState().setIndex(nextIndex);
              setSelected(null);
              setSubmitted(false);
            } else {
              // Quiz finished
              const wrongAnswers = answers.filter(a => !a.isCorrect);
              if (wrongAnswers.length > 0) {
                storeWrongAnswers(wrongAnswers);
              }
              
              if (score >= 4) onModuleMastery(module.category);
              useQuizStore.getState().setState('finished');
            }
          }}> {index < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} </button>
        ) : (
          <button 
            className="w-full bg-gray-800 text-white py-2 rounded disabled:bg-gray-300" 
            disabled={!selected} 
            onClick={() => {
              if (!selected) return;
              
              const isCorrect = currentQuestion.options.find(o => o.text === selected)?.isCorrect || false;
              const newAnswer = { 
                questionId: currentQuestion.id, 
                selectedOption: selected, 
                isCorrect,
                questionText: currentQuestion.question,
                category: currentQuestion.category,
                moduleSlug: module.slug
              };
              
              // Add to store
              useQuizStore.getState().addAnswer(newAnswer);
              setSubmitted(true);
            }}
          > 
            Submit Answer 
          </button>
        )}
      </div>
    </div>
  );
};

export default MiniQuizV2;
