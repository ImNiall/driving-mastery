export type FaqItem = { id: string; question: string; answer: string };
export type FaqSection = { id: string; title: string; items: FaqItem[] };

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        id: "create-account",
        question: "How do I create a Driving Mastery account?",
        answer:
          "Head to the sign up page, enter your email address, and follow the confirmation link we send you. Once verified you can choose a membership and start practising straight away.",
      },
      {
        id: "costs",
        question: "Is Driving Mastery free?",
        answer:
          "You can explore the dashboard on a free plan. Upgrade to Driving Mastery Pro for unlimited mock tests, AI Mentor support, and in-depth analytics.",
      },
      {
        id: "mobile",
        question: "Can I use Driving Mastery on my phone?",
        answer:
          "Yes. Driving Mastery is fully responsive, so you can take quizzes and study modules from any modern mobile browser.",
      },
    ],
  },
  {
    id: "learning",
    title: "Learning Experience",
    items: [
      {
        id: "ai-mentor",
        question: "What does the AI Mentor actually do?",
        answer:
          "The AI Mentor reviews your attempts and highlights the topics you need to revisit. It also suggests targeted quizzes and bite-sized modules to keep you progressing.",
      },
      {
        id: "question-updates",
        question: "Do you use the latest DVSA questions?",
        answer:
          "Our question bank mirrors the DVSA syllabus. We audit new guidance regularly and roll updates into Driving Mastery as soon as the DVSA publishes changes.",
      },
      {
        id: "progress-tracking",
        question: "How is my progress tracked?",
        answer:
          "Every quiz is logged so you can see your accuracy per DVSA category, review difficult questions, and monitor how close you are to the 86% pass threshold.",
      },
    ],
  },
  {
    id: "mock-tests",
    title: "Mock Tests & Practice",
    items: [
      {
        id: "mock-format",
        question: "What is included in a mock test?",
        answer:
          "Mock tests include 50 questions in a DVSA-style format with a built-in timer and hazard perception reminders. You can also choose short 10 or 25 question drills.",
      },
      {
        id: "hazard-perception",
        question: "Do you support hazard perception practice?",
        answer:
          "Hazard perception training is available in the dashboard. You can review clips, see when to click, and track how close you are to the official pass mark.",
      },
      {
        id: "reset",
        question: "Can I retake a mock test?",
        answer:
          "Absolutely. Use the dashboard to restart any test, revisit flagged questions, or focus on a specific DVSA category.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Membership",
    items: [
      {
        id: "billing-cycle",
        question: "Which payment methods do you accept?",
        answer:
          "We accept all major debit and credit cards issued in the UK. Payments are processed securely and you can cancel anytime from your account settings.",
      },
      {
        id: "pass-guarantee",
        question: "What is your pass guarantee?",
        answer:
          "If you follow the recommended plan, complete the required mock tests, and still fail the DVSA theory exam, we will refund your subscription—see our pass guarantee terms for details.",
      },
      {
        id: "upgrade",
        question: "How do I upgrade to Pro?",
        answer:
          "Visit the Memberships page, review what’s included, and select Driving Mastery Pro. Your dashboard unlocks extra analytics and coaching as soon as payment is confirmed.",
      },
    ],
  },
  {
    id: "support",
    title: "Support & Troubleshooting",
    items: [
      {
        id: "contact-support",
        question: "How do I contact support?",
        answer:
          "Use the in-app chat widget or email support@drivingmastery.app. We aim to respond within one working day.",
      },
      {
        id: "technical-issues",
        question: "My quiz won’t load. What should I try?",
        answer:
          "Refresh the page, make sure your browser is up to date, and clear cached data if the issue persists. You can also reach out to support so we can investigate your account.",
      },
      {
        id: "privacy",
        question: "Is my data secure?",
        answer:
          "We secure all user data with TLS encryption and comply with UK GDPR regulations. Learn more in our privacy policy.",
      },
    ],
  },
];
