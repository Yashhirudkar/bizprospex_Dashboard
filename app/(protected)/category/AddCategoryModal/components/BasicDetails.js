import React from "react";

export default function BasicDetails({ formData, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
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
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Auto-generated"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter category description"
        />
      </div>
    </div>
  );
}