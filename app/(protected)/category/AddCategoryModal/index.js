"use client";

import { apiUrl } from "@/constant/api";
import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

// Internal Components
import { SECTION_REGISTRY } from "./constants";
import BasicDetails from "./components/BasicDetails";
import ImageUpload from "./components/ImageUpload";
import StatsSection from "./components/StatsSection";
import FAQSection from "./components/FAQSection";
import DynamicSections from "./components/DynamicSections";

export default function AddCategoryModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    background_image: "",
    stats_items: [{ title: "", value: "" }],
    faq_items: [{ question: "", answer: "" }],
    pageSections: {},
  });

  const [selectedSectionKey, setSelectedSectionKey] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // AUTO SLUG GENERATION
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  // HANDLERS
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

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...formData.faq_items];
    newFaq[index][field] = value;
    setFormData((prev) => ({ ...prev, faq_items: newFaq }));
  };

  const handleAddSection = () => {
    if (!selectedSectionKey || formData.pageSections[selectedSectionKey]) return;
    const schema = SECTION_REGISTRY[selectedSectionKey];
    setFormData((prev) => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [selectedSectionKey]: {
          enabled: true,
          heading: "",
          sub_heading: "",
          [schema.itemsKey]: [],
          _config: schema,
        },
      },
    }));
    setSelectedSectionKey("");
  };

  const handleUpdateSection = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [key]: { ...prev.pageSections[key], [field]: value },
      },
    }));
  };

  const handleAddSectionItem = (key) => {
    const schema = formData.pageSections[key]._config;
    const newItem = {};
    schema.itemFields.forEach((f) => (newItem[f] = ""));
    setFormData((prev) => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [key]: {
          ...prev.pageSections[key],
          [schema.itemsKey]: [...prev.pageSections[key][schema.itemsKey], newItem],
        },
      },
    }));
  };

  const handleUpdateSectionItem = (key, itemIndex, field, value) => {
    const schema = formData.pageSections[key]._config;
    setFormData((prev) => {
      const items = [...prev.pageSections[key][schema.itemsKey]];
      items[itemIndex][field] = value;
      return {
        ...prev,
        pageSections: {
          ...prev.pageSections,
          [key]: { ...prev.pageSections[key], [schema.itemsKey]: items },
        },
      };
    });
  };

  const handleRemoveSectionItem = (key, itemIndex) => {
    const schema = formData.pageSections[key]._config;
    setFormData((prev) => ({
      ...prev,
      pageSections: {
        ...prev.pageSections,
        [key]: {
          ...prev.pageSections[key],
          [schema.itemsKey]: prev.pageSections[key][schema.itemsKey].filter((_, i) => i !== itemIndex),
        },
      },
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
      form.append("page_sections", JSON.stringify({
        page: "category",
        slug: formData.slug,
        sections: cleanSections,
      }));

      if (imageFile) {
        form.append("background_image", imageFile);
      } else if (formData.background_image && !formData.background_image.startsWith("data:")) {
        form.append("background_image_url", formData.background_image);
      }

      const response = await fetch(`${apiUrl}/categories/admin/create`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
        onClose();
        setFormData({
          name: "", slug: "", description: "", background_image: "",
          stats_items: [{ title: "", value: "" }],
          faq_items: [{ question: "", answer: "" }],
          pageSections: {},
        });
        setImageFile(null);
      } else {
        setError(data.message || "Failed to create category");
      }
    } catch (err) {
      setError("An error occurred while creating the category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Add New Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <BasicDetails formData={formData} onChange={handleInputChange} />
          
          <ImageUpload 
            backgroundImage={formData.background_image} 
            imageFile={imageFile} 
            onFileChange={handleFileChange} 
            onInputChange={handleInputChange} 
            fileInputRef={fileInputRef} 
          />

          <StatsSection 
            stats={formData.stats_items} 
            onAdd={() => setFormData(p => ({ ...p, stats_items: [...p.stats_items, { title: "", value: "" }] }))} 
            onRemove={(idx) => setFormData(p => ({ ...p, stats_items: p.stats_items.filter((_, i) => i !== idx) }))}
            onChange={handleStatsChange}
          />

          <FAQSection 
            faqs={formData.faq_items} 
            onAdd={() => setFormData(p => ({ ...p, faq_items: [...p.faq_items, { question: "", answer: "" }] }))} 
            onRemove={(idx) => setFormData(p => ({ ...p, faq_items: p.faq_items.filter((_, i) => i !== idx) }))}
            onChange={handleFaqChange}
          />

          <DynamicSections 
            pageSections={formData.pageSections}
            selectedKey={selectedSectionKey}
            setSelectedKey={setSelectedSectionKey}
            onAddSection={handleAddSection}
            onRemoveSection={(key) => setFormData(p => {
              const copy = { ...p.pageSections };
              delete copy[key];
              return { ...p, pageSections: copy };
            })}
            onUpdateSection={handleUpdateSection}
            onAddItem={handleAddSectionItem}
            onUpdateItem={handleUpdateSectionItem}
            onRemoveItem={handleRemoveSectionItem}
          />

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}