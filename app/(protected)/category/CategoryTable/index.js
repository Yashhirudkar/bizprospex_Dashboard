import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSortAmountDown, FaSortAmountUp, FaImage, FaFilter } from "react-icons/fa";
import { apiUrl } from "@/constant/api";

// Sub-components
import StatusBadge from "./StatusBadge";
import ActionMenu from "./ActionMenu";
import Pagination from "./Pagination";
import UploadSampleModal from "../UploadSampleModal";
import EditCategoryModal from "../EditCategoryModal";

export default function CategoryTable({
  categories, loading, openMenu, setOpenMenu, pagination, 
  sortBy, sortOrder, handleSort, handlePageChange, deleteCategory, onCategoryUpdate
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [seoStatuses, setSeoStatuses] = useState({});
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [selectedCategoryForSample, setSelectedCategoryForSample] = useState(null);
  const router = useRouter();

  // Fetch SEO logic stays here as it relates to the whole list
  useEffect(() => {
    const fetchSeoStatuses = async () => {
      const statuses = {};
      for (const cat of categories) {
        try {
          const res = await axios.get(`${apiUrl}/admin/seo/entity`, {
            params: { entity_type: "category", entity_id: cat.category_id },
            withCredentials: "include",
          });
          const seo = res.data.data || {};
          statuses[cat.category_id] = {
            seo_title: seo.seo_title || "",
            seo_description: seo.seo_description || "",
            slug: seo.slug || "",
          };
        } catch (err) {
          statuses[cat.category_id] = { seo_title: "", seo_description: "", slug: "" };
        }
      }
      setSeoStatuses(statuses);
    };

    if (categories.length > 0) fetchSeoStatuses();
  }, [categories]);

  return (
    <>
      <div className="overflow-x-auto max-h-[57vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Header logic remains similar */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.category_id} className="hover:bg-blue-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  <div className="text-sm text-gray-500">ID: {cat.category_id}</div>
                </td>
                <td className="px-6 py-4">
                   <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">{cat.slug}</code>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">{cat.description || "No description"}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {cat.count} products
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge isActive={cat.is_active} />
                </td>
                <td className="px-6 py-4">
                  {cat.background_image ? (
                    <img src={cat.background_image} className="h-12 w-16 object-cover rounded-lg border" />
                  ) : (
                    <span className="text-sm text-gray-400"><FaImage className="inline" /> No image</span>
                  )}
                </td>
                
                <ActionMenu 
                  cat={cat}
                  isOpen={openMenu === cat.category_id}
                  setOpenMenu={setOpenMenu}
                  hasSeoIssues={seoStatuses[cat.category_id] && (!seoStatuses[cat.category_id].seo_title || !seoStatuses[cat.category_id].slug)}
                  onEdit={() => { setSelectedCategory(cat); setIsEditModalOpen(true); }}
                  onSeo={() => router.push(`/category/seo?category_id=${cat.category_id}`)}
                  onUpload={() => { setSelectedCategoryForSample(cat); setIsSampleModalOpen(true); }}
                  onDelete={async () => {
                     if(confirm(`Delete ${cat.name}?`)) {
                        const res = await deleteCategory(cat.category_id);
                        if(res.success) onCategoryUpdate();
                     }
                  }}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
           <FaFilter className="h-12 w-12 mx-auto mb-4" />
           <p>No categories found</p>
        </div>
      )}

      <Pagination pagination={pagination} handlePageChange={handlePageChange} />

      <UploadSampleModal isOpen={isSampleModalOpen} onClose={() => setIsSampleModalOpen(false)} category={selectedCategoryForSample} onSuccess={onCategoryUpdate} />
      <EditCategoryModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSuccess={() => { setIsEditModalOpen(false); onCategoryUpdate(); }} category={selectedCategory} />
    </>
  );
}