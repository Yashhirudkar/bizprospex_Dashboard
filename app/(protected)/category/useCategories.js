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
    totalPages: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCategories = async (
    page = pagination.page,
    limit = pagination.limit
  ) => {
    setLoading(true);

    try {
      let url = `${apiUrl}/categories/admin/list?page=${page}&limit=${limit}`;

      // 🔍 Search
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      // 🔘 Status filter (backend expects is_active)
      if (statusFilter !== "all") {
        url += `&is_active=${statusFilter === "active"}`;
      }

      // ↕ Sorting
      if (sortBy) {
        url += `&sortBy=${sortBy}&order=${sortOrder.toUpperCase()}`;
      }

      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();

      if (data.success) {
        setCategories(data.categories || []);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Initial load
  useEffect(() => {
    fetchCategories(1, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ==========================
     HANDLERS
  ========================== */

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
    const newOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";

    setSortBy(field);
    setSortOrder(newOrder);
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
      const response = await fetch(
        `${apiUrl}/categories/admin/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchCategories(pagination.page, pagination.limit);
        return { success: true };
      }

      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Failed to delete category",
      };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, error: "Network error occurred" };
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
    deleteCategory,
  };
}
