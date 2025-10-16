import { Target, CheckCircle2, Play } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface Outcome {
  id: string;
  text: string;
  icon: React.ReactNode;
}

interface HeroOverviewProps {
  title: string;
  description: string;
  outcomes: Outcome[];
}

export function HeroOverview({ title, description, outcomes }: HeroOverviewProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-white border-2 border-blue-100 shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 mb-4">
              <Target className="w-4 h-4" />
              <span className="text-sm">Module Overview</span>
            </div>
            
            <h2 className="mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>

            <div className="space-y-3 mb-6">
              <h3 className="text-sm uppercase tracking-wide text-gray-500">What You'll Master</h3>
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    {outcome.icon}
                  </div>
                  <p className="text-gray-700 pt-1">{outcome.text}</p>
                </motion.div>
              ))}
            </div>

            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Play className="w-5 h-5" />
              Start Lesson
            </Button>
          </div>

          <div className="lg:w-80 flex items-center justify-center">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <Target className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
