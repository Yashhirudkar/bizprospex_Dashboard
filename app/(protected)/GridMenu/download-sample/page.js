"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Search,
  Calendar,
  User,
  Package,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Mail,
  Globe,
  BarChart3
} from "lucide-react";
import TooltipCell from "../../../components/tooltip.js";

const PAGE_LIMIT = 20;

export default function DownloadSampleTable() {
  // Moved inside the component
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
  const fetchDownloads = useCallback(async (pageNo = 1) => {
    try {
      setLoading(true);
      // Determine if we are currently filtering based on input values
      const hasActiveFilters = Object.values(filters).some(val => val !== "");
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
            // Only apply filters for the "download" source as per original logic
            ...(source === "download" ? filters : {}),
          },
          withCredentials: true,
        }
      );

      // Normalize response data structure
      const normalizedData =
        source === "download"
          ? (res.data?.data?.downloads || []).map(item => ({
              id: item.id,
              user_name: item.user_name,
              user_email: item.user_email,
              product_name: item.product_name,
              utm: {
                source: item.utm_source || "-",
                medium: item.utm_medium || "-",
                campaign: item.utm_campaign || "-",
                adgroup: item.adgroup_id || "-",
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
    source: item.utm_source || "-",
    medium: item.utm_medium || "-",
    campaign: item.utm_campaign || "-",
    adgroup: item.utm_adgroup || "-",
  },
  createdAt: item.createdAt,
  sample_link: item.CategorySampleFile?.sample_link,
}));


      setData(normalizedData);

      // Normalize pagination structure
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
  }, [filters, source]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchDownloads(page);
  }, [page, fetchDownloads]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filtering
  };


  const formatUtmInline = (utm) => {
  if (!utm) return "-";

  const parts = [];

  if (utm.source && utm.source !== "-")
    parts.push(`utm_source: ${utm.source}`);

  if (utm.medium && utm.medium !== "-")
    parts.push(`utm_medium: ${utm.medium}`);

  if (utm.campaign && utm.campaign !== "-")
    parts.push(`utm_campaign: ${utm.campaign}`);

  if (utm.adgroup && utm.adgroup !== "-")
    parts.push(`utm_adgroup: ${utm.adgroup}`);

return parts.length ? parts.join(" | ") : "-";
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


  /* ================= UI RENDERING ================= */
  if (loading && page === 1) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading download samples...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-700 mb-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Failed to Load Data</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
        <button
          onClick={() => fetchDownloads(1)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* HEADER */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Download size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sample Download Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Track and analyze sample downloads with detailed insights
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Active tracking</span>
          </div>
          <span>•</span>
          <span>{data.length} records loaded</span>
        </div>
      </div>

      {/* SOURCE SWITCHER */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setSource("download");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            source === "download"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Sample Downloads
        </button>

        <button
          onClick={() => {
            setSource("category");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            source === "category"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Category Samples
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-5 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Filter Results
            </h3>
            {isFiltering && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-600">Filtering...</span>
              </div>
            )}
          </div>
          <button
            onClick={handleFilterReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail size={16} />
              User Email
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by email..."
                value={filters.user_email}
                onChange={(e) => handleFilterChange("user_email", e.target.value)}
                className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar size={16} />
              From Date
            </label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="w-full text-gray-600 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar size={16} />
              To Date
            </label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="w-full px-4 text-gray-600 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><User size={14} /> User</div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">UTM Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sample</th>
              </tr>
            </thead>

          <tbody className="divide-y divide-gray-200">
  {data.length === 0 ? (
    <tr>
      <td colSpan="10" className="px-6 py-16 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Download className="text-gray-400" size={24} />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No download records found
          </h4>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters to see more results.
          </p>
          <button
            onClick={handleFilterReset}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </td>
    </tr>
  ) : (
    data.map((item, index) => (
      <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
        
        {/* INDEX */}
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-1 inline-block">
            {(page - 1) * PAGE_LIMIT + index + 1}
          </div>
        </td>

        {/* USER NAME */}
        <td className="px-6 py-4 max-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <User size={16} className="text-blue-600" />
            </div>
            <TooltipCell text={item.user_name}>
              <span className="font-medium text-gray-900 truncate">
                {item.user_name}
              </span>
            </TooltipCell>
          </div>
        </td>

        {/* EMAIL */}
        <td className="px-6 py-4 text-sm text-gray-900 max-w-[220px]">
          <TooltipCell text={item.user_email}>
            {item.user_email}
          </TooltipCell>
        </td>

        {/* PRODUCT */}
        <td className="px-6 py-4 max-w-[240px]">
          <TooltipCell text={item.product_name}>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm truncate">
              <Package size={12} />
              {item.product_name}
            </div>
          </TooltipCell>
        </td>

       {/* UTM DETAILS */}
      {/* UTM DETAILS */}
<td className="px-6 py-4 text-sm max-w-[260px]">
  <TooltipCell text={formatUtmInline(item.utm)}>
    <div className="truncate text-xs text-gray-700">
      {formatUtmInline(item.utm)}
    </div>
  </TooltipCell>
</td>



        {/* DATE */}
        <td className="px-6 py-4 text-sm text-gray-600">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "-"}
        </td>

        {/* LINK */}
        <td className="px-6 py-4">
          {item.sample_link ? (
            <a
              href={item.sample_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="text-sm">View</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <span className="text-gray-400 text-sm">No link</span>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>

        {/* PAGINATION */}
        {data.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
             <div className="text-sm text-gray-700">
              Showing <span className="font-semibold">{(page - 1) * PAGE_LIMIT + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(page * PAGE_LIMIT, (page - 1) * PAGE_LIMIT + data.length)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY LOADING */}
      {loading && page > 1 && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-700 font-medium">Updating data...</p>
          </div>
        </div>
      )}
    </div>
  );
}