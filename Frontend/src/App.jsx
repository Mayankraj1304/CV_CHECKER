import { useState, useEffect } from "react";
import axios from "axios"; // base axios or configuration wrapper
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import AnalysisResult from "./components/AnalysisResult";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Theme Listeners
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !jobDescription) {
      alert("Please ensure both a PDF file and Job Description are provided.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${API_URL}/upload`, formData);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 flex items-center justify-center p-6 
      ${darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div className={`w-full max-w-5xl rounded-3xl shadow-2xl p-8 transition-all duration-500 
        ${darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"}`}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <InputSection
          darkMode={darkMode}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          handleFileChange={handleFileChange}
          file={file}
          handleUpload={handleUpload}
          loading={loading}
          error={error}
        />

        <AnalysisResult response={response} darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;
