import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PAGE_LIMIT from "../constants.js";

export function useDownloadSample() {
  const [source, setSource] = useState("download");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    user_email: "",
    product_name: "",
    utm_source: "",
    utm_campaign: "",
    from_date: "",
    to_date: "",
  });

  /* ================= API CALL ================= */
  const fetchDownloads = useCallback(
    async (pageNo = 1) => {
      try {
        setLoading(true);

        const hasActiveFilters = Object.values(filters).some(
          val => val !== ""
        );
        setIsFiltering(hasActiveFilters);

        const url =
          source === "download"
            ? "/api/admin/Downloadsample"
            : "/api/admin/category/sample-downloads";

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}${url}`,
          {
            params: {
              page: pageNo,
              limit: PAGE_LIMIT,
              ...(source === "download" ? filters : {}),
            },
            withCredentials: true,
          }
        );

        /* ================= NORMALIZED DATA ================= */
        const normalizedData =
          source === "download"
            ? (res.data?.data?.downloads || []).map(item => ({
                id: item.id,
                user_name: item.user_name,
                user_email: item.user_email,
                product_name: item.product_name,

                utm: {
                  utm_source: item.utm_source || "-",
                  utm_medium: item.utm_medium || "-",
                  utm_campaign_id: item.utm_campaign_id || "-",
                  adgroup_id: item.adgroup_id || "-",
                  country: item.country || "-",
                  city: item.city || "-",
                },

                createdAt: item.createdAt,
                sample_link: item.sample_link,
              }))
            : (res.data?.data || []).map(item => ({
                id: item.id,
                user_name: item.user_name,
                user_email: item.user_email,
                product_name: item.product_name,

                utm: {
                  utm_source: item.utm_source || "-",
                  utm_medium: item.utm_medium || "-",
                  utm_campaign_id: item.utm_campaign_id || "-",
                  adgroup_id: item.utm_adgroup || "-",
                  country: item.country || "-",
                  city: item.city || "-",
                },

                createdAt: item.createdAt,
                sample_link:
                  item.CategorySampleFile?.sample_link || "-",
              }));

        setData(normalizedData);

        /* ================= PAGINATION ================= */
        const pagination =
          source === "download"
            ? res.data?.data
            : res.data?.pagination;

        setTotalPages(pagination?.totalPages || 1);
        setPage(pagination?.page || 1);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load download samples");
      } finally {
        setLoading(false);
        setIsFiltering(false);
      }
    },
    [filters, source]
  );

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchDownloads(page);
  }, [page, fetchDownloads]);

  /* ================= HANDLERS ================= */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  /* ================= FORMATTER ================= */
  const formatUtmInline = (utm) => {
    if (!utm) return "-";

    const parts = [];

    if (utm.utm_source && utm.utm_source !== "-")
      parts.push(`utm_source: ${utm.utm_source}`);

    if (utm.utm_medium && utm.utm_medium !== "-")
      parts.push(`utm_medium: ${utm.utm_medium}`);

    if (utm.utm_campaign_id && utm.utm_campaign_id !== "-")
      parts.push(`utm_campaign: ${utm.utm_campaign_id}`);

    if (utm.adgroup_id && utm.adgroup_id !== "-")
      parts.push(`adgroup_id: ${utm.adgroup_id}`);

    if (utm.country && utm.country !== "-")
      parts.push(`country: ${utm.country}`);

    if (utm.city && utm.city !== "-")
      parts.push(`city: ${utm.city}`);

    return parts.length ? parts.join(" | ") : "-";
  };

  return {
    source,
    setSource,
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    isFiltering,
    filters,
    fetchDownloads,
    handleFilterChange,
    handleFilterReset,
    formatUtmInline,
  };
}
