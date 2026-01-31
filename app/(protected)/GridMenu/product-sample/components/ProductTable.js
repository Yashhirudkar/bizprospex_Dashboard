import { useState, useEffect } from "react";
import {
  User,
  Package,
  ChevronLeft,
  ChevronRight,
  Download,
  BarChart3,
  Trash
} from "lucide-react";
import TooltipCell from "../../../../components/tooltip.js";
import { apiUrl } from "@/constant/api.js";

export default function DataTable({
  data,
  loading,
  error,
  page,
  setPage,
  totalPages,
  fetchDownloads,
  formatUtmInline,
  PAGE_LIMIT,
  selectedIds,
  setSelectedIds,
}) {

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this sample download record?")) {
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/admin/Downloadsample/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      // 🔥 always refresh first page
      setPage(1);
      fetchDownloads(1);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the record. Please try again.");
    }
  };

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

  // const handleBulkDelete = async () => {
  //   if (selectedIds.length === 0) return;

  //   if (!confirm(`Delete ${selectedIds.length} records?`)) return;

  //   try {
  //     const res = await fetch(
  //       `${apiUrl}/admin/Downloadsample/${id}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //         body: JSON.stringify({ ids: selectedIds }),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error(`Failed to delete records: ${res.status} ${res.statusText}`);
  //     }

  //     const data = await res.json();

  //     if (data.success) {
  //       setSelectedIds([]);
  //       setPage(1);
  //       fetchDownloads(1);
  //     } else {
  //       alert(data.message || "Bulk delete failed");
  //     }
  //   } catch (err) {
  //     console.error("Bulk delete error:", err);
  //   }
  // };

  useEffect(() => {
    setSelectedIds([]);
  }, [page, data]);

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-700 mb-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Failed to Load Data</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={() => fetchDownloads(1)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                <div className="flex items-center gap-2">
                  <User size={14} /> User
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">UTM Details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Date</th>
              {/* <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Actions</th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {/* 🔥 LOADING INSIDE TABLE */}
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-20 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600">Loading latest data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Download className="text-gray-400" size={24} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No download records found
                    </h4>
                    <button
                      onClick={() => fetchDownloads(1)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={`${item.id}-${item.createdAt}`} // 🔥 STRONG KEY
                  className="hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {(page - 1) * PAGE_LIMIT + index + 1}
                  </td>

                  <td className="px-6 py-4 max-w-[200px]">
                    <TooltipCell text={item.user_name}>
                      <span className="truncate block text-gray-600">
                        {item.user_name}
                      </span>
                    </TooltipCell>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <TooltipCell text={item.user_email}>
                      {item.user_email}
                    </TooltipCell>
                  </td>

                  <td className="px-6 py-4">
                    <TooltipCell text={item.product_name}>
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm truncate">
                        <Package size={12} />
                        {item.product_name}
                      </div>
                    </TooltipCell>
                  </td>

                  <td className="px-6 py-4 text-xs text-gray-600">
                    <TooltipCell text={formatUtmInline(item.utm)}>
                      {formatUtmInline(item.utm)}
                    </TooltipCell>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>

                  {/* <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={selectedIds.length > 0}
                      className="text-red-500 hover:text-red-700 disabled:opacity-40"
                    >
                      <Trash size={14} />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-gray-600">
          <span className="text-sm text-gray-700">
            Showing {(page - 1) * PAGE_LIMIT + 1} to{" "}
            {Math.min(page * PAGE_LIMIT, (page - 1) * PAGE_LIMIT + data.length)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
