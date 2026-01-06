"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { apiUrl } from "../../../constant/api";

export default function EditCategoryModal({ isOpen, onClose, onSuccess, category }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    background_image: "", // Used for URL input or Preview string
    stats_items: [{ title: "", value: "" }],
    faq_items: [{ question: "", answer: "" }],
  });

  const [imageFile, setImageFile] = useState(null); // Actual binary file for upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Pre-populate form when category changes
  useEffect(() => {
    if (category) {
      const parseItems = (items) => {
        if (!items) return [{ title: "", value: "" }];
        if (typeof items === 'string') {
          try {
            return JSON.parse(items);
          } catch {
            return [{ title: "", value: "" }];
          }
        }
        return Array.isArray(items) ? items : [{ title: "", value: "" }];
      };

      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        background_image: category.background_image || "",
        stats_items: parseItems(category.stats_items),
        faq_items: category.faq_items ? (typeof category.faq_items === 'string' ? JSON.parse(category.faq_items) : category.faq_items) : [{ question: "", answer: "" }],
      });
      setImageFile(null); // Reset file on new category
      setError("");
    }
  }, [category]);

  /* ===============================
     AUTO SLUG GENERATION
  =============================== */
  useEffect(() => {
    if (formData.name && formData.name !== category?.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, category?.name]);

  /* ===============================
     INPUT HANDLERS
  =============================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If user starts typing a URL, clear any file previously selected
    if (name === "background_image") {
      setImageFile(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file for FormData
      const reader = new FileReader();
      reader.onload = (e) => {
        // Store the base64 only for the UI preview
        setFormData((prev) => ({ ...prev, background_image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewClick = () => {
    fileInputRef.current.click();
  };

  /* ===============================
     STATS & FAQ HANDLERS
  =============================== */
const handleStatsChange = (index, field, value) => {
  if (field === "value") {
    const regex = /^[0-9]*\.?[0-9]*(k|K|m|M|\+)?$/;

    if (value !== "" && !regex.test(value)) return;
  }

  setFormData((prev) => {
    const updated = [...prev.stats_items];
    updated[index][field] = value;
    return { ...prev, stats_items: updated };
  });
};



  const addStatsItem = () => {
    setFormData((prev) => ({
      ...prev,
      stats_items: [...prev.stats_items, { title: "", value: "" }],
    }));
  };

  const removeStatsItem = (index) => {
    if (formData.stats_items.length > 1) {
      const newStats = formData.stats_items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, stats_items: newStats }));
    }
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...formData.faq_items];
    newFaq[index][field] = value;
    setFormData((prev) => ({ ...prev, faq_items: newFaq }));
  };

  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faq_items: [...prev.faq_items, { question: "", answer: "" }],
    }));
  };

  const removeFaqItem = (index) => {
    if (formData.faq_items.length > 1) {
      const newFaq = formData.faq_items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, faq_items: newFaq }));
    }
  };

  /* ===============================
     SUBMIT LOGIC
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("description", formData.description);
      form.append("stats_items", JSON.stringify(formData.stats_items));
      form.append("faq_items", JSON.stringify(formData.faq_items));

      // Logic: If we have a physical file, upload it.
      // If not, but we have a string in background_image, treat it as a URL.
      if (imageFile) {
        form.append("background_image", imageFile);
      } else if (formData.background_image && !formData.background_image.startsWith('data:')) {
        // We check !startsWith('data:') to ensure we don't send base64 preview strings as URLs
        form.append("background_image_url", formData.background_image);
      }



const response = await fetch(
        `${apiUrl}/categories/admin/${category.category_id}`,
        {
          method: "PUT",
          body: form,
          credentials: "include",
          mode: "cors",
        }
      );


      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to update category");
      }
    } catch (err) {
      setError("An error occurred while updating the category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* NAME & SLUG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Auto-generated"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter category description"
            />
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            <div
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer  transition-colors"
              onClick={handlePreviewClick}
            >
              {formData.background_image ? (
                <img src={formData.background_image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">Click to upload image</span>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />


            <input
              type="url"
              name="background_image"
              value={imageFile ? "" : formData.background_image}
              onChange={handleInputChange}
              className="mt-3 w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Or paste images URL here"
            />
          </div>

          {/* STATS ITEMS */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Stats Items</label>
              <button type="button" onClick={addStatsItem} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                <FaPlus size={12} /> Add Stat
              </button>
            </div>
            <div className="space-y-2">
              {formData.stats_items.map((stat, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <input
                    type="text"
                    value={stat.title}
                    onChange={(e) => handleStatsChange(index, "title", e.target.value)}
                    placeholder="Stat title"
                    className="flex-1 text-gray-600 px-3 py-2 border border-gray-300 rounded-md outline-none"
                  />
                 <input
                type="text"
                value={stat.value}
                onChange={(e) =>
                  handleStatsChange(index, "value", e.target.value)
                }
                placeholder="e.g. 20k, 5M, 150+"
                className="w-28 px-3 py-2 text-gray-600 border border-gray-300 rounded-md outline-none"
              />

                  {formData.stats_items.length > 1 && (
                    <button type="button" onClick={() => removeStatsItem(index)} className="text-red-600 p-2">
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ ITEMS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">FAQ Items</label>
              <button type="button" onClick={addFaqItem} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                <FaPlus size={12} /> Add FAQ
              </button>
            </div>
            <div className="space-y-4">
              {formData.faq_items.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-500">FAQ {index + 1}</span>
                    {formData.faq_items.length > 1 && (
                      <button type="button" onClick={() => removeFaqItem(index)} className="text-red-600">
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                      placeholder="Question"
                      className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md outline-none"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                      placeholder="Answer"
                      rows={2}
                      className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-md outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
