"use client";

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useCategories } from "./useCategories";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import AddCategoryModal from "./AddCategoryModal";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    categories,
    loading,
    openMenu,
    setOpenMenu,
    pagination,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    statusFilter,
    showFilters,
    setShowFilters,
    handlePageChange,
    handleSearch,
    handleSort,
    handleStatusFilter,
    clearFilters,
    fetchCategories,
    deleteCategory
  } = useCategories();

  const handleCategorySuccess = () => {
    fetchCategories();
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-600 mt-1">Manage your product categories</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition duration-200"
          >
            <FaEdit /> Add New Category
          </button>
        </div>
      </div>

      <CategoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        statusFilter={statusFilter}
        handleStatusFilter={handleStatusFilter}
        clearFilters={clearFilters}
        handleSearch={handleSearch}
        pagination={pagination}
      />

      <CategoryTable
        categories={categories}
        loading={loading}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSort={handleSort}
        handlePageChange={handlePageChange}
        deleteCategory={deleteCategory}
        onCategoryUpdate={handleCategorySuccess}
      />

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCategorySuccess}
      />
    </div>
  );
}
