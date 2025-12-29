import { useEffect, useState } from "react";
import { apiUrl } from "../../../constant/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCategories = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      let url = `${apiUrl}/categories/admin/list?page=${page}&limit=${limit}`;

      // Add filters if applied
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      if (sortBy) {
        url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setCategories(data.data || []);
        setPagination(data.pagination || {
          page: page,
          limit: limit,
          total: data.data?.length || 0,
          totalPages: 1
        });
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCategories(newPage, pagination.limit);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCategories(1, pagination.limit);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    fetchCategories(1, pagination.limit);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchCategories(1, pagination.limit);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("name");
    setSortOrder("asc");
    setStatusFilter("all");
    fetchCategories(1, pagination.limit);
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/admin/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh categories after successful deletion
        fetchCategories(pagination.page, pagination.limit);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Failed to delete category' };
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  return {
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
    fetchCategories,
    handlePageChange,
    handleSearch,
    handleSort,
    handleStatusFilter,
    clearFilters,
    deleteCategory
  };
}
