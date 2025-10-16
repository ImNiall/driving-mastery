import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle2, XCircle, Flag, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

interface MiniQuizProps {
  questions: QuizQuestion[];
}

export function MiniQuiz({ questions }: MiniQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (optionId: string) => {
    if (showFeedback) return;
    setSelectedAnswer(optionId);
    setShowFeedback(true);
    
    const isCorrect = questions[currentQuestion].options.find(o => o.id === optionId)?.isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlagged(newFlagged);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Card className="p-8 text-center border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2">Quiz Complete! 🎉</h2>
          <p className="text-gray-600 mb-6">
            You scored {score} out of {questions.length}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowFeedback(false);
              setScore(0);
              setCompleted(false);
              setFlagged(new Set());
            }}>
              Retake Quiz
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Continue Learning
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const selectedOption = currentQ.options.find(o => o.id === selectedAnswer);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="p-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            {flagged.has(currentQuestion) && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
                Flagged
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFlag}
            className={flagged.has(currentQuestion) ? "text-amber-600" : "text-gray-400"}
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-6">{currentQ.question}</h3>

            <div className="space-y-3 mb-6">
              {currentQ.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showCorrect = showFeedback && option.isCorrect;
                const showIncorrect = showFeedback && isSelected && !option.isCorrect;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={showFeedback}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      showCorrect
                        ? "bg-green-50 border-green-500"
                        : showIncorrect
                        ? "bg-red-50 border-red-500"
                        : isSelected
                        ? "bg-purple-50 border-purple-500"
                        : "bg-white border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{option.text}</span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {showIncorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`p-4 rounded-lg mb-6 ${
                  selectedOption?.isCorrect
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {selectedOption?.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <p className={selectedOption?.isCorrect ? "text-green-900" : "text-red-900"}>
                    {selectedOption?.isCorrect ? "Correct!" : "Not quite right"}
                  </p>
                </div>
                <p className="text-sm text-gray-700 ml-7">{currentQ.explanation}</p>
              </motion.div>
            )}

            {showFeedback && (
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
