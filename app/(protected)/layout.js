"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { apiUrl } from "../../constant/api";

const SIDEBAR_WIDTH = 220;

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  /* ✅ Verify Session & Mark mounted */
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // 🔥 Call the check-auth endpoint we created in the backend
        const res = await axios.get(`${apiUrl}/admin/check-auth`, {
          withCredentials: true,
        });

        if (res.data.loggedIn) {
          setMounted(true);
          setLoading(false);
        } else {
          throw new Error("Not logged in");
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        router.push("/login");
      }
    };

    verifyAuth();
  }, [router]);

  /* 📱 Responsive sidebar (client-only) */
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  /* 🚪 Logout */
  const handleLogout = async () => {
    try {
      // Updated to use axios for consistency and the correct backend route
      await axios.post(`${apiUrl}/admin/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear any local tokens if you have them
      localStorage.removeItem("downloadToken");
      router.push("/login");
    }
  };

  /* ⏳ Show nothing or a loader while verifying session */
  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} handleLogout={handleLogout} />

      {/* MAIN AREA */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{
          marginLeft: open ? (window.innerWidth < 640 ? "0px" : `${SIDEBAR_WIDTH}px`) : "0px",
        }}
      >
        {/* TOPBAR */}
        <Topbar handleLogout={handleLogout} />

        {/* OFFSET FOR FIXED TOPBAR */}
        <div className="h-[65px]" />

        {/* CONTENT */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}