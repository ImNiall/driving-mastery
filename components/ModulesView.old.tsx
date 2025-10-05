


import React, { useState, useMemo } from 'react';
import { LearningModule, Category, FinalQuizResults } from '../types';
import { LEARNING_MODULES } from '../constants';
import ModuleCard from './ModuleCard';
import ModuleDetail from './ModuleDetail';

// --- Helper Components ---

const parseInlineMarkdown = (text: string) => {
    if (typeof text !== 'string') return String(text || '');
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (typeof part !== 'string') return null;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

const EnhancedMarkdownRenderer: React.FC<{ content: string | undefined | null }> = ({ content }) => {
    // Guard: if no content, render a friendly placeholder instead of crashing
    if (typeof content !== 'string' || content.trim() === '') {
        return (
            <div className="my-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                <p className="text-yellow-800 text-sm">Module content is coming soon.</p>
            </div>
        );
    }

    const elements: React.ReactNode[] = [];
    let lines: string[] = [];
    try {
        lines = content.split('\n').filter(line => line.trim() !== '');
    } catch (err) {
        // Fallback in case of unexpected content format
        return (
            <div className="my-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r">
                <p className="text-red-800 text-sm">We couldn't render this module's content right now.</p>
            </div>
        );
    }

    interface ListItem {
        text: string;
        notes: React.ReactNode[];
    }
    let listItems: ListItem[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc space-y-2 pl-6 my-4 text-gray-700">
                    {listItems.map((item, i) => (
                        <li key={i}>
                            {parseInlineMarkdown(item.text)}
                            {item.notes.length > 0 && <div className="mt-3 space-y-3">{item.notes}</div>}
                        </li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('# ')) {
            // Demote to h2 to ensure only one h1 per page (the module title outside)
            flushList();
            elements.push(<h2 key={index} className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">{trimmedLine.substring(2)}</h2>);
            return;
        }
        if (trimmedLine.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{trimmedLine.substring(3)}</h2>);
            return;
        }
        
        // Handle notes that are nested within a list
        if ((trimmedLine.startsWith('>! ') || trimmedLine.startsWith('>W ')) && listItems.length > 0) {
            const lastItem = listItems[listItems.length - 1];
            if (trimmedLine.startsWith('>! ')) {
                lastItem.notes.push(
                    <div key={`${index}-note`} className="p-4 bg-blue-50 border-l-4 border-brand-blue rounded-r-lg flex items-start space-x-4">
                        <LightbulbIcon className="w-8 h-8 text-brand-blue flex-shrink-0 mt-1" />
                        <div className="text-blue-800">{parseInlineMarkdown(trimmedLine.substring(3))}</div>
                    </div>
                );
            } else { // >W
                 lastItem.notes.push(
                    <div key={`${index}-note`} className="p-4 bg-red-50 border-l-4 border-brand-red rounded-r-lg flex items-start space-x-4">
                        <WarningIcon className="w-8 h-8 text-brand-red flex-shrink-0 mt-1" />
                        <div className="text-red-800">{parseInlineMarkdown(trimmedLine.substring(3))}</div>
                    </div>
                );
            }
            return;
        }

        // Handle notes that are top-level blocks
        if (trimmedLine.startsWith('>! ')) {
            flushList();
            elements.push(
                <div key={index} className="my-5 p-4 bg-blue-50 border-l-4 border-brand-blue rounded-r-lg flex items-start space-x-4">
                    <LightbulbIcon className="w-8 h-8 text-brand-blue flex-shrink-0 mt-1" />
                    <div className="text-blue-800">{parseInlineMarkdown(trimmedLine.substring(3))}</div>
                </div>
            );
            return;
        }

        if (trimmedLine.startsWith('>W ')) {
            flushList();
            elements.push(
                <div key={index} className="my-5 p-4 bg-red-50 border-l-4 border-brand-red rounded-r-lg flex items-start space-x-4">
                    <WarningIcon className="w-8 h-8 text-brand-red flex-shrink-0 mt-1" />
                    <div className="text-red-800">{parseInlineMarkdown(trimmedLine.substring(3))}</div>
                </div>
            );
            return;
        }
        
        if (trimmedLine.startsWith('* ')) {
            listItems.push({ text: trimmedLine.substring(2), notes: [] });
            return;
        }

        flushList();
        elements.push(<p key={index} className="my-4 text-gray-700 leading-relaxed">{parseInlineMarkdown(trimmedLine)}</p>);
    });

    flushList(); 

    return <div>{elements}</div>;
};

// --- Mini Quiz Component ---

const MiniQuiz: React.FC<{ module: LearningModule; onModuleMastery: (category: Category) => void; }> = ({ module, onModuleMastery }) => {
    const [quizState, setQuizState] = useState<'idle' | 'active' | 'finished'>('idle');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    
    const score = useMemo(() => userAnswers.filter(a => a.isCorrect).length, [userAnswers]);

    const loadQuestions = useCallback(() => {
        let categoryQuestions = QUESTION_BANK.filter(q => q.category === module.category);
        const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 5));
    }, [module.category]);
    
    // Pre-load questions on mount to check if there are enough to run a quiz
    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]);

    const startQuiz = () => {
        loadQuestions(); // Shuffle questions every time the quiz starts
        setCurrentIndex(0);
        setSelectedOption(null);
        setSubmitted(false);
        setUserAnswers([]);
        setQuizState('active');
    };

    const handleRetry = () => {
        startQuiz(); // Re-shuffles and resets the quiz state
    }

    const handleSubmit = () => {
        if (!selectedOption) return;
        setSubmitted(true);
        const isCorrect = questions[currentIndex].options.find(o => o.text === selectedOption)?.isCorrect || false;
        setUserAnswers(prev => [...prev, { questionId: questions[currentIndex].id, selectedOption, isCorrect }]);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setSubmitted(false);
        } else {
            // FIX: Call onModuleMastery if the user passes the quiz.
            if (score >= 4) { // 80% pass mark
                onModuleMastery(module.category);
            }
            setQuizState('finished');
        }
    };

    if (questions.length < 5) {
        return (
            <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">More practice questions for this module are coming soon!</p>
            </div>
        );
    }
    
    if (quizState === 'idle') {
        return (
            <div className="bg-slate-100 p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold text-gray-800">Ready to test your knowledge?</h3>
                <p className="text-gray-600 my-2 max-w-md mx-auto">Take a quick 5-question quiz to see how well you've understood the content in this module.</p>
                <button 
                    onClick={startQuiz}
                    className="mt-4 bg-brand-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                    Start Quiz
                </button>
            </div>
        );
    }
    
    if (quizState === 'finished') {
        const passed = score >= 4; // 80% pass mark for the mini-quiz
        const resultIcon = passed ? <CheckCircleIcon className="w-16 h-16 text-brand-green mx-auto" /> : <ClipboardListIcon className="w-16 h-16 text-blue-500 mx-auto" />;
        const resultMessage = passed ? "Excellent Work!" : "Good Effort! Review & Retry.";
        
        return (
            <div className="bg-slate-100 p-8 rounded-lg text-center">
                {resultIcon}
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{resultMessage}</h3>
                <p className="text-gray-600 mt-1">You scored</p>
                <p className={`font-bold my-2 ${passed ? 'text-brand-green' : 'text-brand-red'}`}>
                    <span className="text-6xl">{score}</span>
                    <span className="text-4xl text-gray-500"> / {questions.length}</span>
                </p>
                <p className="text-sm text-gray-500 mt-4">{passed ? "You've got a great grasp of this topic." : "A quick review of the module above might help!"}</p>
                <button 
                    onClick={handleRetry} 
                    className="mt-6 bg-gray-700 text-white py-2 px-6 rounded-md hover:bg-black transition-colors font-semibold"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Active quiz state
    return (
        <div className="bg-slate-100 p-4 sm:p-6 rounded-lg">
            <div className="space-y-4">
                <p className="text-center text-sm font-semibold text-gray-600">Question {currentIndex + 1} of {questions.length}</p>
                <QuestionCard 
                    question={questions[currentIndex]}
                    selectedOption={selectedOption}
                    isAnswered={submitted}
                    onOptionSelect={submitted ? () => {} : setSelectedOption}
                />
                <div className="w-full max-w-2xl mx-auto">
                    {submitted ? (
                        <button
                            onClick={handleNext}
                            className="w-full bg-brand-blue text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-semibold"
                        >
                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                            className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-black transition-colors font-semibold disabled:bg-gray-300"
                        >
                            Submit Answer
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main View Component ---

interface ModulesViewProps {
    selectedModule: LearningModule | null;
    setSelectedModule: (module: LearningModule | null) => void;
    latestQuizResults: FinalQuizResults | null;
    // FIX: Added onModuleMastery and masteredModules to props to resolve error in App.tsx
    onModuleMastery: (category: Category) => void;
    masteredModules: string[];
}

const ModulesView: React.FC<ModulesViewProps> = ({ selectedModule, setSelectedModule, latestQuizResults, onModuleMastery, masteredModules }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'recommended'>('all');
    
    const recommendedCategories = useMemo(() => {
        if (!latestQuizResults) return [];
        return latestQuizResults.results
            .filter(r => r.total > 0 && (r.correct / r.total) * 100 < 86) // 86% is the pass mark
            .sort((a, b) => (a.correct / a.total) - (b.correct / b.total)) // Weakest first
            .map(r => r.category);
    }, [latestQuizResults]);


    if (selectedModule) {
        return <ModuleDetail module={selectedModule} onBack={() => setSelectedModule(null)} />;
    }

    const filteredModules = useMemo(() => {
        let modulesToDisplay = LEARNING_MODULES;

        if (filter === 'recommended' && recommendedCategories.length > 0) {
            modulesToDisplay = LEARNING_MODULES
                .filter(m => recommendedCategories.includes(m.category))
                .sort((a, b) => recommendedCategories.indexOf(a.category) - recommendedCategories.indexOf(b.category));
        }

        if (searchTerm.trim() !== '') {
            return modulesToDisplay.filter(module => 
                module.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                module.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return modulesToDisplay;

    }, [searchTerm, filter, recommendedCategories]);
    
    return (
        <div>
            {/* SEO: Modules list */}
            <Seo
                title="Modules – Driving Mastery"
                description="Study modules covering all 14 DVSA categories for the UK driving theory test."
                url={`${SITE_URL}/modules`}
            />
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">DVSA Learning Modules</h1>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Browse all 14 official categories. Each module contains key information and a mini-quiz to test your understanding.</p>
            </div>
            
            <div className="max-w-2xl mx-auto mb-4 flex justify-center items-center space-x-2">
                 <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === 'all' ? 'bg-brand-blue text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                    All Modules
                </button>
                {recommendedCategories.length > 0 && (
                    <button 
                        onClick={() => setFilter('recommended')}
                        className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === 'recommended' ? 'bg-brand-blue text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Recommended
                    </button>
                )}
            </div>
            {filter === 'recommended' && (
                <p className="text-center text-xs text-gray-500 mb-6">based on your most recent performance</p>
            )}


            <div className="max-w-2xl mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search for a topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(module => (
                    <ModuleCard key={module.slug} module={module} onSelect={setSelectedModule} />
                ))}
            </div>
            {filteredModules.length === 0 && (
                <div className="text-center col-span-full py-12 text-gray-500">
                    <p>
                        {filter === 'recommended' 
                            ? "No specific recommendations right now. Great work!" 
                            : `No modules found for "${searchTerm}".`
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default ModulesView;