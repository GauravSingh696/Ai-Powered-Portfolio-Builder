"use client";

import { useState, useEffect } from "react";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.text) {
        setResumeText(data.text);
        await extractDetails(data.text); // Send extracted text to DeepSeek API
      } else {
        setResumeText("No text extracted from the uploaded file.");
        setLoading(false);
      }
    } catch (error) {
      setResumeText("Error extracting text. Please try again.");
      setLoading(false);
    }
  };

  const extractDetails = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: text }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setParsedData(data);
    } catch (error) {
      console.error("Error extracting details:", error);
      setErrorMessage("Failed to process resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-700 rounded-lg bg-gray-800 w-full max-w-2xl">
      <label className="text-lg font-medium mb-2">Choose File</label>
      <input
        type="file"
        className="mb-4 p-2 border border-gray-600 rounded-lg text-white bg-gray-900"
        onChange={handleFileChange}
      />
      {file && <p className="text-gray-400 mb-2">Selected: {file.name}</p>}
      <button
        onClick={handleUpload}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Extract"}
      </button>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-600 text-white rounded-lg w-full">
          {errorMessage}
        </div>
      )}

      {hasMounted && resumeText && (
        <div className="mt-6 p-4 bg-gray-700 text-white rounded-lg w-full">
          <h2 className="text-xl font-bold mb-2">Extracted Resume Text</h2>
          <p className="whitespace-pre-wrap">{resumeText}</p>
        </div>
      )}

      {parsedData && (
        <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg w-full">
          <h2 className="text-xl font-bold mb-2">Parsed Resume Details</h2>
          <p><strong>Name:</strong> {parsedData.name || "N/A"}</p>
          <p><strong>Email:</strong> {parsedData.email || "N/A"}</p>
          <p><strong>Phone:</strong> {parsedData.phone || "N/A"}</p>
          <p><strong>Projects:</strong> {parsedData.projects?.join(", ") || "N/A"}</p>
          <p><strong>Skills:</strong> {parsedData.skills?.join(", ") || "N/A"}</p>
          <p><strong>Experience:</strong> {parsedData.experience || "N/A"}</p>
        </div>
      )}
    </div>
  );
}
