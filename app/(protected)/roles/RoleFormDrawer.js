"use client";
import React from "react";
import {
  FaTimes,
  FaUser,
  FaUserShield,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

export default function RoleFormDrawer({
  drawerOpen,
  handleDrawerClose,
  editingAdmin,
  email,
  setEmail,
  role,
  setRole,
  loading,
  handleSubmit,
}) {
  const roleOptions = [
    { value: "user", label: "User", icon: <FaUser /> },
    { value: "admin", label: "Admin", icon: <FaUserShield /> },
    {
      value: "admin,user",
      label: "Admin + User (Both)",
      icon: <FaUsers />,
    },
  ];

  return (
    <>
      {/* OVERLAY */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={handleDrawerClose}
        />
      )}

      {/* DRAWER */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[400px] bg-white shadow-xl transform transition-transform duration-300
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="relative px-6 pt-10 pb-6 border-b">
          <button
            onClick={handleDrawerClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes />
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-600">
            {editingAdmin ? "Edit Role" : "Assign Role"}
          </h2>

          <div className="w-20 h-1 bg-blue-600 mx-auto mt-2 rounded" />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 flex flex-col gap-4"
        >
          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">
              User Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled={Boolean(editingAdmin)}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 text-gray-600"
              />
              {email && (
                <FaCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
            >
              <option value="">Choose role</option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleDrawerClose}
              disabled={loading}
              className="w-full border text-gray-600 rounded-lg py-2 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading
                ? "Processing..."
                : editingAdmin
                ? "Update Role"
                : "Assign Role"}
            </button>
          </div>

          {/* INFO */}
          {editingAdmin && (
            <div className="mt-4 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded">
              Updating role for <strong>{editingAdmin.email}</strong>
            </div>
          )}
        </form>
      </aside>
    </>
  );
}
