"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../constant/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SIDEBAR_WIDTH = 220;

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // 📱 Responsive sidebar logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setOpen(false);
      else setOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔒 Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${apiUrl}/admin/check-auth`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!data.loggedIn) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      } catch (err) {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ⏳ Loading screen
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} handleLogout={handleLogout} />

      {/* MAIN AREA */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300`}
        style={{
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 768 && open
              ? `${SIDEBAR_WIDTH}px`
              : "0px",
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
