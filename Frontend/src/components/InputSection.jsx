import React from "react";

export default function InputSection({
  darkMode,
  jobDescription,
  setJobDescription,
  handleFileChange,
  file,
  handleUpload,
  loading,
  error,
}) {
  return (
    <div className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-500
      ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"}`}
    >
      <h2 className="text-xl font-bold mb-4">Job Description</h2>
      <textarea
        rows="8"
        placeholder="Paste Job Description Here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className={`w-full rounded-xl p-4 border resize-none mb-6 transition-all duration-500
          ${darkMode ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-700"}
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className={`mb-4 block w-full text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}
          file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
          ${darkMode ? "file:bg-blue-900 file:text-blue-200 hover:file:bg-blue-800" : "file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"}`}
      />

      {file && <p className="text-green-500 font-medium mb-4">Selected File: {file.name}</p>}

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-6 py-3 rounded-xl font-semibold transition duration-300 shadow-lg bg-blue-600 text-white
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
      >
        {loading ? "Analyzing..." : "Upload Resume"}
      </button>

      {error && <p className="text-red-500 mt-4 font-medium">{error}</p>}
    </div>
  );
}