"use client";

import React from "react";
import {
  FaSyncAlt,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

/* ROLE STYLES */
const getRoleStyles = (role) => {
  switch (role) {
    case "admin":
      return {
        color: "bg-blue-100 text-blue-700",
        icon: <FaUserShield />,
      };
    case "user":
      return {
        color: "bg-green-100 text-green-700",
        icon: <FaUser />,
      };
    case "admin,user":
      return {
        color: "bg-yellow-100 text-yellow-700",
        icon: <FaUsers />,
      };
    default:
      return {
        color: "bg-gray-100 text-gray-600",
        icon: <FaUser />,
      };
  }
};

export default function AdminTable({
  admins,
  loadingAdmins,
  fetchAdmins,
  handleEdit,
  handleDeleteClick,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <h2 className="text-lg font-semibold">Admin Users List</h2>

        <button
          onClick={fetchAdmins}
          disabled={loadingAdmins}
          className="p-2 hover:bg-blue-700 rounded transition disabled:opacity-50"
          title="Refresh list"
        >
          <FaSyncAlt />
        </button>
      </div>

      {/* LOADING */}
      {loadingAdmins ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[650px] w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {["User", "Role", "Status", "Created", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                        h === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-gray-500"
                  >
                    No admin users found. Assign a new role to get
                    started.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const role = getRoleStyles(admin.role);

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* USER */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {admin.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">
                              {admin.name ||
                                admin.email.split("@")[0]}
                            </p>
                            <p className="text-sm text-gray-500">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${role.color}`}
                        >
                          {role.icon}
                          {admin.role}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          <FaCheckCircle />
                          Active
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="px-4 py-3">
                        <p className="text-sm">
                          {new Date(
                            admin.createdAt
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            admin.createdAt
                          ).toLocaleTimeString()}
                        </p>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-blue-50 text-blue-600 transition mr-2"
                          title="Edit role"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDeleteClick(admin)}
                          disabled={admin.role === "superadmin"}
                          className={`inline-flex items-center justify-center p-2 rounded transition ${
                            admin.role === "superadmin"
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-red-50 text-red-600"
                          }`}
                          title="Remove admin"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
