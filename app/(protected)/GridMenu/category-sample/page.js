"use client";

import { List } from "lucide-react";
import { useCategoryDownload } from "./components/useCategoryDownload";
import CategoryFilter from "./components/CategoryFilter";
import CategoryTable from "./components/CategoryTable";
import PAGE_LIMIT from "./constants";

export default function CategorySamplePage() {
  const {
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    isFiltering,
    filters,
    fetchDownloads,
    handleFilterChange,
    handleFilterReset,
    formatUtmInline,
  } = useCategoryDownload();

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* HEADER */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <List size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Category Sample Downloads
            </h1>
            <p className="text-gray-600 mt-1">
              Track and analyze category sample downloads
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {data.length} records loaded
        </div>
      </div>

      {/* FILTER */}
      <CategoryFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        isFiltering={isFiltering}
      />

      {/* TABLE */}
      <CategoryTable
        data={data}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        fetchDownloads={fetchDownloads}
        formatUtmInline={formatUtmInline}
        PAGE_LIMIT={PAGE_LIMIT}
      />
    </div>
  );
}
