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

      // refresh page
      fetchDownloads(page);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the record. Please try again.");
    }
  };

  /* ================= LOADING ================= */
  if (loading && page === 1) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading product downloads...</p>
      </div>
    );
  }

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
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">
                <div className="flex items-center gap-2">
                  <User size={14} /> User
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">UTM Details</th>
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold  uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Download className="text-gray-400" size={24} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No download records found
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters to see more results.
                    </p>
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
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* INDEX */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium bg-gray-50 text-gray-700 rounded-lg px-3 py-1 inline-block">
                      {(page - 1) * PAGE_LIMIT + index + 1}
                    </div>
                  </td>

                  {/* USER */}
                  <td className="px-6 py-4 max-w-[200px]">
                    <TooltipCell text={item.user_name}>
                      <span className="font-medium truncate block text-gray-600">
                        {item.user_name}
                      </span>
                    </TooltipCell>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm max-w-[220px] text-gray-600">
                    <TooltipCell text={item.user_email}>
                      {item.user_email}
                    </TooltipCell>
                  </td>

                  {/* PRODUCT */}
                  <td className="px-6 py-4 max-w-[240px]">
                    <TooltipCell text={item.product_name}>
                      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm truncate">
                        <Package size={12} />
                        {item.product_name}
                      </div>
                    </TooltipCell>
                  </td>

                  {/* UTM */}
                  <td className="px-6 py-4 text-sm max-w-[260px] text-gray-600">
                    <TooltipCell text={formatUtmInline(item.utm)}>
                      <div className="truncate text-xs text-gray-700 text-gray-600">
                        {formatUtmInline(item.utm)}
                      </div>
                    </TooltipCell>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* DELETE */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 "
                      title="Delete record"
                    >
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
     {data.length > 0 && (
  <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 text-gray-600">
    {/* Left text */}
    <div className="text-sm text-gray-700 whitespace-nowrap">
      Showing{" "}
      <span className="font-semibold">
        {(page - 1) * PAGE_LIMIT + 1}
      </span>{" "}
      to{" "}
      <span className="font-semibold">
        {Math.min(page * PAGE_LIMIT, (page - 1) * PAGE_LIMIT + data.length)}
      </span>
    </div>

    {/* Right buttons */}
    <div className="flex items-center gap-2 whitespace-nowrap">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
        className="flex items-center gap-1 px-4 py-2 border rounded-lg disabled:opacity-50 text-gray-600"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
        className="flex items-center gap-1 px-4 py-2 border rounded-lg disabled:opacity-50 text-gray-600"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
)}

    </div>
  );
}
