"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaEye,
  FaTimes,
  FaCloudUploadAlt,
  FaSearch,
} from "react-icons/fa";
import UploadData from "./Upload";
import { apiUrl } from "../../../constant/api";

export default function ProductUploadPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const searchRef = useRef(null);

  /* ---------------- FETCH PRODUCTS (DEBOUNCED) ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(page, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, page]);

  const fetchProducts = async (pageNum = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/products`, {
        params: { search: searchTerm, page: pageNum, limit: 10 },
        withCredentials: true,
      });

      setProducts(res.data.data.items || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[90vh] p-3 md:p-6 gap-4 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-2xl md:text-3xl font-semibold text-blue-600">
          Product Data Management
        </h1>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2">
            <FaCloudUploadAlt className="text-5xl text-gray-300" />
            <p className="text-lg text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">
              {search
                ? "Try a different search term"
                : "Start by adding products"}
            </p>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="overflow-auto flex-1 scrollbar-thin">
              <table className="min-w-full border-collapse">
                <thead className="bg-blue-600 text-white sticky top-0">
                  <tr>
                    {[
                      "Product Name",
                      "Stock Quantity",
                      "Uploaded Rows",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.product_id}
                      className="hover:bg-blue-50 transition cursor-pointer"
                    >
                      <td className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap">
                        {product.title}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            product.stock_quantity > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-blue-600">
                        {product.data_count || 0}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/upload-data/${product.product_id}`;
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                            title="View uploaded data"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => handleProductSelect(product)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded"
                            title="Upload data"
                          >
                            <FaCloudUploadAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 bg-gray-50 border-t border-gray-200  ">
              <p className="text-sm text-gray-600">
                Showing {products.length} products
              </p>

              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1 rounded border ${
                    page === 1
                      ? "bg-gray-100 text-gray-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Prev
                </button>

                <span className="px-3 py-1 font-medium">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1 rounded border ${
                    page === totalPages
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-lg">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 bg-blue-600 text-white rounded-t-xl">
              <div>
                <h2 className="text-lg font-semibold">Upload Data</h2>
                <p className="text-sm opacity-90">
                  Upload data files for the selected product
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-blue-700 rounded"
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-4">
              {selectedProduct && (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Selected Product
                    </p>
                    <h3 className="text-xl font-semibold text-blue-600">
                      {selectedProduct.title}
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm">
                      <span>
                        <strong>ID:</strong>{" "}
                        {selectedProduct.product_id}
                      </span>
                      <span>
                        <strong>Stock:</strong>{" "}
                        {selectedProduct.stock_quantity}
                      </span>
                      <span>
                        <strong>Existing Rows:</strong>{" "}
                        {selectedProduct.data_count || 0}
                      </span>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <UploadData
                    productId={selectedProduct.product_id}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
