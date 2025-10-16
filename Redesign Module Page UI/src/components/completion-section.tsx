import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, ChevronRight, Share2, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface NextModule {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
}

interface CompletionSectionProps {
  nextModule: NextModule;
  onComplete: () => void;
}

export function CompletionSection({ nextModule, onComplete }: CompletionSectionProps) {
  const difficultyColors = {
    Beginner: "bg-green-100 text-green-700 border-green-200",
    Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Advanced: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="space-y-6"
    >
      {/* Mark Complete Card */}
      <Card className="p-8 text-center border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="mb-2">Ready to Complete This Module?</h3>
        <p className="text-gray-600 mb-6">
          Mark this module as complete to track your progress and earn your achievement badge.
        </p>
        <Button
          size="lg"
          onClick={onComplete}
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <CheckCircle2 className="w-5 h-5" />
          Mark Module Complete
        </Button>
      </Card>

      {/* Next Module Preview */}
      <Card className="p-6 border-2 border-gray-200 hover:border-purple-300 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-32 h-32 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-12 h-12 text-purple-600" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Up Next</p>
            <h3 className="mb-3">{nextModule.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className={difficultyColors[nextModule.difficulty]}>
                {nextModule.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                {nextModule.duration}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Continue your journey to becoming a safer, more confident driver.
            </p>
            <Button variant="outline" className="gap-2">
              Preview Module
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Share Progress */}
      <Card className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-2 border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="mb-1">Share Your Achievement</h4>
              <p className="text-sm text-gray-300">
                Let others know about your progress in becoming a better driver
              </p>
            </div>
          </div>
          <Button variant="secondary" className="gap-2 whitespace-nowrap">
            <Share2 className="w-4 h-4" />
            Share Progress
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
