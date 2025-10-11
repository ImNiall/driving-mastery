import { StudyPlan } from "@/types";

export const STUDY_PLANS: StudyPlan[] = [
  {
    name: "One-Week Intensive Study Plan",
    description:
      "A fast-paced plan to get you test-ready in just one week. Requires daily commitment.",
    steps: [
      {
        title: "Day 1: Foundation & Hazard Awareness",
        description:
          "Complete the 'Alertness', 'Attitude', and 'Hazard Awareness' modules. Take a 25-question mock test.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 2: Your Vehicle & Safety",
        description:
          "Review 'Safety & Your Vehicle' and 'Safety Margins'. Take a focused quiz on these topics.",
        duration: "Approx. 1.5 hours",
        isCompleted: false,
      },
      {
        title: "Day 3: Rules of the Road",
        description:
          "Master the 'Rules of the Road' and 'Road and Traffic Signs' modules. These are critical!",
        duration: "Approx. 2.5 hours",
        isCompleted: false,
      },
      {
        title: "Day 4: Vulnerable Road Users",
        description:
          "Complete the 'Vulnerable Road Users' and 'Other Types of Vehicle' modules. Take a 25-question mock test.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 5: Motorway & Advanced Topics",
        description:
          "Study 'Motorway Rules', 'Vehicle Handling', and 'Vehicle Loading'.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 6: Emergencies & Documents",
        description:
          "Cover 'Incidents, Accidents & Emergencies' and 'Documents'. Take a full 50-question mock test.",
        duration: "Approx. 2 hours",
        isCompleted: false,
      },
      {
        title: "Day 7: Final Review & Mock Test",
        description:
          "Review your weakest categories based on the progress chart. Take one final 50-question mock test.",
        duration: "Approx. 1.5 hours",
        isCompleted: false,
      },
    ],
  },
];
