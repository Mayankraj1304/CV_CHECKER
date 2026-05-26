// frontend/src/App.jsx

import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD SAVED THEME
  // =========================

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
    }

  }, []);

  // =========================
  // SAVE THEME
  // =========================

  useEffect(() => {

    if (darkMode) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }

  }, [darkMode]);

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // =========================
  // HANDLE UPLOAD
  // =========================

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a PDF resume");
      return;
    }

    if (!jobDescription) {
      alert("Please enter a job description");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {

      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setResponse(res.data);

    } catch (error) {

      console.log(error);

      setError(
        "Something went wrong while analyzing the resume."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      className={`min-h-screen transition-all duration-500 flex items-center justify-center p-6
      ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >

      <div
        className={`w-full max-w-5xl rounded-3xl shadow-2xl p-8 transition-all duration-500
        ${
          darkMode
            ? "bg-gray-900 border border-gray-800"
            : "bg-white"
        }`}
      >

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              AI Resume Checker
            </h1>

            <p
              className={`mt-2 ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Upload your resume and analyze ATS compatibility
            </p>

          </div>

          {/* THEME BUTTON */}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-5 py-2 rounded-xl font-semibold transition duration-300
            ${
              darkMode
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>

        </div>

        {/* INPUT SECTION */}

        <div
          className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-500
          ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-300 bg-gray-50"
          }`}
        >

          {/* JOB DESCRIPTION */}

          <h2 className="text-xl font-bold mb-4">
            Job Description
          </h2>

          <textarea
            rows="8"
            placeholder="Paste Job Description Here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={`w-full rounded-xl p-4 border resize-none mb-6 transition-all duration-500
            ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-gray-200"
                : "bg-white border-gray-300 text-gray-700"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          {/* FILE INPUT */}

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className={`mb-4 block w-full text-sm
            ${
              darkMode
                ? "text-gray-300"
                : "text-gray-600"
            }
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            ${
              darkMode
                ? "file:bg-blue-900 file:text-blue-200 hover:file:bg-blue-800"
                : "file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            }`}
          />

          {/* FILE NAME */}

          {file && (
            <p className="text-green-500 font-medium mb-4">
              Selected File: {file.name}
            </p>
          )}

          {/* BUTTON */}

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition duration-300 shadow-lg
            ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {loading ? "Analyzing..." : "Upload Resume"}
          </button>

          {/* ERROR MESSAGE */}

          {error && (
            <p className="text-red-500 mt-4 font-medium">
              {error}
            </p>
          )}

        </div>

        {/* RESPONSE */}

        {response && !response.error && (

          <div className="mt-8">

            <div
              className={`rounded-2xl p-6 transition-all duration-500
              ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-gray-50"
              }`}
            >

              <h2 className="text-2xl font-bold mb-4">
                Resume Analysis
              </h2>

              {/* FILE NAME */}

              <p className="mb-6">
                <strong>Filename:</strong> {response.filename}
              </p>

              {/* ATS SCORE */}

              <div className="mb-8">

                <h3 className="text-xl font-bold mb-3">
                  ATS Keyword Score
                </h3>

                <div className="w-full bg-gray-300 rounded-full h-7 overflow-hidden">

                  <div
                    className="bg-green-500 h-7 flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      width: `${Math.min(response.ats_score, 100)}%`
                    }}
                  >
                    {response.ats_score}%
                  </div>

                </div>

              </div>

              {/* AI SCORE */}

              <div className="mb-8">

                <h3 className="text-xl font-bold mb-3">
                  AI Semantic Match Score
                </h3>

                <div className="w-full bg-gray-300 rounded-full h-7 overflow-hidden">

                  <div
                    className="bg-blue-500 h-7 flex items-center justify-center text-white text-sm font-bold"
                    style={{
                      width: `${Math.min(response.semantic_score, 100)}%`
                    }}
                  >
                    {response.semantic_score}%
                  </div>

                </div>

              </div>

              {/* MATCHED KEYWORDS */}

              <div className="mb-8">

                <h3 className="text-lg font-semibold mb-3 text-green-500">
                  Matched Keywords
                </h3>

                <div className="flex flex-wrap gap-2">

                  {response?.matched_keywords?.map((skill, index) => (

                    <span
                      key={index}
                      className="bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

              {/* MISSING KEYWORDS */}

              <div className="mb-8">

                <h3 className="text-lg font-semibold mb-3 text-red-500">
                  Missing Keywords
                </h3>

                <div className="flex flex-wrap gap-2">

                  {response?.missing_keywords?.map((skill, index) => (

                    <span
                      key={index}
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

              {/* EXTRACTED TEXT */}

              <h3 className="text-lg font-semibold mb-3">
                Extracted Resume Text
              </h3>

              <textarea
                rows="18"
                value={response.text}
                readOnly
                className={`w-full rounded-xl p-4 border resize-none transition-all duration-500
                ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 text-gray-200 focus:ring-blue-500"
                    : "bg-white border-gray-300 text-gray-700 focus:ring-blue-400"
                }
                focus:outline-none focus:ring-2`}
              />

            </div>

          </div>

        )}

        {/* PDF ERROR */}

        {response?.error && (

          <div className="mt-6 text-red-500 font-semibold">
            {response.error}
          </div>

        )}

      </div>

    </div>
  );
}

export default App;