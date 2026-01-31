  "use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { useProductDownload } from "./components/useProductDownloads";
import ProductFilter from "./components/ProductFilter";
import DataTable from "./components/ProductTable";
import PAGE_LIMIT from "./constants";
import { apiUrl } from "@/constant/api";

export default function DownloadSamplePage() {
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
  } = useProductDownload();

  const [selectedIds, setSelectedIds] = useState([]);
  const [tableRef, setTableRef] = useState(null);


const handleBulkDelete = async () => {
  if (selectedIds.length === 0) return;
  if (!confirm(`Delete ${selectedIds.length} records?`)) return;

  try {
    const results = await Promise.all(
      selectedIds.map((id) =>
        fetch(`${apiUrl}/admin/Downloadsample/${id}`, {
          method: "DELETE",
          credentials: "include",
        })
      )
    );

    const failed = results.filter((r) => !r.ok);
    if (failed.length) {
      throw new Error(`Failed to delete ${failed.length} records`);
    }

    setSelectedIds([]);
    setPage(1);
    fetchDownloads(1);
  } catch (err) {
    console.error("Bulk delete error:", err);
    alert("Delete failed");
  }
};

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
              Product Sample Downloads
            </h1>
            <p className="text-gray-600 mt-1">
              Track and analyze product sample downloads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <span>{data.length} records loaded</span>
        </div>
      </div>

      {/* FILTERS */}
      <ProductFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        isFiltering={isFiltering}
        selectedIds={selectedIds}
        onBulkDelete={handleBulkDelete}
      />

      {/* TABLE */}
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
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  );
}
