import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import QuizStartView from './components/QuizStartView';
import QuizView from './components/QuizView';
import QuizResultsView from './components/QuizResultsView';
import ModulesView from './components/ModulesViewV2';
import ChatView from './components/ChatView';
import LandingPage from './components/LandingPage';
import FloatingChatWidget from './components/FloatingChatWidget';
import LeaderboardView from './components/LeaderboardView';
import AuthView from './components/AuthView';
import PricingPlans from './components/PricingPlans';
import { View, QuizResult, Category, QuizAttempt, LearningModule, QuizAction, FinalQuizResults } from './types';
import { DVSA_CATEGORIES, LEARNING_MODULES, MASTERY_POINTS } from './constants';
import { ChatIcon, XIcon } from './components/icons';
import { useAuth } from '@clerk/clerk-react';
import { incrementProgress } from './services/progressService';
import { logAttempt } from './services/historyService';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [quizConfig, setQuizConfig] = useState<{ categories?: Category[]; length: number }>({ length: 10 });
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [quizResults, setQuizResults] = useState<FinalQuizResults | null>(() => {
    try {
        const savedResults = localStorage.getItem('latestQuizResults');
        return savedResults ? JSON.parse(savedResults) : null;
    } catch (e) {
        return null;
    }
  });

  const { getToken } = useAuth();

  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [chatContextMessage, setChatContextMessage] = useState<string | null>(null);

  const [progress, setProgress] = useState<QuizResult[]>(() => {
    try {
        const savedProgress = localStorage.getItem('userProgress');
        return savedProgress ? JSON.parse(savedProgress) : DVSA_CATEGORIES.map(cat => ({ category: cat, correct: 0, total: 0 }));
    } catch (e) {
        return DVSA_CATEGORIES.map(cat => ({ category: cat, correct: 0, total: 0 }));
    }
  });
  
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    try {
        const savedHistory = localStorage.getItem('quizHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
        return [];
    }
  });
  
  const [masteryPoints, setMasteryPoints] = useState<number>(() => {
    try {
        const savedPoints = localStorage.getItem('masteryPoints');
        return savedPoints ? parseInt(savedPoints, 10) : 0;
    } catch (e) {
        return 0;
    }
  });
  
  const [masteredModules, setMasteredModules] = useState<string[]>(() => {
      try {
          const saved = localStorage.getItem('masteredModules');
          return saved ? JSON.parse(saved) : [];
      } catch(e) {
          return [];
      }
  });

  const [seenQuestionIds, setSeenQuestionIds] = useState<number[]>(() => {
    try {
        const saved = localStorage.getItem('seenQuestionIds');
        return saved ? JSON.parse(saved) : [];
    } catch(e) {
        return [];
    }
  });

  useEffect(() => {
    try {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
      if (loggedInStatus) {
        setCurrentView('dashboard');
      }
    } catch (e) {
      console.error("Could not read from localStorage", e);
    } finally {
      setIsAppReady(true);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('userProgress', JSON.stringify(progress));
        localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
        localStorage.setItem('masteryPoints', masteryPoints.toString());
        localStorage.setItem('masteredModules', JSON.stringify(masteredModules));
        localStorage.setItem('seenQuestionIds', JSON.stringify(seenQuestionIds));
        if(quizResults) {
            localStorage.setItem('latestQuizResults', JSON.stringify(quizResults));
        }
    } catch (e) {
        console.error("Could not write to localStorage", e);
    }
  }, [progress, quizHistory, masteryPoints, masteredModules, quizResults, seenQuestionIds]);

  const handleLogin = () => {
    try {
      localStorage.setItem('isLoggedIn', 'true');
    } catch(e) {
      console.error("Could not write to localStorage", e);
    }
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleQuizComplete = useCallback((summary: Omit<FinalQuizResults, 'pointsEarned'>) => {
    const percentage = summary.totalQuestions > 0 ? (summary.totalCorrect / summary.totalQuestions) * 100 : 0;
    let points = summary.totalCorrect * MASTERY_POINTS.CORRECT_ANSWER;
    
    if (percentage === 100) {
        points += MASTERY_POINTS.ACCURACY_BONUS.FLAWLESS;
    } else if (percentage >= 90) {
        points += MASTERY_POINTS.ACCURACY_BONUS.EXCELLENT;
    } else if (percentage >= 86) {
        points += MASTERY_POINTS.ACCURACY_BONUS.PASS;
    }
    
    const resultsWithPoints: FinalQuizResults = {
        ...summary,
        date: new Date().toISOString(),
        pointsEarned: points,
    };
    
    setQuizResults(resultsWithPoints);
    setMasteryPoints(prev => prev + points);
    setCurrentView('quiz-results');

    setProgress(prevProgress => {
      const newProgress = [...prevProgress];
      summary.results.forEach(result => {
        const index = newProgress.findIndex(p => p.category === result.category);
        if (index !== -1) {
          newProgress[index] = {
            ...newProgress[index],
            correct: newProgress[index].correct + result.correct,
            total: newProgress[index].total + result.total,
          };
        }
      });
      return newProgress;
    });

    setQuizHistory(prevHistory => [...prevHistory, {
      length: summary.totalQuestions,
      score: summary.totalCorrect,
      total: summary.totalQuestions,
      date: resultsWithPoints.date,
    }]);

    // Persist to server (Supabase) via Netlify Functions
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          // Atomic per-category increments
          for (const r of summary.results) {
            await incrementProgress({ category: r.category, deltaCorrect: r.correct, deltaTotal: r.total }, token);
          }
          // Log attempt for analytics/review
          await logAttempt({
            score: summary.totalCorrect,
            total: summary.totalQuestions,
            details: {
              categories: summary.results.map(r => r.category),
              date: resultsWithPoints.date,
            },
          }, token);
        }
      } catch (e) {
        console.error('Failed to persist quiz data:', e);
      }
    })();
    
    const weakestTopics = summary.results
        .filter(r => (r.correct / r.total) < 0.86)
        .sort((a, b) => (a.correct / a.total) - (b.correct / a.total))
        .map(r => r.category);

    let contextMessage = `I just finished a mock test and scored ${summary.totalCorrect} out of ${summary.totalQuestions}.`;
    if (weakestTopics.length > 0) {
        contextMessage += ` My weakest topics were: ${weakestTopics.join(', ')}. Can you give me a breakdown and some advice?`;
    } else {
        contextMessage += ` I did pretty well! Can you give me a summary of my performance?`;
    }
    
    setChatContextMessage(contextMessage);
    setIsChatWidgetOpen(true);

  }, []);

  const handleModuleMastery = useCallback((moduleCategory: Category) => {
      if (!masteredModules.includes(moduleCategory)) {
          setMasteryPoints(prev => prev + MASTERY_POINTS.MODULE_MASTERY);
          setMasteredModules(prev => [...prev, moduleCategory]);
      }
  }, [masteredModules]);

  const handleSetupQuiz = (categories?: Category[]) => {
    setQuizConfig({ categories: categories || [], length: 0 }); 
    setCurrentView('quiz-start');
  };

  const handleStartQuiz = (length: number) => {
    setQuizConfig(prev => ({ ...prev, length }));
    setCurrentView('quiz');
  };

  const handleStartCustomQuiz = (action: QuizAction) => {
    setQuizConfig({ categories: action.categories, length: action.questionCount });
    setCurrentView('quiz');
    setIsChatWidgetOpen(false);
  };

  const handleQuestionsSeen = (questionIds: number[]) => {
    setSeenQuestionIds(prev => {
        const newIds = new Set([...prev, ...questionIds]);
        return Array.from(newIds);
    });
  };
  
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };
  
  const handleRestartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleViewModule = (category: Category) => {
    const moduleToView = LEARNING_MODULES.find(m => m.category === category);
    if(moduleToView) {
      setSelectedModule(moduleToView);
      setCurrentView('modules');
    }
  };

  const handleOpenChat = () => {
    setChatContextMessage(null);
    setIsChatWidgetOpen(true);
  };

  const renderLoggedInView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard progress={progress} setupQuiz={handleSetupQuiz} setView={setCurrentView} viewModule={handleViewModule} onOpenChat={handleOpenChat} />;
      case 'quiz-start':
        return <QuizStartView onStartQuiz={handleStartQuiz} onBack={handleBackToDashboard} quizHistory={quizHistory} />;
      case 'quiz':
        return <QuizView key={Date.now()} categories={quizConfig.categories} length={quizConfig.length} onQuizComplete={handleQuizComplete} seenQuestionIds={seenQuestionIds} onQuestionsSeen={handleQuestionsSeen} />;
      case 'quiz-results':
        return quizResults ? <QuizResultsView results={quizResults} onBackToDashboard={handleBackToDashboard} onRestartQuiz={handleRestartQuiz} onViewModule={handleViewModule} setView={setCurrentView} /> : <Dashboard progress={progress} setupQuiz={handleSetupQuiz} setView={setCurrentView} viewModule={handleViewModule} onOpenChat={handleOpenChat} />;
      case 'modules':
        return <ModulesView selectedModule={selectedModule} setSelectedModule={setSelectedModule} latestQuizResults={quizResults} onModuleMastery={handleModuleMastery} masteredModules={masteredModules} />;
      case 'chat':
        return <ChatView onStartCustomQuiz={handleStartCustomQuiz} />;
      case 'leaderboard':
        return <LeaderboardView currentUserMasteryPoints={masteryPoints} />;
      case 'pricing':
        return <PricingPlans />;
      default:
        return <Dashboard progress={progress} setupQuiz={handleSetupQuiz} setView={setCurrentView} viewModule={handleViewModule} onOpenChat={handleOpenChat} />;
    }
  };

  if (!isAppReady) {
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }

  if (!isLoggedIn) {
     switch (currentView) {
        case 'auth':
            return <AuthView defaultMode={authMode} onLogin={handleLogin} onSignUp={handleLogin} setView={setCurrentView} />;
        default:
            return <LandingPage onNavigateToAuth={(mode) => {
                setAuthMode(mode);
                setCurrentView('auth');
            }} />;
     }
  }

  return (
    <ErrorBoundary fallback={<div className="p-6 m-6 bg-red-50 border border-red-200 rounded">The app encountered an error while rendering. Please reload.</div>}>
    <div className="min-h-screen bg-slate-50">
      <Header currentView={currentView} setView={(view) => {
          if (view === 'modules') setSelectedModule(null);
          if (view === 'quiz') handleSetupQuiz();
          else setCurrentView(view);
        }}
      />
      <main className="container mx-auto p-4 md:p-6 mb-20 md:mb-0">
        <ErrorBoundary fallback={<div className="p-4 bg-red-50 border border-red-200 rounded">This section failed to load.</div>}>
          {renderLoggedInView()}
        </ErrorBoundary>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
          <FloatingChatWidget 
              isOpen={isChatWidgetOpen}
              onClose={() => setIsChatWidgetOpen(false)}
              onStartCustomQuiz={handleStartCustomQuiz}
              initialContextMessage={chatContextMessage}
          />
          <button
              onClick={() => {
                if (!isChatWidgetOpen) setChatContextMessage(null);
                setIsChatWidgetOpen(!isChatWidgetOpen)
              }}
              className="bg-brand-blue text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all transform hover:scale-110 relative overflow-hidden"
              aria-label={isChatWidgetOpen ? "Close chat" : "Open chat"}
          >
              <div className={`transition-transform duration-300 ease-in-out absolute ${isChatWidgetOpen ? 'rotate-180 scale-0' : 'rotate-0 scale-100'}`}>
                  <ChatIcon className="w-8 h-8" />
              </div>
                <div className={`transition-transform duration-300 ease-in-out absolute ${isChatWidgetOpen ? 'rotate-0 scale-100' : '-rotate-180 scale-0'}`}>
                  <XIcon className="w-8 h-8"/>
              </div>
          </button>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default App;