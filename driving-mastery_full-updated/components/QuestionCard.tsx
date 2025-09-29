import React from 'react';
import { Question } from '../types';
import { CheckCircleIcon, XCircleIcon, LightbulbIcon, FlagIcon } from './icons';

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  isAnswered: boolean;
  isReviewMode?: boolean;
  userAnswer?: string | null;
  isFlagged?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onOptionSelect,
  isAnswered,
  isReviewMode = false,
  userAnswer = null,
  isFlagged = false,
}) => {

  const getOptionClass = (optionText: string) => {
    const isCorrect = question.options.find(o => o.text === optionText)?.isCorrect;
    const isSelected = selectedOption === optionText;
    const isUserAnswer = userAnswer === optionText;

    // --- Instant Feedback & Review Mode ---
    if (isAnswered || isReviewMode) {
      if (isCorrect) {
        return 'bg-green-100 border-green-400 text-green-800 font-semibold ring-2 ring-green-300';
      }
      if ((isReviewMode && isUserAnswer) || (!isReviewMode && isSelected)) {
        return 'bg-red-100 border-red-400 text-red-800 font-semibold ring-2 ring-red-300';
      }
      return 'bg-gray-50 border-gray-200 text-gray-500 opacity-80';
    }
    
    // --- Active Answering Mode ---
    if (isSelected) {
      return 'bg-blue-100 border-brand-blue ring-2 ring-brand-blue text-blue-800 font-semibold';
    }
    
    return 'bg-white hover:bg-blue-50 hover:border-blue-400 border-gray-300 text-gray-800';
  };

  const showFeedbackIcons = (optionText: string) => {
    if (!isAnswered && !isReviewMode) return null;
      
    const isCorrect = question.options.find(o => o.text === optionText)?.isCorrect;
    const isSelected = selectedOption === optionText;
    const isUserAnswer = userAnswer === optionText;

    if (isCorrect) return <CheckCircleIcon className="w-6 h-6 text-brand-green flex-shrink-0" />;
    if ((isReviewMode && isUserAnswer && !isCorrect) || (!isReviewMode && isSelected && !isCorrect)) {
      return <XCircleIcon className="w-6 h-6 text-brand-red flex-shrink-0" />;
    }
      
    return <div className="w-6 h-6 flex-shrink-0"></div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full animate-fade-in">
      {question.image && (
        <div className="mb-4 bg-gray-100 rounded-lg p-2 flex justify-center">
          <img
            src={question.image}
            alt="Road sign or traffic situation"
            className="max-h-40 w-auto object-contain rounded"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-semibold text-brand-blue">{question.category}</p>
        {isReviewMode && isFlagged && (
          <div className="flex items-center text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            <FlagIcon className="w-4 h-4 mr-1" />
            <span>Flagged</span>
          </div>
        )}
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">{question.question}</h2>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            disabled={isAnswered || isReviewMode}
            onClick={() => onOptionSelect(option.text)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-150 flex justify-between items-center text-sm ${getOptionClass(option.text)}`}
          >
            <span className="flex-grow pr-4">{option.text}</span>
            {showFeedbackIcons(option.text)}
          </button>
        ))}
      </div>

      {(isAnswered || isReviewMode) && (
        <div className="mt-5 p-4 bg-blue-50 rounded-lg border-l-4 border-brand-blue flex items-start space-x-3 animate-fade-in">
          <LightbulbIcon className="w-6 h-6 text-brand-blue flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-800">Explanation</h4>
            <p className="text-gray-700 mt-1 text-sm">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;