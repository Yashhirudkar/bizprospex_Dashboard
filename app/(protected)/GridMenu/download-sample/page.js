"use client";

import { Download } from "lucide-react";
import { useDownloadSample } from "./components/useDownloadSample";
import FilterSection from "./components/FilterSection";
import DataTable from "./components/DataTable";
import PAGE_LIMIT from "./constants";

export default function DownloadSamplePage() {
  const {
    source,
    setSource,
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
  } = useDownloadSample();

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* HEADER */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Download size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sample Download Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Track and analyze sample downloads with detailed insights
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active tracking</span>
          </div>
          <span>•</span>
          <span>{data.length} records loaded</span>
        </div>
      </div>

      {/* SOURCE SWITCHER */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setSource("download");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            source === "download"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Sample Downloads
        </button>

        <button
          onClick={() => {
            setSource("category");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            source === "category"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Category Samples
        </button>
      </div>

      {/* FILTERS COMPONENT */}
      <FilterSection 
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleFilterReset={handleFilterReset}
        isFiltering={isFiltering}
      />

      {/* DATA TABLE COMPONENT */}
      <DataTable
        data={data}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        fetchDownloads={fetchDownloads}
        formatUtmInline={formatUtmInline}
        PAGE_LIMIT={PAGE_LIMIT}
        source={source}
      />

      {/* OVERLAY LOADING FOR PAGINATION */}
      {loading && page > 1 && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-700 font-medium">Updating data...</p>
          </div>
        </div>
      )}
    </div>
  );
}