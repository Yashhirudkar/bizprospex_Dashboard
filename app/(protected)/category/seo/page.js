"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import {
  Save,
  Tag,
  FileText,
  Link,
  Search,
  Image,
  Code,
  Globe,
  Eye,
  EyeOff,
  ChevronDown
} from "lucide-react";
import { apiUrl } from "../../../../constant/api";

export default function CategorySeoPage() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category_id");

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [seoId, setSeoId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isExpanded, setIsExpanded] = useState({
    basic: false,
    advanced: false,
    social: false,
    technical: false
  });

  const [form, setForm] = useState({
    slug: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    canonical_url: "",
    meta_robots: "index, follow",
    og_title: "",
    og_description: "",
    og_image: "",
    schema_json: "",
  });

  /* ===============================
     AUTO SELECT CATEGORY FROM URL
  =============================== */
  useEffect(() => {
    if (categoryIdFromUrl) {
      setSelectedCategoryId(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  /* ===============================
     FETCH CATEGORIES
  =============================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/categories/admin/list`,
          { withCredentials: true }
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  /* ===============================
     FETCH SEO FOR CATEGORY
  =============================== */
  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchSeo = async () => {
      try {
        setError("");
        setSuccess("");

        const res = await axios.get(
          `${apiUrl}/admin/seo/entity`,
          {
            params: {
              entity_type: "category",
              entity_id: selectedCategoryId,
            },
            withCredentials: true,
          }
        );

        if (res.data.data) {
          const seo = res.data.data;
          setSeoId(seo.seo_id);

          setForm({
            slug: seo.slug || "",
            seo_title: seo.seo_title || "",
            seo_description: seo.seo_description || "",
            seo_keywords: seo.seo_keywords || "",
            canonical_url: seo.canonical_url || "",
            meta_robots: seo.meta_robots || "index, follow",
            og_title: seo.og_title || "",
            og_description: seo.og_description || "",
            og_image: seo.og_image || "",
            schema_json: seo.schema_json
              ? JSON.stringify(seo.schema_json, null, 2)
              : "",
          });
        } else {
          setSeoId(null);
        }
      } catch {
        setSeoId(null);
      }
    };

    fetchSeo();
  }, [selectedCategoryId]);

  /* ===============================
     HANDLE INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ===============================
     SAVE SEO (CREATE / UPDATE)
  =============================== */
  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        entity_type: "category",
        entity_id: selectedCategoryId,
        ...form,
        schema_json: form.schema_json
          ? JSON.parse(form.schema_json)
          : null,
      };

      if (seoId) {
        await axios.put(
          `${apiUrl}/admin/seo/${seoId}`,
          payload,
          { withCredentials: true }
        );
        setSuccess("✅ SEO updated successfully!");
      } else {
        await axios.post(
          `${apiUrl}/admin/seo`,
          payload,
          { withCredentials: true }
        );
        setSuccess("✨ SEO created successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save SEO");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (cat) => String(cat.category_id) === String(selectedCategoryId)
  );

  const toggleSection = (section) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Category SEO Manager
              </h1>
              <p className="text-gray-500 mt-1">
                Optimize your category pages for better search engine visibility
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Category Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Tag className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800">Category Selection</h2>
              </div>

              {!categoryIdFromUrl ? (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Category
                  </label>
                  <div className="relative">
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 appearance-none"
                    >
                      <option value="">Choose a category...</option>
                      {categories.map((cat) => (
                        <option 
                          key={cat.category_id} 
                          value={cat.category_id}
                          className="py-2"
                        >
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Currently Editing</p>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {selectedCategory?.name || "Loading..."}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {selectedCategory?.category_id || categoryIdFromUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stats */}
              {selectedCategoryId && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">SEO Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">SEO Title</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${form.seo_title ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {form.seo_title ? 'Set' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Description</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${form.seo_description ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {form.seo_description ? 'Set' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Slug</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${form.slug ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {form.slug ? 'Set' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - SEO Form */}
          <div className="lg:col-span-3">
            {selectedCategoryId ? (
              <div className="space-y-6">
                {/* Basic SEO Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleSection('basic')}
                    className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 text-lg">Basic SEO</h3>
                        <p className="text-sm text-gray-500">Title, description, keywords and slug</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded.basic ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded.basic && (
                    <div className="p-6 space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            SEO Title
                          </label>
                          <input
                            name="seo_title"
                            value={form.seo_title}
                            onChange={handleChange}
                            placeholder="Maximum 60 characters recommended"
                            className="w-full border-2 border-gray-200 text-black rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Tag className="w-4 h-4 text-purple-500" />
                            SEO Keywords
                          </label>
                          <input
                            name="seo_keywords"
                            value={form.seo_keywords}
                            onChange={handleChange}
                            placeholder="keyword1, keyword2, keyword3"
                            className="w-full border-2 text-black  border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <FileText className="w-4 h-4 text-green-500" />
                          SEO Description
                        </label>
                        <textarea
                          name="seo_description"
                          value={form.seo_description}
                          onChange={handleChange}
                          placeholder="Maximum 160 characters recommended"
                          rows={3}
                          className="w-full border-2 text-black  border-gray-200 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Link className="w-4 h-4 text-orange-500" />
                          Category Slug
                        </label>
                        <input
                          name="slug"
                          value={form.slug}
                          onChange={handleChange}
                          placeholder="category-url-slug"
                          className="w-full border-2 text-black  border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical SEO Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleSection('technical')}
                    className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Globe className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 text-lg">Technical SEO</h3>
                        <p className="text-sm text-gray-500">Canonical URL and robots meta tag</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded.technical ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded.technical && (
                    <div className="p-6 space-y-4 animate-fadeIn">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Link className="w-4 h-4 text-indigo-500" />
                          Canonical URL
                        </label>
                        <input
                          name="canonical_url"
                          value={form.canonical_url}
                          onChange={handleChange}
                          placeholder="https://example.com/canonical-url"
                          className="w-full border-2 border-gray-200 text-black  rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2  text-sm font-medium text-gray-700 mb-2">
                          {form.meta_robots === 'index, follow' ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                          Meta Robots
                        </label>
                        <select
                          name="meta_robots"
                          value={form.meta_robots}
                          onChange={handleChange}
                          className="w-full border-2 text-black border-gray-200 rounded-xl px-4 py-3 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                        >
                          <option value="index, follow" className="py-2 text-black ">Index and follow</option>
                          <option value="noindex, nofollow" className="py-2 text-black">No index and no follow</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                          {form.meta_robots === 'index, follow' 
                            ? '✅ Search engines can index and follow links on this page'
                            : '⚠️ Search engines will not index or follow links on this page'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Schema JSON Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ">
                  <button
                    onClick={() => toggleSection('advanced')}
                    className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Code className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 text-lg">Schema JSON-LD</h3>
                        <p className="text-sm text-gray-500">Structured data for rich results</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded.advanced ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isExpanded.advanced && (
                    <div className="p-6 animate-fadeIn">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Code className="w-4 h-4 text-purple-500" />
                        Schema JSON-LD
                      </label>
                      <textarea
                        name="schema_json"
                        value={form.schema_json}
                        onChange={handleChange}
                        placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "CollectionPage",\n  "name": "Category Name",\n  "description": "Category description"\n}`}
                        rows={8}
                        className="w-full border-2 text-black border-gray-200 rounded-xl px-4 py-3 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Enter valid JSON-LD for rich snippets in search results
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6  rounded-xl shadow-lg border-1 border-gray-200">
                  <div className="text-white">
                    <h3 className="font-semibold text-lg text-gray-500">Ready to save changes?</h3>
                    <p className="text-gray-500 text-sm ">
                      {seoId ? "Update existing SEO settings" : "Create new SEO settings for this category"}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setForm({
                          slug: "",
                          seo_title: "",
                          seo_description: "",
                          seo_keywords: "",
                          canonical_url: "",
                          meta_robots: "index, follow",
                          og_title: "",
                          og_description: "",
                          og_image: "",
                          schema_json: "",
                        });
                      }}
                      className="px-6 py-3 border-1 text-gray-500 border-gray-500 text-gray-300 rounded-xl cursor-pointer transition-all duration-200 font-medium"
                    >
                      Reset Form
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-8 py-3 bg-green-500 to-emerald-600 cursor-pointer text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? "Saving..." : seoId ? "Update SEO" : "Create SEO"}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="animate-fadeIn p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2 text-red-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Error:</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="animate-fadeIn p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Success!</span>
                      <span>{success}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Select a Category to Begin
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Choose a category from the dropdown menu to start optimizing its SEO settings. You can add titles, descriptions, keywords, and structured data.
                  </p>
                  <div className="inline-flex items-center gap-2 text-blue-600 font-medium">
                    <Tag className="w-5 h-5" />
                    <span>{categories.length} categories available</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        select option {
          padding: 12px !important;
          background: white !important;
        }
      `}</style>
    </div>
  );
}