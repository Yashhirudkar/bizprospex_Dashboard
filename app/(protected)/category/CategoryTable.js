import { useState } from "react";
import {
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaFilter
} from "react-icons/fa";
import EditCategoryModal from "./EditCategoryModal";

const getStatusBadge = (isActive) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    {isActive ? (
      <>
        <FaEye className="inline mr-1" /> Active
      </>
    ) : (
      <>
        <FaEyeSlash className="inline mr-1" /> Inactive
      </>
    )}
  </span>
);

export default function CategoryTable({
  categories,
  loading,
  openMenu,
  setOpenMenu,
  pagination,
  sortBy,
  sortOrder,
  handleSort,
  handlePageChange,
  deleteCategory,
  onCategoryUpdate // Add this prop for refreshing the list
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
    setOpenMenu(null);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    if (onCategoryUpdate) onCategoryUpdate();
  };

  return (
    <>
      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Name
                  {sortBy === "name" && (
                    sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("count")}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Products
                  {sortBy === "count" && (
                    sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr
                key={cat.category_id}
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {cat.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {cat.category_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {cat.slug}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                    {cat.description || (
                      <span className="text-gray-400 italic">No description</span>
                    )}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {cat.count} products
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(cat.is_active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {cat.background_image ? (
                    <div className="relative group">
                      <img
                        src={cat.background_image}
                        alt={cat.name}
                        className="h-12 w-16 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <FaImage className="text-white text-lg" />
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm text-gray-500 bg-gray-100">
                      <FaImage className="mr-1" /> No image
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                  <button
                    onClick={() =>
                      setOpenMenu(
                        openMenu === cat.category_id
                          ? null
                          : cat.category_id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaEllipsisV className="h-5 w-5 text-gray-500" />
                  </button>

                  {openMenu === cat.category_id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setOpenMenu(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-30">
                        <button
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                          onClick={() => handleEditClick(cat)}
                        >
                          <FaEdit className="text-blue-600" /> Edit Category
                        </button>
                        <button
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={async () => {
                              const ok = confirm(`Are you sure you want to delete ${cat.name}?`);
                              if (!ok) return;

                              const result = await deleteCategory(cat.category_id);

                              if (result.success) {
                                alert("Category deleted successfully");
                              } else {
                                alert(result.error || "Failed to delete category");
                              }

                              setOpenMenu(null);
                            }}

                        >
                          <FaTrash /> Delete Category
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaFilter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">
            Try adjusting your filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> categories
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded-lg ${pagination.page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border hover:bg-gray-50"
                  }`}
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page =>
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.page) <= 1
                )
                .map((page, index, array) => {
                  if (index > 0 && page > array[index - 1] + 1) {
                    return <span key={`ellipsis-${page}`} className="px-2">...</span>;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg ${page === pagination.page
                          ? "bg-blue-600 text-white"
                          : "bg-white border hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1 rounded-lg ${pagination.page === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border hover:bg-gray-50"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        category={selectedCategory}
      />
    </>
  );
}
