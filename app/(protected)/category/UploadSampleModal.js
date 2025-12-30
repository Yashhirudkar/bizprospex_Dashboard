"use client";

import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../constant/api";

export default function UploadSampleModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}) {
  const [sampleLink, setSampleLink] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !category) return null;

  const handleSubmit = async () => {
    if (!sampleLink) {
      alert("Please paste Google Sheet public link");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${apiUrl}/admin/category/sample-link`,
        {
          category_id: category.category_id,
          sample_link: sampleLink,
        },
        {
          withCredentials: true,
        }
      );

      alert("Sample link saved successfully");
      onSuccess?.();
      onClose();
      setSampleLink("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save sample link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Add Sample Link
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Category: <b>{category.name}</b>
        </p>

        <input
          type="url"
          placeholder="Paste Google Sheet public link"
          value={sampleLink}
          onChange={(e) => setSampleLink(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
