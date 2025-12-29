"use client";

import React, { useState, useEffect } from "react";
import { FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { apiUrl } from "../../../constant/api";
import AdminTable from "./AdminTable";
import RoleFormDrawer from "./RoleFormDrawer";

export default function RolesPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  /* ---------------- FETCH ADMINS ---------------- */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const res = await fetch(`${apiUrl}/admin/admins`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setAdmins(data.admins || []);
        showToast("Admin list refreshed", "success");
      } else {
        showToast("Failed to load admins", "error");
      }
    } catch {
      showToast("Error fetching admin list", "error");
    } finally {
      setLoadingAdmins(false);
    }
  };

  /* ---------------- TOAST ---------------- */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  /* ---------------- CREATE USER IF NEEDED ---------------- */
  const createUserIfNeeded = async (email) => {
    const res = await fetch(`${apiUrl}/admin/create-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    return res.json();
  };

  /* ---------------- SUBMIT ROLE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return showToast("Email is required", "error");
    if (!role.trim()) return showToast("Role is required", "error");

    setLoading(true);

    try {
      let res = await fetch(`${apiUrl}/admin/set-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, role }),
      });

      let data = await res.json();

      // User not found → create → retry
      if (res.status === 404 && data.message === "User not found") {
        const created = await createUserIfNeeded(email);
        if (!created.success)
          return showToast(created.message || "Failed to create user", "error");

        res = await fetch(`${apiUrl}/admin/set-role`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, role }),
        });

        data = await res.json();
      }

      if (res.ok) {
        showToast(
          editingAdmin ? "Role updated successfully" : "Role assigned successfully",
          "success"
        );

        setEmail("");
        setRole("");
        setEditingAdmin(null);
        setDrawerOpen(false);
        fetchAdmins();
      } else {
        showToast(data.message || "Failed to update role", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setEmail(admin.email);
    setRole(admin.role);
    setDrawerOpen(true);
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    try {
      const res = await fetch(
        `${apiUrl}/admin/remove-admin/${adminToDelete.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        showToast("Admin removed successfully", "success");
        setAdmins((prev) =>
          prev.filter((a) => a.id !== adminToDelete.id)
        );
      } else {
        showToast("Failed to remove admin", "error");
      }
    } catch {
      showToast("Error removing admin", "error");
    } finally {
      setDeleteModal(false);
      setAdminToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-gray-600 font-bold">Admin Role Management</h1>

        <button
          onClick={() => {
            setEditingAdmin(null);
            setEmail("");
            setRole("");
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus /> Assign New Role
        </button>
      </div>

      {/* TABLE */}
      <AdminTable
        admins={admins}
        loadingAdmins={loadingAdmins}
        fetchAdmins={fetchAdmins}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
      />

      {/* DRAWER */}
      <RoleFormDrawer
        drawerOpen={drawerOpen}
        handleDrawerClose={() => setDrawerOpen(false)}
        editingAdmin={editingAdmin}
        email={email}
        setEmail={setEmail}
        role={role}
        setRole={setRole}
        loading={loading}
        handleSubmit={handleSubmit}
      />

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              Confirm Removal
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Remove admin access for{" "}
              <strong>{adminToDelete?.email}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg shadow text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
