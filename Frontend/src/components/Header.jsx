import React from "react";

export default function Header({ darkMode, setDarkMode }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">AI Resume Checker</h1>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Upload your resume and analyze ATS compatibility
        </p>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`px-5 py-2 rounded-xl font-semibold transition duration-300
        ${darkMode ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-gray-800 text-white hover:bg-gray-700"}`}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}