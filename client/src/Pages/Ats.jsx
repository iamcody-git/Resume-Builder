import React, { useState } from "react";
import axios from "axios";
import api from "../configs/api";

const ATS = () => {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [matchPercent, setMatchPercent] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a resume!");

    // File validation
    if (!['application/pdf', 'text/plain'].includes(file.type)) {
      return alert("Only PDF or TXT files are allowed!");
    }
    if(file.size > 5*1024*1024) return alert("File too large (max 5MB)");

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole);

    try {
      const res = await api.post(
        "/api/ai/analyze-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAnalysis(res.data.analysis);
      setMatchPercent(res.data.matchPercent);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-4xl font-semibold mb-4 text-green-600 tracking-wider">📄 AI Resume Analyzer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Target Job Role (optional)"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="block w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {matchPercent !== null && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg">🎯 Match Score</h2>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${matchPercent}%` }}
            />
          </div>
          <p className="text-sm mt-1">{matchPercent}% match</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold text-lg mb-2">📋 Detailed AI Feedback</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">{analysis}</pre>
          <button
            onClick={() => {
              const blob = new Blob([analysis], { type: "text/plain" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "resume_analysis.txt";
              link.click();
            }}
            className="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
          >
            ⬇️ Download Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default ATS;
