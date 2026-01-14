"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { apiUrl } from "../../constant/api";

const SIDEBAR_WIDTH = 220;

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  /* ✅ Mark mounted (prevents hydration mismatch) */
  useEffect(() => {
    setMounted(true);
  }, []);

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
      await fetch(`${apiUrl}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.push("/login");
    }
  };

  /* 🚫 Avoid server/client mismatch */
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} handleLogout={handleLogout} />

      {/* MAIN AREA */}
      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{
          marginLeft: open ? `${SIDEBAR_WIDTH}px` : "0px",
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
