import React from 'react';

interface QuizTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ initialMinutes, onTimeUp, isPaused = false }) => {
  // Convert minutes to milliseconds
  const initialTimeMs = initialMinutes * 60 * 1000;
  
  // State to track remaining time
  const [remainingTime, setRemainingTime] = React.useState(initialTimeMs);
  const [isActive, setIsActive] = React.useState(true);
  
  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate percentage of time remaining for progress bar
  const percentRemaining = (remainingTime / initialTimeMs) * 100;
  
  // Determine color based on remaining time
  const getColor = () => {
    if (percentRemaining > 50) return 'bg-green-500';
    if (percentRemaining > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Timer effect
  React.useEffect(() => {
    if (isPaused || !isActive) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          setIsActive(false);
          onTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, isActive, onTimeUp]);
  
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        <span className={`text-sm font-bold ${remainingTime < 300000 ? 'text-red-600' : 'text-gray-700'}`}>
          {formatTime(remainingTime)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${getColor()}`} 
          style={{ width: `${percentRemaining}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizTimer;
