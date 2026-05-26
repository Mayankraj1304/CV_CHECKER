import React from "react";
import ScoreProgressBar from "./ScoreProgressBar";

export default function AnalysisResult({ response, darkMode }) {
  if (!response) return null;
  if (response.error) {
    return <div className="mt-6 text-red-500 font-semibold">{response.error}</div>;
  }

  return (
    <div className="mt-8">
      <div className={`rounded-2xl p-6 transition-all duration-500 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50"}`}>
        <h2 className="text-2xl font-bold mb-4">Resume Analysis</h2>
        <p className="mb-6"><strong>Filename:</strong> {response.filename}</p>

        <ScoreProgressBar title="ATS Keyword Score" score={response.ats_score} colorClass="bg-green-500" />
        <ScoreProgressBar title="AI Semantic Match Score" score={response.semantic_score} colorClass="bg-blue-500" />

        {/* Matched Keywords */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-green-500">Matched Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {response.matched_keywords?.map((skill, index) => (
              <span key={index} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-red-500">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {response.missing_keywords?.map((skill, index) => (
              <span key={index} className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3">Extracted Resume Text</h3>
        <textarea
          rows="18"
          value={response.text}
          readOnly
          className={`w-full rounded-xl p-4 border resize-none transition-all duration-500
            ${darkMode ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}
            focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );
}