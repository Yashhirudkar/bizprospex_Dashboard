"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { apiUrl } from "../../../constant/api.js";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // filters
  const [formType, setFormType] = useState("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [formTypes, setFormTypes] = useState([]);

  const hasFilters = search || formType || fromDate || toDate;

  const clearFilters = () => {
    setSearch("");
    setFormType("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(formType && { form_type: formType }),
        ...(search && { search }),
        ...(fromDate && { from_date: fromDate }),
        ...(toDate && { to_date: toDate }),
      });

      const res = await fetch(
        `${apiUrl}/v1/get-contact?${params}`
      );

      const data = await res.json();
      const contactsData = data.data || [];

      setContacts(contactsData);
      setTotalPages(data.pagination?.totalPages || 1);

      const formTypeMap = {};
      contactsData.forEach((item) => {
        if (!item.form_type) return;
        formTypeMap[item.form_type] =
          (formTypeMap[item.form_type] || 0) + 1;
      });

      const uniqueFormTypes = Object.keys(formTypeMap).map((key) => ({
        value: key,
        count: formTypeMap[key],
      }));

      setFormTypes(uniqueFormTypes);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, formType, search, fromDate, toDate]);

  /* DELETE CONTACT */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const res = await fetch(
        `${apiUrl}/v1/delete-contact/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (data.success) fetchContacts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Contact Submissions
        </h1>
        <p className="text-gray-600">
          Manage and filter all contact form submissions
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-15 gap-4 items-end">
          {/* Search */}
          <div className="md:col-span-4 w-[400px]">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Contacts
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="w-full text-gray-600 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none hover:border-blue-400"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Form Type */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Form Type
              </div>
            </label>
            <select
              value={formType}
              onChange={(e) => {
                setPage(1);
                setFormType(e.target.value);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 focus:outline-none hover:border-blue-400"
            >
              <option value="">All Form Types</option>
              {formTypes.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.value.replace("-", " ")} ({f.count})
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </div>
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setPage(1);
                  setFromDate(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setPage(1);
                  setToDate(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>
          </div>

          {/* Clear */}
          <button
            onClick={clearFilters}
            disabled={!hasFilters}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm border
              ${
                hasFilters
                  ? "border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Filter className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Message</th>
              <th className="py-4 px-6 text-left">Form Type</th>
              <th className="py-4 px-6 text-left">Created</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 text-gray-700">
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">{c.user_name || "-"}</td>
                <td className="py-4 px-6">{c.email}</td>
                <td className="py-4 px-6 line-clamp-2">
                  {c.message || "-"}
                </td>
                <td className="py-4 px-6">
                  {c.form_type?.replace("-", " ") || "-"}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 rounded-md text-red-500 hover:bg-red-100"
                    title="Delete contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {contacts.length === 0 && (
              <tr>
                <td colSpan="6" className="py-10 text-center text-gray-500">
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow border">
          <span className="text-sm text-gray-600">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
