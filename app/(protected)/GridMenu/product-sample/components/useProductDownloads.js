import { useEffect, useState } from "react";
import axios from "axios";
import PAGE_LIMIT from "../constants";
import { apiUrl } from "../../../../../constant/api";

export function useProductDownload() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  const [filters, setFilters] = useState({
    user_email: "",
    product_name: "",
    utm_source: "",
    utm_campaign: "",
    from_date: "",
    to_date: "",
  });

  // 🔥 SIMPLE + SAFE FETCH (NO useCallback)
  const fetchDownloads = async (pageNo = 1) => {
    try {
      setLoading(true);
      setIsFiltering(true);
      setError("");

      const res = await axios.get(
        `${apiUrl}/admin/Downloadsample`,
        {
          params: {
            page: pageNo,
            limit: PAGE_LIMIT,
            ...filters,
          },
          withCredentials: true,
        }
      );

      const rows = res.data?.data?.downloads || [];

      setData(
        rows.map((item) => ({
          id: item.id,
          user_name: item.user_name,
          user_email: item.user_email,
          product_name: item.product_name,
          createdAt: item.createdAt,
          utm: {
            utm_source: item.utm_source || "-",
            utm_medium: item.utm_medium || "-",
            utm_campaign_id: item.utm_campaign_id || "-",
            adgroup_id: item.adgroup_id || "-",
            country: item.country || "-",
            city: item.city || "-",
          },
        }))
      );

      setTotalPages(res.data?.data?.totalPages || 1);
    } catch (err) {
      setData([]); // 🔥 old data clear
      setError("Failed to load product downloads");
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  // 🔥 PAGE + FILTER CHANGE → ALWAYS FETCH LATEST DATA
  useEffect(() => {
    fetchDownloads(page);
  }, [page, filters]); // 👈 MOST IMPORTANT FIX

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilters({
      user_email: "",
      product_name: "",
      utm_source: "",
      utm_campaign: "",
      from_date: "",
      to_date: "",
    });
    setPage(1);
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
