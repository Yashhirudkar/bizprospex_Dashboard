"use client";

import { List } from "lucide-react";
import { useState, useEffect } from "react";
import { useCategoryDownload } from "./components/useCategoryDownload";
import CategoryFilter from "./components/CategoryFilter";
import CategoryTable from "./components/CategoryTable";
import PAGE_LIMIT from "./constants";
import { apiUrl } from "@/constant/api.js";

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

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, data]);

  const allSelected =
    data.length > 0 && selectedIds.length === data.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((d) => d.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Delete ${selectedIds.length} records?`)) return;

    try {
      const res = await fetch(
        `${apiUrl}/admin/category-sample-downloads`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ids: selectedIds }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSelectedIds([]);
        fetchDownloads(page);
      } else {
        alert(data.message || "Bulk delete failed");
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
    }
  };

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
        selectedIds={selectedIds}
        handleBulkDelete={handleBulkDelete}
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
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        toggleSelectAll={toggleSelectAll}
        toggleSelectOne={toggleSelectOne}
        allSelected={allSelected}
        handleBulkDelete={handleBulkDelete}
      />
    </div>
  );
}
