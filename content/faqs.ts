export type FaqItem = { q: string; a: string };
export type FaqSection = { id: string; title: string; items: FaqItem[] };

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Visit drivingmastery.co.uk, choose Sign Up, and follow the email verification link to finish setting up your profile.",
      },
      {
        q: "What do I need to get started with Driving Mastery?",
        a: "You just need an internet connection, a UK email address, and a few minutes to pick a membership plan that suits your DVSA theory test timetable.",
      },
      {
        q: "Is there a mobile app available?",
        a: "The platform runs beautifully in any modern mobile browser, and a native app is on our roadmap but not available yet.",
      },
    ],
  },
  {
    id: "learning-features",
    title: "Learning & Features",
    items: [
      {
        q: "What is the AI Mentor feature?",
        a: "AI Mentor reviews your attempts and serves bite-sized guidance, revision prompts, and follow-up questions aligned to the DVSA syllabus.",
      },
      {
        q: "How accurate are the practice tests?",
        a: "Every mock test mirrors the latest DVSA formatting and question bank, and we refresh the pool whenever official updates land.",
      },
      {
        q: "Can I track my progress?",
        a: "Yes. Your dashboard charts scores, streaks, and topic-level strengths and weaknesses so you always know what to revise next.",
      },
      {
        q: "What learning modes are available?",
        a: "Choose from guided modules, quick-fire mini quizzes, full mock exams, and revision cards to match the time you have.",
      },
      {
        q: "How does hazard perception training work?",
        a: "You’ll practise with interactive DVSA-style clips that score your spotting speed and explain exactly what you missed.",
      },
    ],
  },
  {
    id: "pricing-membership",
    title: "Pricing & Membership",
    items: [
      {
        q: "How much does Driving Mastery cost?",
        a: "Membership is priced in GBP, and the latest monthly and annual options are shown at checkout before you confirm payment.",
      },
      {
        q: "Can I cancel my subscription at any time?",
        a: "Absolutely—manage your plan from the billing section of your account and cancellations take effect at the end of the current period.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We securely process all major UK debit and credit cards with industry-standard encryption.",
      },
      {
        q: "Is there a free trial available?",
        a: "We occasionally run trials or discounts—check the homepage banner for the latest offer before you subscribe.",
      },
      {
        q: "Do you offer student discounts?",
        a: "Student pricing isn’t live yet, but register your interest with support and we’ll notify you as soon as it launches.",
      },
    ],
  },
  {
    id: "guarantee-refunds",
    title: "Pass Guarantee & Refunds",
    items: [
      {
        q: "What is the Pass Guarantee?",
        a: "Complete everything we recommend and, if you still don’t pass your DVSA theory test, we refund your subscription—terms apply (#).",
      },
      {
        q: "What are the Pass Guarantee requirements?",
        a: "Work through every module, finish the recommended practice tests, and keep your practice history up to date so we can verify your effort.",
      },
      {
        q: "How do I request a refund?",
        a: "Contact support within 30 days of your DVSA result with proof of completion and your test outcome so we can review your claim promptly.",
      },
    ],
  },
  {
    id: "troubleshooting-support",
    title: "Troubleshooting & Support",
    items: [
      {
        q: "Something isn’t working — what should I do?",
        a: "Start by refreshing the page and checking our status notice; if the issue persists, drop us a message through the in-app chat or email support.",
      },
      {
        q: "Can I use Driving Mastery on my phone or tablet?",
        a: "Yes—the site is fully responsive for iOS and Android browsers, so you can revise on the go.",
      },
      {
        q: "Is my data safe?",
        a: "We operate under UK GDPR, use encrypted payments, and only store the learning data needed to keep your account running.",
      },
    ],
  },
];
