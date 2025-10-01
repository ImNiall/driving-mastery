import React, { useMemo, useState } from 'react';
import { LeaderboardEntry } from '../types';
import { LEADERBOARD_MOCK_DATA } from '../constants';
import { MedalIcon, TrophyIcon } from './icons';

interface LeaderboardViewProps {
  currentUserMasteryPoints: number;
}

type TimeFrame = 'weekly' | 'monthly' | 'allTime';

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUserMasteryPoints }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
    
  const leaderboardData = useMemo(() => {
    
    const getScaledScore = (score: number, frame: TimeFrame) => {
        switch(frame) {
            case 'weekly':
                // Simulate smaller, more volatile weekly scores
                return Math.floor(score * 0.08 + Math.random() * 50);
            case 'monthly':
                 // Simulate scores for a month
                return Math.floor(score * 0.35 + Math.random() * 200);
            case 'allTime':
            default:
                return score;
        }
    }

    const scaledMockData = LEADERBOARD_MOCK_DATA.map(user => ({
        ...user,
        masteryPoints: getScaledScore(user.masteryPoints, timeFrame)
    }));

    const scaledCurrentUserPoints = getScaledScore(currentUserMasteryPoints, timeFrame);

    const combinedData = [
      ...scaledMockData,
      { name: 'You', masteryPoints: scaledCurrentUserPoints },
    ];

    return combinedData
      .sort((a, b) => b.masteryPoints - a.masteryPoints)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
        isCurrentUser: user.name === 'You',
      }));
  }, [currentUserMasteryPoints, timeFrame]);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return undefined;
  };

  const TimeFrameButton: React.FC<{ frame: TimeFrame, label: string }> = ({ frame, label }) => (
      <button
          onClick={() => setTimeFrame(frame)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
              timeFrame === frame ? 'bg-brand-blue text-white shadow-md' : 'text-gray-600 hover:bg-white'
          }`}
      >
          {label}
      </button>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 mr-3 text-brand-blue" />
                Leaderboard
            </h2>
            <p className="text-gray-600 mt-2">See how you rank against other learners. Earn Mastery Points (MP) by acing quizzes and mastering modules!</p>
        </div>

        <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-full max-w-xs mx-auto">
            <TimeFrameButton frame="weekly" label="Weekly" />
            <TimeFrameButton frame="monthly" label="Monthly" />
            <TimeFrameButton frame="allTime" label="All-Time" />
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {leaderboardData.map(entry => (
                    <li key={entry.rank} className={`flex items-center p-4 transition-colors ${entry.isCurrentUser ? 'bg-brand-blue-light' : 'hover:bg-gray-50'}`}>
                        <div className="w-12 text-center text-lg font-bold flex-shrink-0">
                           {entry.rank <= 3 ? (
                                <MedalIcon className="w-8 h-8 mx-auto" color={getMedalColor(entry.rank)} />
                           ) : (
                                <span className="text-gray-500">{entry.rank}</span>
                           )}
                        </div>
                        <div className={`flex-grow px-4 ${entry.isCurrentUser ? 'font-extrabold text-brand-blue' : 'font-semibold text-gray-800'}`}>
                            {entry.name}
                        </div>
                        <div className="text-right font-bold text-lg text-gray-700">
                            {entry.masteryPoints.toLocaleString()} <span className="text-sm font-semibold text-gray-500">MP</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default LeaderboardView;