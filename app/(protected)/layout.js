"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { apiUrl } from "../../constant/api";

const SIDEBAR_WIDTH = 220;

// Force axios to send cookies for all requests in this file
axios.defaults.withCredentials = true;

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * 🛡️ AUTH GUARD
   * This runs immediately on load to check the 'adminToken' cookie
   */
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await axios.get(`${apiUrl}/admin/check-auth`);

        if (res.data.loggedIn) {
          // Only if backend confirms loggedIn: true do we show the app
          setMounted(true);
          setLoading(false);
        } else {
          // If loggedIn is false (but request succeeded), redirect
          router.replace("/login");
        }
      } catch (err) {
        // If 401 Unauthorized or any server error, clear data and redirect
        console.error("Session verification failed, redirecting to login.");
        setMounted(false);
        router.replace("/login");
      }
    };

    verifyAuth();
  }, [router]);

  /**
   * 📱 RESPONSIVE SIDEBAR
   */
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  /**
   * 🚪 LOGOUT
   */
  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/admin/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always redirect and clear local state
      localStorage.removeItem("downloadToken");
      router.push("/login");
    }
  };

  /**
   * ⏳ LOADING SCREEN
   * Prevents "Direct Entry" - nothing is rendered until backend confirms session
   */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Verifying Session...</p>
      </div>
    );
  }

  // Final safety check: if not mounted (not auth'd), don't render dashboard
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} handleLogout={handleLogout} />

      {/* MAIN AREA */}
      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: open && typeof window !== "undefined" && window.innerWidth >= 640 
            ? `${SIDEBAR_WIDTH}px` 
            : "0px",
        }}
      >
        {/* TOPBAR */}
        <Topbar handleLogout={handleLogout} />

        {/* OFFSET FOR FIXED TOPBAR */}
        <div className="h-[65px]" />

        {/* CONTENT */}
        <main className="p-4 md:p-6 min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
}