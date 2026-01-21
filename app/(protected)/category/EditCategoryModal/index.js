"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { apiUrl } from "../../../../constant/api";
import { SECTION_REGISTRY } from "./SectionRegistry";
import StatsAndFaqFields from "./StatsAndFaqFields";
import DynamicSections from "./DynamicSections";

export default function EditCategoryModal({ isOpen, onClose, onSuccess, category }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    background_image: "",
    stats_items: [{ title: "", value: "" }],
    faq_items: [{ question: "", answer: "" }],
    pageSections: {},
  });

  const isInitializing = useRef(false);
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const [selectedSectionKey, setSelectedSectionKey] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (category) {
      isInitializing.current = true;
      setIsSlugTouched(false);

      const parseItems = (items) => {
        if (!items) return [{ title: "", value: "" }];
        if (typeof items === "string") {
          try { return JSON.parse(items); } catch { return [{ title: "", value: "" }]; }
        }
        return Array.isArray(items) ? items : [{ title: "", value: "" }];
      };

      const parseSections = (raw) => {
        if (!raw) return {};
        let sections = {};
        try {
          if (typeof raw === "string") {
            const parsed = JSON.parse(raw);
            sections = parsed.sections || parsed || {};
          } else {
            sections = raw.sections || raw || {};
          }
        } catch { sections = {}; }

        Object.keys(sections).forEach((key) => {
          if (SECTION_REGISTRY[key]) {
            sections[key]._config = SECTION_REGISTRY[key];
          }
        });
        return sections;
      };

      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        background_image: category.background_image || "",
        stats_items: parseItems(category.stats_items),
        faq_items: category.faq_items
          ? typeof category.faq_items === "string" ? JSON.parse(category.faq_items) : category.faq_items
          : [{ question: "", answer: "" }],
        pageSections: parseSections(category.page_sections),
      });

      setImageFile(null);
      setError("");
    }
  }, [category]);

  useEffect(() => {
    if (isInitializing.current) {
      isInitializing.current = false;
      return;
    }
    if (!isSlugTouched && formData.name) {
      const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, isSlugTouched]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "background_image") setImageFile(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setFormData((prev) => ({ ...prev, background_image: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

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

  const addStatsItem = () => setFormData(p => ({ ...p, stats_items: [...p.stats_items, { title: "", value: "" }] }));
  const removeStatsItem = (index) => {
    if (formData.stats_items.length > 1) {
      setFormData(p => ({ ...p, stats_items: p.stats_items.filter((_, i) => i !== index) }));
    }
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...formData.faq_items];
    newFaq[index][field] = value;
    setFormData(p => ({ ...p, faq_items: newFaq }));
  };

  const addFaqItem = () => setFormData(p => ({ ...p, faq_items: [...p.faq_items, { question: "", answer: "" }] }));
  const removeFaqItem = (index) => {
    if (formData.faq_items.length > 1) {
      setFormData(p => ({ ...p, faq_items: p.faq_items.filter((_, i) => i !== index) }));
    }
  };

  const handleAddSection = () => {
    if (!selectedSectionKey) return;
    const schema = SECTION_REGISTRY[selectedSectionKey];
    setFormData((prev) => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [selectedSectionKey]: { enabled: true, heading: "", sub_heading: "", [schema.itemsKey]: [], _config: schema },
      },
    }));
    setSelectedSectionKey("");
  };

  const removeSection = (key) => {
    setFormData((prev) => {
      const copy = { ...prev.pageSections };
      delete copy[key];
      return { ...prev, pageSections: copy };
    });
  };

  const updateSection = (sectionKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      pageSections: { ...prev.pageSections, [sectionKey]: { ...prev.pageSections[sectionKey], [field]: value } }
    }));
  };

  const addSectionItem = (sectionKey) => {
    const schema = formData.pageSections[sectionKey]._config;
    const newItem = {};
    schema.itemFields.forEach(f => newItem[f] = "");
    setFormData(prev => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [sectionKey]: { ...prev.pageSections[sectionKey], [schema.itemsKey]: [...(prev.pageSections[sectionKey][schema.itemsKey] || []), newItem] }
      }
    }));
  };

  const updateSectionItem = (sectionKey, itemIndex, field, value) => {
    const schema = formData.pageSections[sectionKey]._config;
    setFormData(prev => {
      const items = [...prev.pageSections[sectionKey][schema.itemsKey]];
      items[itemIndex][field] = value;
      return { ...prev, pageSections: { ...prev.pageSections, [sectionKey]: { ...prev.pageSections[sectionKey], [schema.itemsKey]: items } } };
    });
  };

  const removeSectionItem = (sectionKey, itemIndex) => {
    const schema = formData.pageSections[sectionKey]._config;
    setFormData(prev => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [sectionKey]: { ...prev.pageSections[sectionKey], [schema.itemsKey]: prev.pageSections[sectionKey][schema.itemsKey].filter((_, i) => i !== itemIndex) }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const cleanSections = {};
      Object.entries(formData.pageSections).forEach(([key, value]) => {
        const { _config, ...rest } = value;
        cleanSections[key] = rest;
      });

      const form = new FormData();
      form.append("name", formData.name);
      form.append("slug", formData.slug);
      form.append("description", formData.description);
      form.append("stats_items", JSON.stringify(formData.stats_items));
      form.append("faq_items", JSON.stringify(formData.faq_items));
      form.append("page_sections", JSON.stringify({ page: "category", slug: formData.slug, sections: cleanSections }));

      if (imageFile) form.append("background_image", imageFile);
      else if (typeof formData.background_image === "string" && formData.background_image.startsWith("http")) {
        form.append("background_image_url", formData.background_image);
      }

      const res = await fetch(`${apiUrl}/categories/admin/${category.category_id}`, { method: "PUT", body: form, credentials: "include" });
      const data = await res.json();
      if (data.success) { onSuccess(); onClose(); }
      else setError(data.message || "Failed to update category");
    } catch (err) { setError("An error occurred while updating the category"); }
    finally { setLoading(false); }
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
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          {/* NAME & SLUG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter category name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={(e) => { setIsSlugTouched(true); handleInputChange(e); }} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Auto-generated" />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter category description" />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
            <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {formData.background_image ? <img src={formData.background_image} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm">Click to upload image</span>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <input type="url" name="background_image" value={imageFile ? "" : formData.background_image} onChange={handleInputChange} className="mt-3 w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Or paste images URL here" />
          </div>

          <StatsAndFaqFields 
            formData={formData} 
            handleStatsChange={handleStatsChange}
            addStatsItem={addStatsItem}
            removeStatsItem={removeStatsItem}
            handleFaqChange={handleFaqChange}
            addFaqItem={addFaqItem}
            removeFaqItem={removeFaqItem}
          />

          <DynamicSections 
            formData={formData}
            selectedSectionKey={selectedSectionKey}
            setSelectedSectionKey={setSelectedSectionKey}
            handleAddSection={handleAddSection}
            removeSection={removeSection}
            updateSection={updateSection}
            addSectionItem={addSectionItem}
            updateSectionItem={updateSectionItem}
            removeSectionItem={removeSectionItem}
          />

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}