import React from "react";
import { supabase } from "@/lib/supabase/client";
import {
  StarIcon,
  CpuChipIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  HomeIcon,
} from "./icons";

interface LandingPageProps {
  onNavigateToAuth: (mode: "signup" | "signin") => void;
}

const LandingHeader: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const [signedIn, setSignedIn] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setSignedIn(!!data.session);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex flex-col items-stretch gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-brand-blue sm:text-2xl">
          Driving Mastery
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
          {signedIn ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                onNavigateToAuth("signin");
              }}
              className="w-full rounded-full py-2.5 px-4 text-base font-semibold text-gray-600 transition-colors hover:bg-gray-100 sm:w-auto sm:text-sm"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigateToAuth("signin")}
                className="w-full rounded-full py-2.5 px-4 text-base font-semibold text-gray-600 transition-colors hover:bg-gray-100 sm:w-auto sm:text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigateToAuth("signup")}
                className="w-full rounded-full bg-brand-blue py-2.5 px-5 text-base font-semibold text-white transition-transform hover:scale-[1.02] sm:w-auto sm:text-sm"
              >
                Sign Up for Free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="transform rounded-lg bg-white p-5 text-center shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:p-6">
    <div className="mb-4 inline-block rounded-full bg-brand-blue-light p-4">
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">{title}</h3>
    <p className="text-base leading-relaxed text-gray-600 sm:text-[15px]">
      {children}
    </p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string }> = ({
  quote,
  author,
}) => (
  <div className="rounded-lg bg-white p-5 shadow-lg sm:p-6">
    <div className="mb-3 flex text-yellow-400">
      <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      <StarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
    </div>
    <p className="text-base italic text-gray-600 sm:text-[15px]">
      &ldquo;{quote}&rdquo;
    </p>
    <p className="mt-4 text-right text-sm font-semibold text-gray-800 sm:text-base">
      - {author}
    </p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="bg-slate-50 text-gray-800 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-white px-4 py-14 text-center sm:py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-5xl md:text-6xl">
            Pass Your DVSA Theory Test Faster with AI-Powered Learning
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
            Join thousands of learners who passed their test first time with
            Driving Mastery. Interactive modules, smart mock tests, and
            personalized coaching from Theo.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center">
            <button
              onClick={() => onNavigateToAuth("signup")}
              className="w-full rounded-full bg-brand-blue py-3.5 px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:shadow-blue-300 sm:w-auto"
            >
              Start Learning for Free
            </button>
            <button
              onClick={() => onNavigateToAuth("signin")}
              className="w-full rounded-full border border-brand-blue/20 py-3.5 px-8 text-lg font-semibold text-brand-blue transition hover:bg-brand-blue/10 sm:w-auto"
            >
              Already learning? Sign in
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 sm:py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Why Choose Driving Mastery?
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Everything you need to pass your theory test with confidence, all
              in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<CpuChipIcon className="w-8 h-8 text-brand-blue" />}
              title="Your Personal AI Coach"
            >
              Meet Theo, your AI mentor who analyzes your progress, identifies
              weaknesses, and gives you personalized advice.
            </FeatureCard>
            <FeatureCard
              icon={
                <ClipboardDocumentListIcon className="w-8 h-8 text-brand-blue" />
              }
              title="Unlimited Mock Tests"
            >
              Practice with DVSA-aligned mock tests that simulate the real exam,
              with a constantly updated question bank.
            </FeatureCard>
            <FeatureCard
              icon={<AcademicCapIcon className="w-8 h-8 text-brand-blue" />}
              title="Comprehensive Modules"
            >
              Study all 14 official DVSA categories with our in-depth learning
              guides, filled with the latest Highway Code rules.
            </FeatureCard>
            <FeatureCard
              icon={<HomeIcon className="w-8 h-8 text-brand-blue" />}
              title="Track Your Progress"
            >
              A beautiful dashboard visualizes your strengths and weaknesses by
              topic, so you always know where to focus.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="bg-brand-blue-light px-4 py-16 sm:py-20"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Trusted by Learners Across the UK
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The AI coach, Theo, was a game-changer. It knew exactly what I needed to work on. I passed with 49/50 on my first try!"
              author="Sarah J."
            />
            <TestimonialCard
              quote="I used to find the learning modules so boring, but Driving Mastery makes them easy to understand. The mock tests felt just like the real thing."
              author="David L."
            />
            <TestimonialCard
              quote="Being able to see my progress on the dashboard was so motivating. I highly recommend this app to any learner driver."
              author="Priya K."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white px-4 py-16 text-center sm:py-20">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Ready to Get Your Licence?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Stop worrying about the theory test. Start your journey with Driving
            Mastery today and pass with confidence.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => onNavigateToAuth("signup")}
              className="w-full rounded-full bg-brand-blue py-3.5 px-8 text-lg font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:shadow-blue-300 sm:w-auto"
            >
              Get Started Now
            </button>
            <button
              onClick={() => onNavigateToAuth("signin")}
              className="w-full rounded-full border border-brand-blue/20 py-3.5 px-8 text-lg font-semibold text-brand-blue transition hover:bg-brand-blue/10 sm:w-auto"
            >
              Book a session with Theo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-center text-sm text-gray-300 sm:text-base">
        <p className="px-4">
          &copy; {new Date().getFullYear()} Driving Mastery. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
