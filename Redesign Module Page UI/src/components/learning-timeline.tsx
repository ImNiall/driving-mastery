import { CheckCircle2, Circle, Target, FileText, Wrench, AlertTriangle, ClipboardCheck, Award } from "lucide-react";
import { motion } from "motion/react";

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "upcoming";
}

interface LearningTimelineProps {
  currentStep: number;
}

export function LearningTimeline({ currentStep }: LearningTimelineProps) {
  const steps: Step[] = [
    { id: "overview", label: "Overview", icon: <Target className="w-4 h-4" />, status: currentStep > 0 ? "completed" : currentStep === 0 ? "current" : "upcoming" },
    { id: "essentials", label: "DVSA Essentials", icon: <FileText className="w-4 h-4" />, status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "upcoming" },
    { id: "skills", label: "Skills", icon: <Wrench className="w-4 h-4" />, status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "upcoming" },
    { id: "mistakes", label: "Mistakes", icon: <AlertTriangle className="w-4 h-4" />, status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "upcoming" },
    { id: "checklist", label: "Checklist", icon: <ClipboardCheck className="w-4 h-4" />, status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "upcoming" },
    { id: "test", label: "Test", icon: <Award className="w-4 h-4" />, status: currentStep > 5 ? "completed" : currentStep === 5 ? "current" : "upcoming" },
  ];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <h3 className="mb-6 text-center text-gray-600">Learning Journey</h3>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 hidden md:block">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    step.status === "completed"
                      ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg"
                      : step.status === "current"
                      ? "bg-white border-2 border-blue-500 text-blue-600 shadow-md ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`text-xs ${
                    step.status === "completed" || step.status === "current"
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
