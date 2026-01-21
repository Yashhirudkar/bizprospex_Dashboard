"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { apiUrl } from "../../constant/api";

const SIDEBAR_WIDTH = 220;

// Ensure cookies are handled for every request in this layout
axios.defaults.withCredentials = true;

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * 🛡️ AUTH GUARD
   * This is the "Firewall". It prevents the dashboard from rendering
   * until the backend verifies the 'adminToken' cookie.
   */
  useEffect(() => {
    let isSubscribed = true;

    const verifyAuth = async () => {
      try {
        // We call the backend. If the cookie is missing/expired, 
        // the backend middleware will throw a 401 error.
        const res = await axios.get(`${apiUrl}/admin/check-auth`);

        if (isSubscribed) {
          if (res.data && res.data.loggedIn) {
            setMounted(true);
            setLoading(false);
          } else {
            // LoggedIn is false, force redirect
            handleRedirect();
          }
        }
      } catch (err) {
        // Catch block triggers on 401 Unauthorized
        if (isSubscribed) {
          console.warn("Session expired or invalid. Redirecting to login...");
          handleRedirect();
        }
      }
    };

    const handleRedirect = () => {
      setMounted(false);
      setLoading(false);
      // Use replace so they can't go "Back" to the protected page
      router.replace("/login");
    };

    verifyAuth();

    return () => { isSubscribed = false; };
  }, [router, pathname]);

  /**
   * 📱 RESPONSIVE SIDEBAR
   */
  useEffect(() => {
    if (!mounted) return;

    const handleResize = () => {
      if (window.innerWidth < 1024) setOpen(false);
      else setOpen(true);
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
      localStorage.removeItem("downloadToken");
      router.replace("/login");
    }
  };

  /**
   * ⏳ LOADING SCREEN
   * While loading is true, the Dashboard HTML is NOT rendered.
   */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Verifying Session...</p>
      </div>
    );
  }

  // 🛡️ HARD GUARD: If session check finished but not authorized, render nothing
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={open} setOpen={setOpen} handleLogout={handleLogout} />

      <div
        className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: open && typeof window !== "undefined" && window.innerWidth >= 640 
            ? `${SIDEBAR_WIDTH}px` 
            : "0px",
        }}
      >
        <Topbar handleLogout={handleLogout} />
        <div className="h-[65px]" />
        
        <main className="p-4 md:p-6 min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
}