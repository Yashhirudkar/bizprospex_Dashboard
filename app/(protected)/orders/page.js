"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../../constant/api";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/admin/orders/all-orders`, {
        params: { page: pageNumber, limit: perPage },
        withCredentials: true,
      });

      setOrders(res.data.data || []);
      setPage(res.data.currentPage || 1);
      setPerPage(res.data.perPage || 5);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold text-blue-600">
          All Orders
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto max-h-[70vh] scrollbar-thin">
        <table className="min-w-[1200px] w-full border-collapse">
          <thead className="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              {[
                "Sr No",
                "Order ID",
                "Customer Name",
                "Email",
                "Products",
                "Total",
                "Status",
                "Date",
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

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-10 text-center">
                  <div className="w-10 h-10 mx-auto border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const lineItems = Array.isArray(order.line_items)
                  ? order.line_items
                  : JSON.parse(order.line_items || "[]");

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium">
                      {(page - 1) * perPage + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {order.order_id}
                    </td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {order.customer_email}
                    </td>

                    {/* PRODUCTS */}
                    <td className="px-4 py-3 min-w-[300px]">
                      <div className="flex flex-wrap gap-2">
                        {lineItems.length ? (
                          lineItems.map((item, i) => (
                            <div
                              key={i}
                              className="border rounded-lg p-3 min-w-[180px] bg-white shadow-sm"
                            >
                              <p className="text-sm font-semibold">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                ₹{item.price}
                              </p>
                             <p className="text-xs text-gray-500">
                              Leads:{" "}
                           {item.meta_data?.find(
                          (m) => m.key?.toLowerCase().includes("lead")
                        )?.display_value || "-"}

                            </p>

                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">
                            No products
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-medium whitespace-nowrap">
                      ${order.total}
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
