"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { apiUrl } from "../../../../constant/api";

export default function UploadedDataTable() {
  const { productId } = useParams();
  const router = useRouter();

  const [rows, setRows] = useState([]);
  const [product, setProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: "id", label: "ID" },
    { id: "company_name", label: "Company Name" },
    { id: "company_website", label: "Company Website" },
    { id: "company_industry", label: "Industry" },
    { id: "no_of_employees", label: "Employees" },
    { id: "company_size", label: "Company Size" },
    { id: "company_address", label: "Address" },
    { id: "company_linkedin_url", label: "Company LinkedIn" },
    { id: "company_phone_number", label: "Phone Number" },
    { id: "first_name", label: "First Name" },
    { id: "last_name", label: "Last Name" },
    { id: "email", label: "Email" },
    { id: "title", label: "Job Title" },
    { id: "person_linkedin_url", label: "Person LinkedIn" },
    { id: "source_url", label: "Source URL" },
    { id: "person_location", label: "Location" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl}/datastore/uploaded-data/${productId}`,
        {
          params: { page: page + 1, limit },
          withCredentials: true,
        }
      );

      setRows(res.data.data || []);
      setProduct(res.data.product);
      setTotal(res.data.pagination.total || 0);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    /* 🌍 FULL PAGE HORIZONTAL SCROLL */
<div className="w-screen max-w-[85vw] overflow-x-auto">
      <div className="p-2 sm:p-4 md:p-6">

        {/* HEADER */}
        <div className="mb-4 bg-blue-600 text-white rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold break-words text-center sm:text-left">
            {product?.name || "Uploaded Data"}
          </h1>

          <button
            onClick={() => router.push("/upload-data")}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 w-full sm:w-auto"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* TABLE (ONLY VERTICAL SCROLL) */}
              <div className="overflow-y-auto max-h-[70vh] scrollbar-thin">
                <table className="min-w-[1800px] w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.id}
                          className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {rows.length > 0 ? (
                      rows.map((row) => (
                        <tr key={row.id} className="hover:bg-blue-50">
                          {columns.map((col) => (
                            <td
                              key={col.id}
                              className="px-3 py-2 text-sm text-gray-700 max-w-[220px] truncate"
                              title={row[col.id] || "-"}
                            >
                              {row[col.id] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center py-6 text-gray-500"
                        >
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{page * limit + 1}</span> –{" "}
                  <span className="font-medium">
                    {Math.min((page + 1) * limit, total)}
                  </span>{" "}
                  of <span className="font-medium">{total}</span>
                </p>

                <div className="flex items-center gap-2">
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(0);
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {[10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} / page
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-1 rounded border ${
                      page === 0
                        ? "bg-gray-100 text-gray-400"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Prev
                  </button>

                  <span className="text-sm font-medium">
                    {page + 1} / {totalPages || 1}
                  </span>

                  <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-1 rounded border ${
                      page + 1 >= totalPages
                        ? "bg-gray-100 text-gray-400"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
