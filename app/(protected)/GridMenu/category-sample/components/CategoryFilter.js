"use client";

import { Search, Calendar, Filter, Trash } from "lucide-react";

export default function CategoryFilter({
  filters,
  onChange,
  onReset,
  isFiltering,
  selectedIds,
  handleBulkDelete,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-5 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Filter Results
          </h3>

          {isFiltering && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Filtering...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash size={14} />
              Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* USER EMAIL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Search size={16} /> User Email
          </label>
          <input
            placeholder="Search by email..."
            value={filters.user_email}
            onChange={(e) => onChange("user_email", e.target.value)}
            className="w-full px-4 py-3 border rounded-xl text-gray-600 "
          />
        </div>

        {/* CATEGORY */}
        {/* <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Search size={16} /> Category Name
          </label>
          <input
            placeholder="Search by category..."
            value={filters.category_name}
            onChange={(e) => onChange("category_name", e.target.value)}
            className="w-full px-4 py-3 border rounded-xl"
          />
        </div> */}

        {/* FROM DATE */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium  text-gray-600">
            <Calendar size={16} /> From Date
          </label>
          <input
            type="date"
            value={filters.from_date}
            onChange={(e) => onChange("from_date", e.target.value)}
            className="w-full px-4 py-3 border rounded-xl  text-gray-400"
          />
        </div>

        {/* TO DATE */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium  text-gray-600">
            <Calendar size={16} /> To Date
          </label>
          <input
            type="date"
            value={filters.to_date}
            onChange={(e) => onChange("to_date", e.target.value)}
            className="w-full px-4 py-3 border rounded-xl  text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
