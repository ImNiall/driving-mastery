import { ArrowLeft, Bookmark, Share2, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { motion } from "motion/react";

interface ModuleHeaderProps {
  moduleTitle: string;
  moduleNumber: number;
  totalModules: number;
  progressPercent: number;
}

export function ModuleHeader({ 
  moduleTitle, 
  moduleNumber, 
  totalModules, 
  progressPercent 
}: ModuleHeaderProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <Button variant="ghost" size="sm" className="gap-2 px-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-gray-600">Back to Modules</span>
          </Button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{moduleTitle}</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl">
            <h1 className="mb-2">{moduleTitle}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Module {moduleNumber} of {totalModules}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span>{progressPercent}% Complete</span>
            </div>
            <Progress value={progressPercent} className="mt-3 h-2" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Bookmark</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Next Module
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
