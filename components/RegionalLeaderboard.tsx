import React, { useState, useEffect } from "react";
import { ProgressService } from "@/lib/services/progress";

interface RegionalLeaderboardProps {
  userCountry?: string;
  userRegion?: string;
  className?: string;
}

const RegionalLeaderboard: React.FC<RegionalLeaderboardProps> = ({
  userCountry,
  userRegion,
  className = "",
}) => {
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>(
    userCountry || "all",
  );

  useEffect(() => {
    const fetchRegionalData = async () => {
      try {
        setLoading(true);
        const data = await ProgressService.getLeaderboard();

        let filteredData = data.leaderboard || [];

        if (selectedRegion !== "all") {
          filteredData = filteredData.filter(
            (entry) =>
              entry.country?.toLowerCase() === selectedRegion.toLowerCase(),
          );
        }

        // Take top 10 for regional view
        setRegionalData(filteredData.slice(0, 10));
      } catch (error) {
        console.error("Regional leaderboard error:", error);
        setRegionalData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionalData();
  }, [selectedRegion]);

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      "united kingdom": "🇬🇧",
      uk: "🇬🇧",
      england: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
      wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
      ireland: "🇮🇪",
      "united states": "🇺🇸",
      usa: "🇺🇸",
      canada: "🇨🇦",
      australia: "🇦🇺",
      germany: "🇩🇪",
      france: "🇫🇷",
      spain: "🇪🇸",
      italy: "🇮🇹",
      netherlands: "🇳🇱",
      belgium: "🇧🇪",
      switzerland: "🇨🇭",
      austria: "🇦🇹",
      sweden: "🇸🇪",
      norway: "🇳🇴",
      denmark: "🇩🇰",
      finland: "🇫🇮",
    };

    return flags[country?.toLowerCase()] || "🌍";
  };

  const availableRegions = [
    "all",
    "united kingdom",
    "united states",
    "canada",
    "australia",
    "germany",
    "france",
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          🌍 Regional Leaders
        </h3>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          {availableRegions.map((region) => (
            <option key={region} value={region}>
              {region === "all"
                ? "All Regions"
                : region
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
            </option>
          ))}
        </select>
      </div>

      {regionalData.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No regional data available</p>
          <p className="text-sm mt-1">
            Users need to set their country in profile settings
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {regionalData.map((entry, index) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                entry.isCurrentUser
                  ? "bg-brand-blue-light border border-brand-blue"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 text-center font-bold text-gray-600">
                  {index + 1}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getCountryFlag(entry.country || "unknown")}
                  </span>
                  <div>
                    <div
                      className={`font-medium ${entry.isCurrentUser ? "text-brand-blue font-bold" : "text-gray-900"}`}
                    >
                      {entry.name}
                    </div>
                    {entry.region && (
                      <div className="text-xs text-gray-500">
                        {entry.region}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-gray-700">
                  {entry.masteryPoints.toLocaleString()}{" "}
                  <span className="text-xs text-gray-500">MP</span>
                </div>
                {entry.currentStreak > 0 && (
                  <div className="text-xs text-orange-600">
                    🔥 {entry.currentStreak}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRegion !== "all" && regionalData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Showing top performers in{" "}
            {selectedRegion
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default RegionalLeaderboard;
