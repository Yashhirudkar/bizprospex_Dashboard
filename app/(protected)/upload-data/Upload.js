"use client";

import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";
import { apiUrl } from "@/constant/api";

export default function UploadData({ productId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [mode, setMode] = useState("csv");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setMessage("");
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFile(null);
    setJsonText("");
    setError("");
    setMessage("");
  };

  const handleUpload = async () => {
    if (!productId) {
      setError("No product selected");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      // CSV MODE
      if (mode === "csv") {
        if (!file) {
          setError("Please select a CSV file");
          setUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("productId", productId);

        const res = await axios.post(
          `${apiUrl}/admin/datastore/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        setMessage(`Uploaded: ${res.data.inserted} rows.`);
      }

      // JSON MODE
      else {
        let parsed;
        try {
          parsed = JSON.parse(jsonText);
          if (!Array.isArray(parsed)) throw new Error();
        } catch {
          setError("Invalid JSON format. Expected an array.");
          setUploading(false);
          return;
        }

        const res = await axios.post(
          `${apiUrl}/admin/upload-json`,
          { productId, data: parsed },
          { withCredentials: true }
        );

        setMessage(`Uploaded: ${res.data.inserted} rows.`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed");
    }

    setUploading(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Upload Product Data
        </h2>

        {/* MODE SWITCH */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => switchMode("csv")}
            className={`flex-1 py-2 rounded font-medium transition ${
              mode === "csv"
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            CSV Upload
          </button>

          <button
            onClick={() => switchMode("json")}
            className={`flex-1 py-2 rounded font-medium transition ${
              mode === "json"
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-50"
            }`}
          >
            JSON Upload
          </button>
        </div>

        {/* CSV MODE */}
        {mode === "csv" ? (
          <>
            <label className="w-full flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition mb-2">
              <FaCloudUploadAlt />
              Select File
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                hidden
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <p className="text-sm text-gray-600 mb-2">
                Selected: <strong>{file.name}</strong>
              </p>
            )}
          </>
        ) : (
          <textarea
            rows={6}
            placeholder='[["First Name","Email"],["John","john@example.com"]]'
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full border rounded p-2 mb-2 resize-y focus:ring-2 focus:ring-blue-500 outline-none"
          />
        )}

        {/* PROGRESS */}
        {uploading && (
          <div className="w-full h-1 bg-gray-200 rounded mb-3 overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-3 bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="mb-3 bg-green-100 text-green-700 px-4 py-2 rounded text-sm">
            {message}
          </div>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 rounded font-semibold transition ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
