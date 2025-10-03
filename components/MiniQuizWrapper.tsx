import React, { useMemo } from 'react';
import { getOrCreateModuleAttemptId } from '../utils/attemptId';
import { useAuthReady } from '../hooks/useAuthReady';
import { getSupabaseClient } from '../services/quizSessionService';
import { LearningModule } from '../types';
import MiniQuizV2 from './MiniQuizV2';

interface MiniQuizWrapperProps {
  module: LearningModule;
  onModuleMastery: (category: string) => void;
}

const MiniQuizWrapper: React.FC<MiniQuizWrapperProps> = ({ module, onModuleMastery }) => {
  // Get Supabase client
  const supabase = useMemo(() => getSupabaseClient(), []);
  
  // Wait for auth to be ready
  const authReady = useAuthReady(supabase);
  
  // Create or get the attempt ID for this module
  const attemptId = useMemo(() => getOrCreateModuleAttemptId(module.slug), [module.slug]);
  
  // Loading state while auth is initializing
  if (!authReady) {
    return (
      <div className="bg-slate-100 p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
          <span className="ml-3 text-gray-600">Loading quiz...</span>
        </div>
      </div>
    );
  }
  
  // Only render the quiz component when auth is ready and we have an attempt ID
  // The key prop ensures the component fully remounts if the attempt ID changes
  return (
    <MiniQuizV2
      key={attemptId}
      module={module}
      attemptId={attemptId}
      onModuleMastery={onModuleMastery}
    />
  );
};

export default MiniQuizWrapper;
