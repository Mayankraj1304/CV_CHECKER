import React from "react";

export default function ScoreProgressBar({ title, score, colorClass }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <div className="w-full bg-gray-300 rounded-full h-7 overflow-hidden">
        <div
          className={`${colorClass} h-7 flex items-center justify-center text-white text-sm font-bold`}
          style={{ width: `${Math.min(score, 100)}%` }}
        >
          {score}%
        </div>
      </div>
    </div>
  );
}