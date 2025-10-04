import React, { useState, useEffect, useMemo } from 'react';
import { Question, UserAnswer, Category, QuizResult, FinalQuizResults } from '../types';
import { QUESTION_BANK } from '../constants';
import QuestionCard from './QuestionCard';
import QuizTimer from './QuizTimer';
import { ArrowRightIcon, ArrowLeftIcon, FlagIcon, CheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from './icons';
import { useQuizStore } from '../store/quizStore';
import useQuizSync from '../hooks/useQuizSync';

interface QuizProgressPanelProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  flaggedQuestions: number[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  onFinishTest: () => void;
}

const QuizProgressPanel: React.FC<QuizProgressPanelProps> = ({ 
  questions, userAnswers, flaggedQuestions, currentQuestionIndex, setCurrentQuestionIndex, onFinishTest 
}) => {
  const correctAnswers = Object.entries(userAnswers).filter(([questionId, selectedOption]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    return question?.options.find(o => o.text === selectedOption)?.isCorrect;
  }).length;

  const incorrectAnswers = Object.keys(userAnswers).length - correctAnswers;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Your Progress</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {questions.map((q, index) => {
          const isAnswered = userAnswers.hasOwnProperty(q.id);
          const isFlagged = flaggedQuestions.includes(q.id);
          const isActive = index === currentQuestionIndex;
          
          let buttonClass = "border-2 rounded-md h-8 w-8 flex items-center justify-center font-semibold text-sm transition-colors relative ";
          if (isActive) {
            buttonClass += "bg-brand-blue text-white border-brand-blue ring-2 ring-offset-1 ring-blue-400";
          } else if (isAnswered) {
            buttonClass += "bg-blue-100 text-brand-blue border-blue-200 hover:bg-blue-200";
          } else {
            buttonClass += "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
          }

          return (
            <button key={q.id} onClick={() => setCurrentQuestionIndex(index)} className={buttonClass}>
              {isAnswered ? <CheckIcon className="w-4 h-4" /> : index + 1}
              {isFlagged && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white"></div>}
            </button>
          );
        })}
      </div>
      <div className="space-y-2 text-sm mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-green-600"><CheckCircleIcon className="w-5 h-5 mr-2"/> Correct: <span className="font-bold ml-1">{correctAnswers}</span></div>
        <div className="flex items-center text-red-600"><XCircleIcon className="w-5 h-5 mr-2"/> Incorrect: <span className="font-bold ml-1">{incorrectAnswers}</span></div>
        <div className="flex items-center text-gray-600"><FlagIcon className="w-5 h-5 mr-2"/> Flagged: <span className="font-bold ml-1">{flaggedQuestions.length}</span></div>
      </div>
      <button 
        onClick={onFinishTest}
        className="w-full bg-brand-green text-white font-bold py-3 mt-6 rounded-lg hover:bg-green-600 transition-colors"
      >
        Finish Test
      </button>
    </div>
  );
};


interface QuizViewProps {
  categories?: Category[];
  length?: number;
  // FIX: Changed the type of onQuizComplete to not require `pointsEarned`, as this is calculated in the parent component.
  onQuizComplete: (summary: Omit<FinalQuizResults, 'pointsEarned'>) => void;
  // FIX: Added props to handle question uniqueness and removed unused onBackToDashboard.
  seenQuestionIds: number[];
  onQuestionsSeen: (questionIds: number[]) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ categories, length = 10, onQuizComplete, seenQuestionIds, onQuestionsSeen }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  
  // Use the quiz sync hook to keep DB in sync
  useQuizSync();
  
  // Use the Zustand store
  const quizId = useQuizStore(state => state.quizId);
  const currentIndex = useQuizStore(state => state.currentIndex);
  const answers = useQuizStore(state => state.answers);
  const startQuiz = useQuizStore(state => state.start);
  const gotoQuestion = useQuizStore(state => state.goto);
  const nextQuestion = useQuizStore(state => state.next);
  const prevQuestion = useQuizStore(state => state.prev);
  const answerQuestion = useQuizStore(state => state.answer);
  const resetQuiz = useQuizStore(state => state.reset);
  
  // Calculate time limit based on quiz length
  const timeLimit = useMemo(() => {
    // Official theory test: 57 minutes for 50 questions
    // That's about 1.14 minutes per question
    const minutesPerQuestion = 1.14;
    return Math.ceil(length * minutesPerQuestion);
  }, [length]);

  useEffect(() => {
    // FIX: Filter out questions that have already been seen to avoid repetition.
    const potentialQuestions = (categories && categories.length > 0)
        ? QUESTION_BANK.filter(q => categories.includes(q.category))
        : QUESTION_BANK;

    let unseenQuestions = potentialQuestions.filter(q => !seenQuestionIds.includes(q.id));

    // Fallback to using all questions if not enough unseen ones are available
    if (unseenQuestions.length < length) {
        unseenQuestions = potentialQuestions;
    }

    const shuffled = [...unseenQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, length);
    setQuestions(selectedQuestions);
    
    // Initialize the quiz in the store with a unique ID
    if (!quizId) {
      const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      startQuiz(id);
    }
  }, [categories, length, seenQuestionIds, quizId, startQuiz]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (!currentQuestion) return;
    // Check if this question has already been answered
    if (answers[`${currentQuestion.id}`]) return;
    // Use the store to record the answer
    answerQuestion(`${currentQuestion.id}`, option);
  };
  
  const toggleFlag = () => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;
    setFlaggedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      prevQuestion();
    }
  };

  const handleTimeUp = () => {
    // When time is up, automatically finish the test
    handleFinishTest(true);
  };
  
  const handleFinishTest = (timeExpired = false) => {
    const finalUserAnswers: UserAnswer[] = questions.map(q => {
        const answer = answers[`${q.id}`];
        const selectedOption = answer ? answer.choice : "Not Answered";
        const isCorrect = q.options.find(o => o.text === selectedOption)?.isCorrect || false;
        return { questionId: q.id, selectedOption, isCorrect };
    });

    const results: { [key in Category]?: { correct: number; total: number } } = {};
    let totalCorrect = 0;
    
    finalUserAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        if (!results[question.category]) {
          results[question.category] = { correct: 0, total: 0 };
        }
        results[question.category]!.total++;
        if (answer.isCorrect) {
          results[question.category]!.correct++;
          totalCorrect++;
        }
      }
    });

    // FIX: Report seen questions back to the parent component.
    onQuestionsSeen(questions.map(q => q.id));

    onQuizComplete({
      results: Object.entries(results).map(([cat, res]) => ({ category: cat as Category, ...res })) as QuizResult[],
      totalCorrect,
      totalQuestions: questions.length,
      finalUserAnswers,
      questions,
      flaggedQuestions,
      date: new Date().toISOString(),
      timeExpired: timeExpired,
    });
  };

  if (questions.length === 0) {
    return (
        <div className="flex items-center justify-center h-64">
             <div className="text-center text-gray-500">
                <p className="font-semibold">Loading questions...</p>
            </div>
        </div>
    );
  }

  const selectedOptionForCurrent = currentQuestion ? (answers[`${currentQuestion.id}`]?.choice || null) : null;
  const isCurrentQuestionFlagged = currentQuestion ? flaggedQuestions.includes(currentQuestion.id) : false;
  const isCurrentQuestionAnswered = currentQuestion ? !!answers[`${currentQuestion.id}`] : false;

  return (
    <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center space-y-4">
            {/* Timer Component */}
            <div className="w-full">
                <QuizTimer 
                    initialMinutes={timeLimit} 
                    onTimeUp={handleTimeUp} 
                    isPaused={isTimerPaused} 
                />
            </div>
            
            <div className="w-full flex justify-between items-center text-sm">
                <p className="font-semibold text-gray-700">Question {currentIndex + 1} of {questions.length}</p>
                <div className="flex space-x-2">
                    <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full text-xs">
                        <ClockIcon className="w-4 h-4 mr-1.5" />
                        <span>{timeLimit} minutes</span>
                    </div>
                    <button
                        onClick={toggleFlag}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            isCurrentQuestionFlagged
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <FlagIcon className="w-4 h-4" />
                        <span>{isCurrentQuestionFlagged ? 'Flagged' : 'Flag for Review'}</span>
                    </button>
                </div>
            </div>

            <QuestionCard
                question={currentQuestion}
                selectedOption={selectedOptionForCurrent}
                onOptionSelect={handleOptionSelect}
                isAnswered={isCurrentQuestionAnswered}
            />
        
            <div className="w-full flex justify-between mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className="flex items-center bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
        <div className="mt-8">
            <QuizProgressPanel 
                questions={questions}
                userAnswers={Object.fromEntries(Object.entries(answers).map(([qid, answer]) => [parseInt(qid), answer.choice]))}
                flaggedQuestions={flaggedQuestions}
                currentQuestionIndex={currentIndex}
                setCurrentQuestionIndex={gotoQuestion}
                onFinishTest={handleFinishTest}
            />
        </div>
    </div>
  );
};

export default QuizView;