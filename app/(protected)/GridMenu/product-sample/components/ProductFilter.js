"use client";

import { Search, Calendar, Filter } from "lucide-react";

export default function ProductFilter({
  filters,
  onChange,
  onReset,
  isFiltering,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-5 border border-gray-200">
      {/* HEADER */}
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

        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* USER EMAIL */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search size={16} />
            User Email
          </label>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by email..."
              value={filters.user_email}
              onChange={(e) => onChange("user_email", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20
                         text-gray-800"
            />
          </div>
        </div>

        {/* PRODUCT NAME */}
        {/* <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search size={16} />
            Product Name
          </label>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by product..."
              value={filters.product_name}
              onChange={(e) => onChange("product_name", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20
                         text-gray-800"
            />
          </div>
        </div> */}

        {/* FROM DATE */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar size={16} />
            From Date
          </label>

          <input
            type="date"
            value={filters.from_date}
            onChange={(e) => onChange("from_date", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20
                       text-gray-600"
          />
        </div>

        {/* TO DATE */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar size={16} />
            To Date
          </label>

          <input
            type="date"
            value={filters.to_date}
            onChange={(e) => onChange("to_date", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20
                       text-gray-600"
          />
        </div>
      </div>
    </div>
  );
}
