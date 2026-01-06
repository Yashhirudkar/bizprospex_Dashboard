import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
  FaImage,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaUpload,
} from "react-icons/fa";
import UploadSampleModal from "./UploadSampleModal";
import { FaSearch } from "react-icons/fa";
import EditCategoryModal from "./EditCategoryModal";
import { apiUrl } from "../../../constant/api";

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
  onCategoryUpdate,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seoStatuses, setSeoStatuses] = useState({});
  const router = useRouter();



  /* ===============================
   Upload download sample for  ALL CATEGORIES
  ================================ */
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
const [selectedCategoryForSample, setSelectedCategoryForSample] = useState(null);

  /* ===============================
     FETCH SEO STATUSES FOR ALL CATEGORIES
  ================================ */
  useEffect(() => {
    const fetchSeoStatuses = async () => {
      const statuses = {};
      for (const cat of categories) {
        try {
          const res = await axios.get(
            `${API_BASE}/admin/seo/entity`,
            {
              params: {
                entity_type: "category",
                entity_id: cat.category_id,
              },
             withCredentials:"include",
            }
          );
          if (res.data.data) {
            const seo = res.data.data;
            statuses[cat.category_id] = {
              seo_title: seo.seo_title || "",
              seo_description: seo.seo_description || "",
              slug: seo.slug || "",
            };
          } else {
            statuses[cat.category_id] = {
              seo_title: "",
              seo_description: "",
              slug: "",
            };
          }
        } catch (err) {
          statuses[cat.category_id] = {
            seo_title: "",
            seo_description: "",
            slug: "",
          };
        }
      }
      setSeoStatuses(statuses);
    };

    if (categories.length > 0) {
      fetchSeoStatuses();
    }
  }, [categories]);

  /* ===============================
     HANDLERS
  ================================ */
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
    setOpenMenu(null);
  };

  const handleSeoClick = (category) => {
    router.push(`/category/seo?category_id=${category.category_id}`);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    if (onCategoryUpdate) onCategoryUpdate();
  };


  return (
    <>
      {/* Categories Table */}
      <div className="overflow-x-auto max-h-[57vh] overflow-y-auto">
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
                  <div className="w-8 h-8 flex items-center justify-center rounded-full 
                bg-gray-100 border border-blue-200 
                hover:bg-blue-200 hover:border-blue-300
                cursor-pointer transition">
                  <FaEllipsisV className="h-4 w-4 text-gray-600" />
                </div>


                  </button>

               {openMenu === cat.category_id && (
<>
  {/* Overlay (click outside to close) */}
  <div
    className="fixed inset-0 z-20"
    onClick={() => setOpenMenu(null)}
  />

  {/* Horizontal Icon Menu */}
  <div className="absolute right-18 top-3 bg-white rounded-xl shadow-lg border border-blue-200 z-30 px-4 py-3 mr-[32px]">
    <div className="flex items-center gap-4">

      {/* EDIT */}
      <div className="relative group">
        <button
          onClick={() => {
            handleEditClick(cat);
            setOpenMenu(null);
          }}
          className="
            w-10 h-10 flex items-center justify-center
            rounded-full
            bg-blue-50 border border-blue-200
            text-blue-600
            hover:bg-blue-100 hover:scale-110
            transition
          "
        >
          <FaEdit size={16} />
        </button>

        <span className="absolute -top-8 left-1/2 -translate-x-1/2
          whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition">
          Edit
        </span>
      </div>

      {/* SEO */}
      <div className="relative group">
        <button
          onClick={() => {
            handleSeoClick(cat);
            setOpenMenu(null);
          }}
          className="
            w-10 h-10 flex items-center justify-center
            rounded-full
            bg-green-50 border border-green-200
            text-green-600
            hover:bg-green-100 hover:scale-110
            transition
          "
        >
          <FaSearch size={16} />
          {seoStatuses[cat.category_id] &&
            (!seoStatuses[cat.category_id].seo_title ||
              !seoStatuses[cat.category_id].seo_description ||
              !seoStatuses[cat.category_id].slug) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
            )}
        </button>

        <span className="absolute -top-8 left-1/2 -translate-x-1/2
          whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition">
          SEO
        </span>
      </div>

      {/* UPLOAD SAMPLE */}
      <div className="relative group">
        <button
          onClick={() => {
            setSelectedCategoryForSample(cat);
            setIsSampleModalOpen(true);
            setOpenMenu(null);
          }}
          className="
            w-10 h-10 flex items-center justify-center
            rounded-full
            bg-purple-50 border border-purple-200
            text-purple-600
            hover:bg-purple-100 hover:scale-110
            transition
          "
        >
          <FaUpload size={16} />
        </button>

        <span className="absolute -top-8 left-1/2 -translate-x-1/2
          whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition">
          Upload Sample
        </span>
      </div>

      {/* DELETE */}
      <div className="relative group">
        <button
          onClick={async () => {
            const ok = confirm(`Are you sure you want to delete ${cat.name}?`);
            if (!ok) return;

            const result = await deleteCategory(cat.category_id);

            alert(
              result.success
                ? "Category deleted successfully"
                : result.error || "Failed to delete category"
            );

            setOpenMenu(null);
          }}
          className="
            w-10 h-10 flex items-center justify-center
            rounded-full
            bg-red-50 border border-red-200
            text-red-600
            hover:bg-red-100 hover:scale-110
            transition
          "
        >
          <FaTrash size={16} />
        </button>

        <span className="absolute -top-8 left-1/2 -translate-x-1/2
          whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition">
          Delete
        </span>
      </div>

    </div>
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
                    : "bg-white border text-gray-500 hover:bg-gray-50"
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
                    : "bg-white border text-gray-500 hover:bg-gray-50"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}


            {/* Upload Sample Modal */}
      <UploadSampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        category={selectedCategoryForSample}
        onSuccess={onCategoryUpdate}
      />

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
