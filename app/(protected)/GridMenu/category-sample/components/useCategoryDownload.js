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
    async (pageNo = 1, isFilterAction = false) => {
      try {
        setLoading(true);
        if (isFilterAction) setIsFiltering(true);

        // 🔹 remove empty filters
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v)
        );

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/category/sample-downloads`,
          {
            params: {
              page: pageNo,
              limit: PAGE_LIMIT,
              ...cleanFilters,
              _t: isFilterAction ? Date.now() : undefined, // optional cache breaker
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

  // 🔹 pagination fetch
  useEffect(() => {
    fetchDownloads(page);
  }, [page, fetchDownloads]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    fetchDownloads(1, true);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      user_email: "",
      category_name: "",
      utm_source: "",
      utm_campaign: "",
      from_date: "",
      to_date: "",
    };

    setFilters(resetFilters);
    setPage(1);
    fetchDownloads(1, true);
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
