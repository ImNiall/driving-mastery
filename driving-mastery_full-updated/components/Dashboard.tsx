import React from 'react';
import { QuizResult, View, Category } from '../types';
import ProgressChart from './ProgressChart';
import StudyPlan from './StudyPlan';
import { STUDY_PLANS } from '../constants';
import { QuizIcon, BookOpenIcon, ChatIcon } from './icons';
import Seo from './Seo';
import JsonLd from './JsonLd';
import { SITE_URL } from '../config/seo';

// --- Sub-components defined in-file to avoid creating new files ---

const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
}> = ({ icon, title, description, buttonText, onClick }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex-shrink-0 mx-auto">{icon}</div>
        <h3 className="text-lg font-bold text-gray-800 mt-4">{title}</h3>
        <p className="text-sm text-gray-600 mt-2 mb-6 flex-grow">{description}</p>
        <button 
            onClick={onClick} 
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-md font-semibold transition-colors hover:bg-blue-600"
        >
            {buttonText}
        </button>
    </div>
);


// --- Main Dashboard Component ---

interface DashboardProps {
    progress: QuizResult[];
    setupQuiz: (categories?: Category[]) => void;
    setView: (view: View) => void;
    viewModule: (category: Category) => void;
    onOpenChat: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, setupQuiz, setView, viewModule, onOpenChat }) => {
    const totalQuestions = progress.reduce((acc, curr) => acc + curr.total, 0);
    const totalCorrect = progress.reduce((acc, curr) => acc + curr.correct, 0);
    const overallPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const weakestCategory = [...progress]
        .filter(p => p.total > 0)
        .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))[0];
        
    return (
        <div className="space-y-8">
            {/* SEO: Dashboard */}
            <Seo
                title="Dashboard – Driving Mastery"
                description="Review your progress and get help from your AI Mentor."
                url={`${SITE_URL}/`}
            />
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "Driving Mastery – UK Theory Coach",
                    description: "Practice UK driving theory with adaptive quizzes.",
                    applicationCategory: "EducationalApplication",
                    operatingSystem: "Web",
                }}
            />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800">Your Dashboard</h1>
                <p className="text-gray-600 mt-1">Review your progress and get help from your AI Mentor.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Your Progress Breakdown</h3>
                    <ProgressChart data={progress} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Overall Score</h3>
                        <p className={`text-5xl font-bold ${overallPercentage >= 86 ? 'text-brand-green' : 'text-brand-blue'}`}>{overallPercentage}%</p>
                        <p className="text-gray-500">{totalCorrect} / {totalQuestions} correct</p>
                    </div>
                    {weakestCategory && (
                         <div className="mt-6">
                            <h4 className="font-semibold mb-2 text-gray-700">Recommended Focus Area</h4>
                            <p className="text-sm text-gray-600 mb-3">Your results suggest focusing on <span className="font-bold">{weakestCategory.category}</span>.</p>
                             <div className="space-y-2">
                                <button onClick={() => setupQuiz([weakestCategory.category])} className="w-full bg-brand-blue-light text-brand-blue font-semibold py-2 px-4 rounded-md hover:bg-blue-200 transition-colors">
                                    Practice Topic
                                </button>
                                <button onClick={() => viewModule(weakestCategory.category)} className="w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-200 transition-colors">
                                    Study Module
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                <ActionCard
                    icon={<QuizIcon className="w-12 h-12 text-brand-blue" />}
                    title="Mock Theory Test"
                    description="Simulate the official DVSA test with a randomly selected set of questions from all topics."
                    buttonText="Start Quiz"
                    onClick={() => setupQuiz()}
                />
                <ActionCard
                    icon={<BookOpenIcon className="w-12 h-12 text-brand-blue" />}
                    title="DVSA Topic Revision"
                    description="Study detailed guides covering all 14 official DVSA categories to build your knowledge."
                    buttonText="Browse Modules"
                    onClick={() => setView('modules')}
                />
                 <ActionCard
                    icon={<ChatIcon className="w-12 h-12 text-brand-blue" />}
                    title="Ask the AI Mentor"
                    description="Get instant help and explanations on any topic from your personal AI study partner."
                    buttonText="Open Chat"
                    onClick={onOpenChat}
                />
            </div>

            <StudyPlan plan={STUDY_PLANS[0]} />

        </div>
    );
};

export default Dashboard;