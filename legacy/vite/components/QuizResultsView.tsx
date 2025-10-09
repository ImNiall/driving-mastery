import React from "react";
import { FinalQuizResults, Category } from "../types";
import {
  TrophyIcon,
  ClipboardListIcon,
  FlagIcon,
  ArrowLeftIcon,
  BookOpenIcon,
} from "./icons";
import QuestionCard from "./QuestionCard";
import { useQuizStore } from "../store/quizStore";

interface QuizResultsViewProps {
  results: FinalQuizResults;
  onBackToDashboard: () => void;
  onRestartQuiz: () => void;
  onViewModule: (category: Category) => void;
  setView: (view: "leaderboard") => void;
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  results,
  onBackToDashboard,
  onRestartQuiz,
  onViewModule,
  setView,
}) => {
  const {
    totalCorrect,
    totalQuestions,
    finalUserAnswers,
    questions,
    flaggedQuestions,
    pointsEarned,
  } = results;

  // Use the Zustand store
  const reset = useQuizStore((state) => state.reset);
  const percentage =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const passed = percentage >= 86;

  const weakestTopics = results.results
    .filter((r) => r.total > 0 && (r.correct / r.total) * 100 < 86)
    .sort((a, b) => a.correct / a.total - b.correct / b.total);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <div className="text-center">
          {passed ? (
            <TrophyIcon className="w-16 h-16 text-yellow-400 mx-auto" />
          ) : (
            <ClipboardListIcon className="w-16 h-16 text-blue-500 mx-auto" />
          )}
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            {passed
              ? "Congratulations, you passed!"
              : "Good Effort, Keep Practicing!"}
          </h2>
          <p className="text-lg text-gray-600 mt-2">You scored:</p>
          <p
            className={`text-7xl font-bold my-4 ${passed ? "text-brand-green" : "text-brand-red"}`}
          >
            {percentage}%
          </p>
          <p className="text-gray-500 text-lg">
            ({totalCorrect} out of {totalQuestions} correct)
          </p>
        </div>

        {pointsEarned > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              Mastery Points Earned
            </h3>
            <p className="text-4xl font-bold text-yellow-500 my-2">
              +{pointsEarned.toLocaleString()} MP
            </p>
            <button
              onClick={() => setView("leaderboard")}
              className="text-brand-blue font-semibold hover:underline"
            >
              Check your new rank &rarr;
            </button>
          </div>
        )}

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <button
            onClick={onBackToDashboard}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-semibold text-lg flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> Dashboard
          </button>
          <button
            onClick={() => {
              // Reset the quiz state in the store
              reset();
              onRestartQuiz();
            }}
            className="w-full bg-brand-blue text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-semibold text-lg"
          >
            Restart Quiz
          </button>
        </div>
      </div>

      {weakestTopics.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Recommended Study
          </h3>
          <div className="space-y-3">
            {weakestTopics.map((topic) => (
              <div
                key={topic.category}
                className="bg-slate-50 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-gray-700">{topic.category}</p>
                  <p className="text-sm text-red-600 font-semibold">
                    Your score:{" "}
                    {Math.round((topic.correct / topic.total) * 100)}%
                  </p>
                </div>
                <button
                  onClick={() => onViewModule(topic.category)}
                  className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-colors flex items-center"
                >
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Study Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Review Your Answers
        </h3>
        <div className="space-y-6">
          {questions.map((q, index) => {
            const userAnswer = finalUserAnswers.find(
              (a) => a.questionId === q.id,
            );
            return (
              <div key={q.id}>
                <p className="font-bold text-gray-700 mb-2">
                  Question {index + 1}
                </p>
                <QuestionCard
                  question={q}
                  isReviewMode={true}
                  userAnswer={userAnswer?.selectedOption || null}
                  isFlagged={flaggedQuestions.includes(q.id)}
                  selectedOption={null}
                  onOptionSelect={() => {}}
                  isAnswered={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsView;
