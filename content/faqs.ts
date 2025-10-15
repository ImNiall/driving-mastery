export type FaqItem = { q: string; a: string };
export type FaqSection = { id: string; title: string; items: FaqItem[] };

export const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      { q: "How do I create an account?", a: "" },
      { q: "What do I need to get started with Driving Mastery?", a: "" },
      { q: "Is there a mobile app available?", a: "" },
    ],
  },
  {
    id: "learning-features",
    title: "Learning & Features",
    items: [
      { q: "What is the AI Mentor feature?", a: "" },
      { q: "How accurate are the practice tests?", a: "" },
      { q: "Can I track my progress?", a: "" },
      { q: "What learning modes are available?", a: "" },
      { q: "How does hazard perception training work?", a: "" },
    ],
  },
  {
    id: "pricing-membership",
    title: "Pricing & Membership",
    items: [
      { q: "How much does Driving Mastery cost?", a: "" },
      { q: "Can I cancel my subscription at any time?", a: "" },
      { q: "What payment methods do you accept?", a: "" },
      { q: "Is there a free trial available?", a: "" },
      { q: "Do you offer student discounts?", a: "" },
    ],
  },
  {
    id: "guarantee-refunds",
    title: "Pass Guarantee & Refunds",
    items: [
      { q: "What is the Pass Guarantee?", a: "" },
      { q: "What are the Pass Guarantee requirements?", a: "" },
      { q: "How do I request a refund?", a: "" },
    ],
  },
  {
    id: "troubleshooting-support",
    title: "Troubleshooting & Support",
    items: [
      { q: "Something isn’t working — what should I do?", a: "" },
      { q: "Can I use Driving Mastery on my phone or tablet?", a: "" },
      { q: "Is my data safe?", a: "" },
    ],
  },
];
