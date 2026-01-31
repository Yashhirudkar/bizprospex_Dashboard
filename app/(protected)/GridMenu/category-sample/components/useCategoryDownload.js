import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PAGE_LIMIT from "../constants";

export function useCategoryDownload() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  const [filters, setFilters] = useState({
    user_email: "",
    category_name: "",
    utm_source: "",
    utm_campaign: "",
    from_date: "",
    to_date: "",
  });

const fetchDownloads = useCallback(
  async (pageNo = 1) => {
    try {
      setLoading(true);

      // ✅ FRONTEND FIX: map user_email → search
      const cleanFilters = {};

      if (filters.user_email) {
        cleanFilters.search = filters.user_email;
      }

      // keep existing filters (optional)
      if (filters.from_date) cleanFilters.from_date = filters.from_date;
      if (filters.to_date) cleanFilters.to_date = filters.to_date;
      if (filters.utm_source) cleanFilters.utm_source = filters.utm_source;
      if (filters.utm_campaign) cleanFilters.utm_campaign = filters.utm_campaign;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/category/sample-downloads`,
        {
          params: {
            page: pageNo,
            limit: PAGE_LIMIT,
            ...cleanFilters,
          },
          withCredentials: true,
        }
      );

      const rows = res.data?.data || [];

      setData(
        rows.map((item) => ({
          id: item.id,
          user_name: item.user_name,
          user_email: item.user_email,
          category_name: item.Category?.name || "-",
          product_name: item.product_name || "-",
          createdAt: item.createdAt,
          utm: {
            utm_source: item.utm_source || "-",
            utm_medium: item.utm_medium || "-",
            utm_campaign_id: item.utm_campaign_id || "-",
            adgroup_id: item.utm_adgroup || "-",
            country: item.country || "-",
            city: item.city || "-",
          },
        }))
      );

      setTotalPages(res.data?.pagination?.totalPages || 1);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load category downloads");
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  },
  [filters]
);


  // fetch on page or filter change
  useEffect(() => {
    fetchDownloads(page);
  }, [page, filters, fetchDownloads]);

  const handleFilterChange = (key, value) => {
    setIsFiltering(true);
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setIsFiltering(true);
    setPage(1);
    setFilters({
      user_email: "",
      category_name: "",
      utm_source: "",
      utm_campaign: "",
      from_date: "",
      to_date: "",
    });
  };

  const formatUtmInline = (utm) => {
    if (!utm) return "-";
    return Object.entries(utm)
      .filter(([, v]) => v && v !== "-")
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
  };

  return {
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    filters,
    isFiltering,
    fetchDownloads,
    handleFilterChange,
    handleFilterReset,
    formatUtmInline,
  };
}
