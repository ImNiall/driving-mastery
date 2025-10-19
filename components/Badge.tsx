import React from "react";

interface BadgeProps {
  type: "streak" | "quiz" | "perfect" | "study" | "score";
  level?: "bronze" | "silver" | "gold" | "platinum";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  type,
  level = "bronze",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const levelColors = {
    bronze: "text-amber-600",
    silver: "text-gray-500",
    gold: "text-yellow-500",
    platinum: "text-purple-500",
  };

  const getBadgeIcon = () => {
    switch (type) {
      case "streak":
        return "🔥";
      case "quiz":
        return "📚";
      case "perfect":
        return "⭐";
      case "study":
        return "🎓";
      case "score":
        return "🏆";
      default:
        return "🏅";
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-white border-2 ${levelColors[level]} ${sizeClasses[size]} ${className}`}
    >
      <span
        className={`${size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"}`}
      >
        {getBadgeIcon()}
      </span>
    </div>
  );
};

export default Badge;
