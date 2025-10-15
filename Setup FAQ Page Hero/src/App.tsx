import { useState, useEffect } from "react";
import { FAQHero } from "./components/FAQHero";
import { FAQSearch } from "./components/FAQSearch";
import { FAQCategoryNav } from "./components/FAQCategoryNav";
import { FAQSection, FAQItem } from "./components/FAQSection";
import { BackToTop } from "./components/BackToTop";

// FAQ Data
const faqData = {
  "getting-started": {
    title: "Getting Started",
    items: [
      {
        question: "How do I create an account?",
        answer: "Creating an account is easy! Click the 'Sign Up' button on the homepage, enter your email address, choose a password, and verify your email. You'll be ready to start learning in just a few minutes.",
      },
      {
        question: "What do I need to get started with Driving Mastery?",
        answer: "All you need is a device with internet access (computer, tablet, or smartphone), your provisional driving license details, and a willingness to learn. Our platform works on all modern browsers.",
      },
      {
        question: "Is there a mobile app available?",
        answer: "Yes! Driving Mastery is available as a mobile app for both iOS and Android. You can also access all features through your web browser on any device.",
      },
      {
        question: "How long does it take to complete the course?",
        answer: "Most learners complete the theory course in 2-4 weeks with regular practice. However, you can go at your own pace - your subscription remains active as long as you need it.",
      },
    ],
  },
  "learning-features": {
    title: "Learning & Features",
    items: [
      {
        question: "What is the AI Mentor feature?",
        answer: "Our AI Mentor is like having a personal driving instructor available 24/7. It analyzes your learning patterns, identifies weak areas, provides personalized tips, and adapts the difficulty of questions based on your performance.",
      },
      {
        question: "How accurate are the practice tests?",
        answer: "Our practice tests use the official DVSA question bank and are updated regularly to match the real theory test format exactly. Questions, multimedia clips, and hazard perception videos mirror what you'll see on test day.",
      },
      {
        question: "Can I track my progress?",
        answer: "Absolutely! Your dashboard shows detailed analytics including: topics mastered, weak areas, practice test scores, time spent learning, predicted pass rate, and study streaks. You can monitor your improvement over time.",
      },
      {
        question: "What learning modes are available?",
        answer: "We offer multiple learning modes: Learn Mode (study topics with explanations), Practice Mode (timed questions), Mock Tests (full exam simulation), Hazard Perception training, and Weak Areas Focus (targets your mistakes).",
      },
      {
        question: "How does hazard perception training work?",
        answer: "Our hazard perception training uses official DVSA-style video clips. You'll click when you spot developing hazards, receive instant scoring, and get detailed feedback on your timing and accuracy with expert tips.",
      },
    ],
  },
  "pricing-membership": {
    title: "Pricing & Membership",
    items: [
      {
        question: "How much does Driving Mastery cost?",
        answer: "We offer flexible plans: Monthly subscription at £9.99, 3-month plan at £24.99 (save 17%), and 6-month plan with Pass Guarantee at £39.99 (save 33%). All plans include full access to all features.",
      },
      {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel anytime with no cancellation fees. If you cancel, you'll retain access until the end of your current billing period. Simply go to Account Settings > Subscription > Cancel.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are encrypted and secure.",
      },
      {
        question: "Is there a free trial available?",
        answer: "Yes! We offer a 7-day free trial with full access to all features including the AI Mentor, practice tests, and hazard perception videos. No credit card required to start.",
      },
      {
        question: "Do you offer student discounts?",
        answer: "Yes! Students with a valid .ac.uk email address or NUS card receive 20% off all subscription plans. Verify your student status during checkout to apply the discount automatically.",
      },
    ],
  },
  "pass-guarantee": {
    title: "Pass Guarantee & Refunds",
    items: [
      {
        question: "What is the Pass Guarantee?",
        answer: "With our 6-month Pass Guarantee plan, if you complete all practice tests, achieve 90%+ on three consecutive mock exams, and still don't pass your theory test, we'll refund your full subscription cost.",
      },
      {
        question: "What are the Pass Guarantee requirements?",
        answer: "To qualify for a refund: (1) Complete all topic modules, (2) Score 90%+ on three consecutive full mock tests, (3) Take your official theory test within your 6-month subscription, and (4) Provide proof of test result within 7 days.",
      },
      {
        question: "How do I claim a refund under the Pass Guarantee?",
        answer: "Contact our support team within 7 days of your test with your DVSA test result confirmation. We'll verify your account meets the requirements and process your refund within 5-10 business days.",
      },
      {
        question: "What is your general refund policy?",
        answer: "We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied within the first 14 days, contact support for a full refund, no questions asked.",
      },
    ],
  },
  "troubleshooting": {
    title: "Troubleshooting & Support",
    items: [
      {
        question: "I'm having trouble logging in. What should I do?",
        answer: "First, try resetting your password using the 'Forgot Password' link. Clear your browser cache and cookies, or try a different browser. If issues persist, contact support at support@drivingmastery.com.",
      },
      {
        question: "Videos aren't loading properly. How can I fix this?",
        answer: "Ensure you have a stable internet connection (minimum 5 Mbps recommended). Try refreshing the page, clearing your browser cache, or updating your browser. Disable any ad blockers that might interfere with video playback.",
      },
      {
        question: "How do I contact customer support?",
        answer: "You can reach us via email at support@drivingmastery.com, live chat (available Mon-Fri 9am-6pm), or submit a support ticket through your account dashboard. We typically respond within 2 hours during business hours.",
      },
      {
        question: "Can I use Driving Mastery offline?",
        answer: "Our mobile apps allow you to download practice questions and study materials for offline use. However, hazard perception videos, AI Mentor features, and progress syncing require an internet connection.",
      },
      {
        question: "I found a mistake in a question. How do I report it?",
        answer: "We take accuracy seriously! Click the 'Report Issue' button on any question, describe the problem, and our content team will review it within 24 hours. We'll notify you once it's been addressed.",
      },
    ],
  },
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");

  // Filter FAQ items based on search query
  const getFilteredFAQs = () => {
    if (!searchQuery.trim()) {
      return faqData;
    }

    const query = searchQuery.toLowerCase();
    const filtered: any = {};

    Object.entries(faqData).forEach(([categoryId, category]) => {
      const filteredItems = category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );

      if (filteredItems.length > 0) {
        filtered[categoryId] = {
          ...category,
          items: filteredItems,
        };
      }
    });

    return filtered;
  };

  // Scrollspy: Detect which section is in viewport
  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(faqData);
      const scrollPosition = window.pageYOffset + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveCategory(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredFAQs = getFilteredFAQs();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-20 pb-12">
        <FAQHero />
        <FAQSearch value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Category Navigation */}
      <FAQCategoryNav activeCategory={activeCategory} />

      {/* FAQ Sections */}
      <div className="max-w-[960px] mx-auto px-4 py-20 space-y-16">
        {Object.keys(filteredFAQs).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6B7280] text-[18px]">
              No results found for "{searchQuery}". Try different keywords.
            </p>
          </div>
        ) : (
          Object.entries(filteredFAQs).map(([categoryId, category]) => (
            <FAQSection
              key={categoryId}
              id={categoryId}
              title={category.title}
              items={category.items}
            />
          ))
        )}
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
