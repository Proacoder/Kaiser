import React from "react";

interface SeverityMeterProps {
  score: number; // 1 to 100
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SeverityMeter: React.FC<SeverityMeterProps> = ({ score, showLabel = true, size = "md" }) => {
  let color = "bg-emerald-500 text-emerald-700";
  let label = "Low Impact";
  let badgeBg = "bg-emerald-50 border-emerald-200 text-emerald-800";

  if (score >= 80) {
    color = "bg-rose-600 text-rose-700";
    label = "Critical Hazard";
    badgeBg = "bg-rose-50 border-rose-200 text-rose-800 font-bold";
  } else if (score >= 60) {
    color = "bg-amber-500 text-amber-700";
    label = "High Priority";
    badgeBg = "bg-amber-50 border-amber-200 text-amber-800";
  } else if (score >= 35) {
    color = "bg-sky-500 text-sky-700";
    label = "Moderate";
    badgeBg = "bg-sky-50 border-sky-200 text-sky-800";
  }

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5 text-xs font-medium">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${badgeBg}`}>
            AI Score {score}/100 • {label}
          </span>
          <span className="text-gray-500">{score}% Risk</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        />
      </div>
    </div>
  );
};
