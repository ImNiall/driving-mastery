import React from 'react';
import { StarIcon, CpuChipIcon, ClipboardDocumentListIcon, AcademicCapIcon, HomeIcon } from './icons';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'signup' | 'signin') => void;
}

const LandingHeader: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => (
  <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-brand-blue">
        Driving Mastery
      </h1>
      <div className="flex items-center space-x-2">
        <button
            onClick={() => onNavigateToAuth('signin')}
            className="text-gray-600 font-semibold py-2 px-4 rounded-full transition-colors hover:bg-gray-100"
        >
            Sign In
        </button>
        <button
            onClick={() => onNavigateToAuth('signup')}
            className="bg-brand-blue text-white py-2 px-5 rounded-full font-semibold transition-transform hover:scale-105"
        >
            Sign Up for Free
        </button>
      </div>
    </div>
  </header>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:-translate-y-2">
        <div className="inline-block p-4 bg-brand-blue-light rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string; }> = ({ quote, author }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex text-yellow-400 mb-2">
            <StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" /><StarIcon className="w-5 h-5" />
        </div>
        <p className="text-gray-600 italic">"{quote}"</p>
        <p className="text-right font-semibold text-gray-800 mt-4">- {author}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="bg-slate-50 text-gray-800 animate-fade-in">
      <LandingHeader onNavigateToAuth={onNavigateToAuth} />

      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Ace Your UK Driving Theory Test with Your AI Coach.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Join thousands of learners who passed their test first time with Driving Mastery. Interactive modules, smart mock tests, and personalized coaching from Theo.
          </p>
          <button
            onClick={() => onNavigateToAuth('signup')}
            className="mt-10 bg-brand-blue text-white py-4 px-8 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg hover:shadow-blue-300"
          >
            Start Learning for Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Driving Mastery?</h3>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Everything you need to pass your theory test with confidence, all in one place.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<CpuChipIcon className="w-8 h-8 text-brand-blue" />} title="Your Personal AI Coach">
              Meet Theo, your AI mentor who analyzes your progress, identifies weaknesses, and gives you personalized advice.
            </FeatureCard>
            <FeatureCard icon={<ClipboardDocumentListIcon className="w-8 h-8 text-brand-blue" />} title="Unlimited Mock Tests">
              Practice with DVSA-aligned mock tests that simulate the real exam, with a constantly updated question bank.
            </FeatureCard>
            <FeatureCard icon={<AcademicCapIcon className="w-8 h-8 text-brand-blue" />} title="Comprehensive Modules">
              Study all 14 official DVSA categories with our in-depth learning guides, filled with the latest Highway Code rules.
            </FeatureCard>
            <FeatureCard icon={<HomeIcon className="w-8 h-8 text-brand-blue" />} title="Track Your Progress">
              A beautiful dashboard visualizes your strengths and weaknesses by topic, so you always know where to focus.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-brand-blue-light">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by Learners Across the UK</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard quote="The AI coach, Theo, was a game-changer. It knew exactly what I needed to work on. I passed with 49/50 on my first try!" author="Sarah J." />
            <TestimonialCard quote="I used to find the learning modules so boring, but Driving Mastery makes them easy to understand. The mock tests felt just like the real thing." author="David L." />
            <TestimonialCard quote="Being able to see my progress on the dashboard was so motivating. I highly recommend this app to any learner driver." author="Priya K." />
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Get Your Licence?</h3>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Stop worrying about the theory test. Start your journey with Driving Mastery today and pass with confidence.</p>
           <button
            onClick={() => onNavigateToAuth('signup')}
            className="mt-8 bg-brand-blue text-white py-4 px-8 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg hover:shadow-blue-300"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-gray-300 text-center">
        <p>&copy; {new Date().getFullYear()} Driving Mastery. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;