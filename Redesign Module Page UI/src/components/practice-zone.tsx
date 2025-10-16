import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb, Play, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tip: string;
}

interface PracticeZoneProps {
  scenarios: Scenario[];
}

export function PracticeZone({ scenarios }: PracticeZoneProps) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2>Practice Zone</h2>
          <p className="text-gray-600">Apply your knowledge with real-world scenarios</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline" className={difficultyColors[scenario.difficulty]}>
                  {scenario.difficulty}
                </Badge>
                <Play className="w-5 h-5 text-gray-400" />
              </div>

              <h4 className="mb-2">{scenario.title}</h4>
              <p className="text-sm text-gray-600 mb-4 flex-1">{scenario.description}</p>

              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-purple-900 mb-1">Theo's Advice</p>
                    <p className="text-sm text-purple-800">{scenario.tip}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2">
                <Play className="w-4 h-4" />
                Start Scenario
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
