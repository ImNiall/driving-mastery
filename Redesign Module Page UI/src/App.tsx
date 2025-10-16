import { ModuleHeader } from "./components/module-header";
import { HeroOverview } from "./components/hero-overview";
import { LearningTimeline } from "./components/learning-timeline";
import { ContentSection } from "./components/content-section";
import { PracticeZone } from "./components/practice-zone";
import { MiniQuiz } from "./components/mini-quiz";
import { CompletionSection } from "./components/completion-section";
import { Eye, AlertCircle, Gauge, Users, FileText, Wrench, AlertTriangle, ClipboardCheck } from "lucide-react";
import { toast } from "sonner@2.0.3";

export default function App() {
  const heroOutcomes = [
    {
      id: "1",
      text: "Develop constant awareness of your surroundings and other road users",
      icon: <Eye className="w-4 h-4 text-white" />,
    },
    {
      id: "2",
      text: "Learn to anticipate potential hazards before they become dangerous",
      icon: <AlertCircle className="w-4 h-4 text-white" />,
    },
    {
      id: "3",
      text: "Master the scanning techniques used by professional drivers",
      icon: <Gauge className="w-4 h-4 text-white" />,
    },
    {
      id: "4",
      text: "Understand how to maintain alertness during long journeys",
      icon: <Users className="w-4 h-4 text-white" />,
    },
  ];

  const dvsaEssentials = [
    {
      id: "1",
      title: "Use mirrors frequently and effectively",
      description: "Check mirrors every 5-8 seconds - before signalling, changing speed or direction",
      icon: <Eye className="w-4 h-4" />,
      expandable: true,
      details: "The MSM routine (Mirror, Signal, Manoeuvre) should be second nature. Regular mirror checks help you maintain awareness of vehicles around you and plan your actions safely.",
    },
    {
      id: "2",
      title: "Scan the road ahead constantly",
      description: "Look as far ahead as possible, not just at the car in front",
      icon: <Gauge className="w-4 h-4" />,
      expandable: true,
      details: "Effective observation means looking 12-15 seconds ahead. This gives you time to identify hazards, plan your response, and drive smoothly.",
    },
    {
      id: "3",
      title: "Be aware of blind spots",
      description: "Check blind spots with shoulder checks before changing lanes or direction",
      icon: <AlertCircle className="w-4 h-4" />,
      expandable: true,
      details: "Blind spots are areas not visible in your mirrors. Always perform a physical shoulder check before manoeuvring, especially when changing lanes or merging.",
    },
    {
      id: "4",
      title: "Anticipate other road users' actions",
      description: "Watch for clues about what other drivers, cyclists, and pedestrians might do",
      icon: <Users className="w-4 h-4" />,
      expandable: true,
      details: "Look for indicators, brake lights, road position, and body language. Anticipation allows you to respond smoothly rather than react suddenly.",
    },
  ];

  const skills = [
    {
      id: "1",
      title: "The Systematic Scan",
      description: "Near, middle, far - continuously cycle through all three zones",
    },
    {
      id: "2",
      title: "Peripheral Awareness",
      description: "Train yourself to notice movement and changes without direct focus",
    },
    {
      id: "3",
      title: "Commentary Driving",
      description: "Mentally narrate what you see to improve observation skills",
    },
    {
      id: "4",
      title: "Fatigue Recognition",
      description: "Identify early signs of tiredness and take appropriate action",
    },
    {
      id: "5",
      title: "Eliminating Distractions",
      description: "Minimize phone use, eating, and other focus-reducing activities",
    },
    {
      id: "6",
      title: "Weather Adaptation",
      description: "Adjust scanning patterns for rain, fog, and low-light conditions",
    },
  ];

  const mistakes = [
    {
      id: "1",
      title: "Staring at the vehicle directly in front",
      description: "This reduces your ability to anticipate hazards further ahead",
    },
    {
      id: "2",
      title: "Forgetting to check blind spots",
      description: "Relying only on mirrors can lead to missing motorcycles or cyclists",
    },
    {
      id: "3",
      title: "Not scanning at junctions",
      description: "Failing to properly observe all approaches before emerging",
    },
    {
      id: "4",
      title: "Driving while fatigued",
      description: "Continuing to drive when you're too tired to maintain proper alertness",
    },
    {
      id: "5",
      title: "Using mobile phone while driving",
      description: "Even hands-free calls significantly reduce situational awareness",
    },
  ];

  const checklist = [
    {
      id: "1",
      title: "I check my mirrors every 5-8 seconds",
      checkable: true,
    },
    {
      id: "2",
      title: "I scan 12-15 seconds ahead on the road",
      checkable: true,
    },
    {
      id: "3",
      title: "I perform shoulder checks before changing lanes",
      checkable: true,
    },
    {
      id: "4",
      title: "I anticipate the actions of other road users",
      checkable: true,
    },
    {
      id: "5",
      title: "I avoid all phone use while driving",
      checkable: true,
    },
    {
      id: "6",
      title: "I take breaks on long journeys to maintain alertness",
      checkable: true,
    },
    {
      id: "7",
      title: "I adjust my observation technique for weather conditions",
      checkable: true,
    },
    {
      id: "8",
      title: "I practice commentary driving to improve awareness",
      checkable: true,
    },
  ];

  const practiceScenarios = [
    {
      id: "1",
      title: "Motorway Lane Change",
      description: "You're in the middle lane and need to move to the outside lane to overtake. What's your observation sequence?",
      difficulty: "Medium" as const,
      tip: "Remember MSM: Check mirrors, signal early, check blind spot with shoulder check, then move smoothly if safe.",
    },
    {
      id: "2",
      title: "Busy Junction Approach",
      description: "Approaching a T-junction with poor visibility. Multiple pedestrians and cyclists are present.",
      difficulty: "Hard" as const,
      tip: "Slow down early, scan left-right-left continuously, watch for pedestrians' body language, and be ready to stop.",
    },
    {
      id: "3",
      title: "Residential Area Driving",
      description: "Driving through a residential street with parked cars on both sides during school hours.",
      difficulty: "Medium" as const,
      tip: "Reduce speed significantly, scan between parked cars for children, and watch for car doors opening.",
    },
  ];

  const quizQuestions = [
    {
      id: "1",
      question: "How often should you check your mirrors during normal driving?",
      options: [
        { id: "a", text: "Only when changing lanes or speed", isCorrect: false },
        { id: "b", text: "Every 5-8 seconds", isCorrect: true },
        { id: "c", text: "Every 30 seconds", isCorrect: false },
        { id: "d", text: "Only when you hear other vehicles", isCorrect: false },
      ],
      explanation: "Frequent mirror checks (every 5-8 seconds) help maintain awareness of your surroundings and allow you to plan ahead safely.",
    },
    {
      id: "2",
      question: "What is the recommended forward scanning distance on the road?",
      options: [
        { id: "a", text: "Just the car in front", isCorrect: false },
        { id: "b", text: "Two car lengths ahead", isCorrect: false },
        { id: "c", text: "12-15 seconds ahead", isCorrect: true },
        { id: "d", text: "As far as you can see", isCorrect: false },
      ],
      explanation: "Scanning 12-15 seconds ahead gives you adequate time to identify hazards, plan your response, and maintain smooth driving.",
    },
    {
      id: "3",
      question: "Before changing lanes on a motorway, what should you do?",
      options: [
        { id: "a", text: "Just check your mirrors", isCorrect: false },
        { id: "b", text: "Check mirrors, signal, and perform a shoulder check", isCorrect: true },
        { id: "c", text: "Signal and move quickly", isCorrect: false },
        { id: "d", text: "Sound your horn first", isCorrect: false },
      ],
      explanation: "The full MSM routine with a shoulder check for blind spots ensures you're aware of all vehicles around you before manoeuvring.",
    },
    {
      id: "4",
      question: "Why is using a mobile phone while driving dangerous, even hands-free?",
      options: [
        { id: "a", text: "It's against the law", isCorrect: false },
        { id: "b", text: "It significantly reduces situational awareness", isCorrect: true },
        { id: "c", text: "It uses too much battery", isCorrect: false },
        { id: "d", text: "It disturbs other drivers", isCorrect: false },
      ],
      explanation: "Research shows that phone conversations, even hands-free, significantly reduce your ability to process visual information and maintain awareness.",
    },
    {
      id: "5",
      question: "What is the best way to maintain alertness on a long journey?",
      options: [
        { id: "a", text: "Drink energy drinks continuously", isCorrect: false },
        { id: "b", text: "Open the window for fresh air", isCorrect: false },
        { id: "c", text: "Take regular breaks every 2 hours", isCorrect: true },
        { id: "d", text: "Turn up the radio volume", isCorrect: false },
      ],
      explanation: "Taking a proper break every 2 hours or 100 miles is the most effective way to combat fatigue and maintain safe alertness levels.",
    },
  ];

  const nextModule = {
    title: "Anticipation and Planning",
    difficulty: "Intermediate" as const,
    duration: "25 min",
  };

  const handleComplete = () => {
    toast.success("Module completed! 🎉", {
      description: "You've earned the Alertness badge. Keep up the great work!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader
        moduleTitle="Alertness"
        moduleNumber={2}
        totalModules={12}
        progressPercent={45}
      />

      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-8 space-y-8">
        <HeroOverview
          title="Master the Art of Alertness"
          description="Alertness is the foundation of safe driving. This module will teach you how to maintain constant awareness of your surroundings, anticipate potential hazards, and develop the observation skills that separate good drivers from great ones."
          outcomes={heroOutcomes}
        />

        <LearningTimeline currentStep={2} />

        <ContentSection
          title="DVSA Essentials"
          icon={<FileText className="w-6 h-6 text-white" />}
          variant="default"
          items={dvsaEssentials}
          delay={0.2}
        />

        <ContentSection
          title="Skills to Master"
          icon={<Wrench className="w-6 h-6 text-white" />}
          variant="success"
          items={skills}
          delay={0.25}
        />

        <ContentSection
          title="Common Mistakes to Avoid"
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          variant="warning"
          items={mistakes}
          delay={0.3}
        />

        <ContentSection
          title="Pre-Drive Checklist"
          icon={<ClipboardCheck className="w-6 h-6 text-white" />}
          variant="success"
          items={checklist}
          delay={0.35}
        />

        <PracticeZone scenarios={practiceScenarios} />

        <div>
          <h2 className="mb-6">Test Your Knowledge</h2>
          <MiniQuiz questions={quizQuestions} />
        </div>

        <CompletionSection
          nextModule={nextModule}
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
}
