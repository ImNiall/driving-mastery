
import React from 'react';
import { Category, QuizAttempt } from '../types';
import { useQuizStore } from '../store/quizStore';

interface QuizStartViewProps {
  categories?: Category[];
  onStartQuiz: (length: number) => void;
  onBack: () => void;
  quizHistory: QuizAttempt[];
}

const QuizStartView: React.FC<QuizStartViewProps> = ({ categories, onStartQuiz, onBack, quizHistory }) => {
  // Use the Zustand store
  const start = useQuizStore(state => state.start);
  const options = [
    { length: 10, title: 'Quick Practice', description: 'A brief 10-question quiz to quickly assess your knowledge.' },
    { length: 25, title: 'Standard Mock Test', description: 'A comprehensive 25-question practice test covering a range of topics.' },
    { length: 50, title: 'Official Mock Test', description: 'A full-length 50-question test that mirrors the format of the official DVSA exam.' },
  ];

  const getStatsForLength = (length: number) => {
    const attemptsForLength = quizHistory.filter(attempt => attempt.length === length);
    const totalAttempts = attemptsForLength.length;
    if (totalAttempts === 0) {
      return { attempts: 0, averageScore: 0 };
    }
    const totalScore = attemptsForLength.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0);
    const averageScore = Math.round(totalScore / totalAttempts);
    return { attempts: totalAttempts, averageScore };
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} className="text-brand-blue font-semibold mb-6">&larr; Back to Dashboard</button>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Configure Your Mock Test</h2>
        <p className="text-gray-600 mt-2">Select a test length to begin. The full mock test simulates the official DVSA exam.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {options.map(({ length, title, description }) => {
          const stats = getStatsForLength(length);
          return (
            <div 
              key={length}
              onClick={() => {
                // Initialize the quiz in the store with a unique ID
                const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                start(id);
                onStartQuiz(length);
              }}
              className="group bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:shadow-xl hover:-translate-y-1 hover:border-brand-blue active:scale-95 active:bg-blue-50 transition-all duration-300 ease-in-out cursor-pointer flex flex-col text-center"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Initialize the quiz in the store with a unique ID
                  const id = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                  start(id);
                  onStartQuiz(length);
                }
              }}
              aria-label={`Start a ${length} question test titled ${title}`}
            >
              <h3 className="text-5xl font-bold text-brand-blue group-hover:scale-110 transition-transform duration-300 ease-in-out">{length}</h3>
              <p className="text-lg font-semibold text-gray-800 mt-2">{title}</p>
              <p className="text-sm text-gray-600 mt-2 mb-4 flex-grow">{description}</p>
              
              <div className="my-4 pt-4 border-t border-gray-200">
                {stats.attempts > 0 ? (
                  <div className="flex justify-around text-sm text-gray-600">
                    <div>
                      <p className="font-bold text-lg text-gray-800">{stats.attempts}</p>
                      <p>Attempts</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">{stats.averageScore}%</p>
                      <p>Avg. Score</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-4">No attempts yet.</div>
                )}
              </div>

              <div className="mt-auto font-semibold text-brand-blue transition-colors group-hover:text-blue-600 flex items-center justify-center">
                <span>Start Test</span>
                <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out ml-1">&rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Test History</h3>
        {quizHistory.length > 0 ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <ul className="divide-y divide-gray-200">
              {[...quizHistory].reverse().map((attempt, index) => {
                const percentage = Math.round((attempt.score / attempt.total) * 100);
                return (
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-700">{new Date(attempt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-sm text-gray-500">{attempt.length} Questions</p>
                    </div>
                    <div className="text-right">
                       <p className={`font-bold text-lg ${percentage >= 86 ? 'text-brand-green' : 'text-brand-red'}`}>{percentage}%</p>
                       <p className="text-sm text-gray-500">{attempt.score} / {attempt.total} correct</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <p>You haven't completed any quizzes yet.</p>
            <p className="text-sm mt-1">Your history will appear here once you do!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizStartView;