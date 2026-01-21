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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 border-b">
        <h2 className="text-lg font-bold text-white">All Orders</h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto max-h-[70vh] scrollbar-thin">
        <table className="min-w-[1400px] w-full border-collapse">
          <thead className="bg-blue-50 text-blue-800 sticky top-0 z-10 border-b border-blue-100">
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
                  className="px-5 py-4 text-left text-sm font-bold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 mx-auto border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <p className="mt-4 text-gray-500">Loading orders...</p>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No orders found</p>
                    <p className="text-gray-400 text-sm mt-1">Start creating orders to see them here</p>
                  </div>
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
                    className="hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
                        {(page - 1) * perPage + index + 1}
                      </span>
                    </td>
                    
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                        {order.order_id}
                      </span>
                    </td>
                    
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{order.customer_name}</div>
                    </td>
                    
                    <td className="px-5 py-4">
                      <div className="text-gray-600 truncate max-w-[200px]" title={order.customer_email}>
                        {order.customer_email}
                      </div>
                    </td>

                    {/* PRODUCTS - ENHANCED DESIGN */}
                    <td className="px-5 py-4 min-w-[350px]">
                      {lineItems.length ? (
                        <div className="space-y-3">
                          {lineItems.map((item, i) => {
                            // Find leads count from meta_data
                            const leadsMeta = item.meta_data?.find(
                              (m) => {
                                const key = m.key?.toLowerCase();
                                return key === "leads" || key === "leads count" || key === "exhibitors";
                              }
                            );
                            
                            const leadsCount = leadsMeta?.display_value || 
                                              leadsMeta?.value || 
                                              item.leads || 
                                              "-";

                            return (
                              <div
                                key={i}
                                className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 text-sm mb-1">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <span className="mr-1">₹</span>
                                        {item.price}
                                      </span>
                                      <div className="flex items-center text-gray-600">
                                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        <span className="text-xs font-medium">
                                          {leadsCount} {typeof leadsCount === 'number' || !isNaN(leadsCount) ? 'Leads' : ''}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400 ml-2">
                                    Item {i + 1}
                                  </div>
                                </div>
                                
                                {item.sku && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">
                                      SKU: <span className="font-medium">{item.sku}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-3 border border-gray-200 rounded-xl bg-gray-50">
                          <span className="text-sm text-gray-400 italic">No products</span>
                        </div>
                      )}
                    </td>

                    {/* TOTAL */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-lg text-gray-900">
                        ${order.total}
                      </div>
                      {lineItems.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {order.status === "completed" && (
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          )}
                          {order.status}
                        </span>
                        {order.payment_method && (
                          <span className="text-xs text-gray-500 mt-1">
                            {order.payment_method}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{(page - 1) * perPage + 1}</span> to{" "}
              <span className="font-bold">{Math.min(page * perPage, orders.length)}</span> of{" "}
              <span className="font-bold">{orders.length}</span> orders
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select 
                value={perPage} 
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                  fetchOrders(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                page === 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              <span className="font-medium">Prev</span>
            </button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium ${
                      page === pageNum
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <span className="font-medium">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}