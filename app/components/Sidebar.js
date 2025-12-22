"use client";
import { useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaUpload,
  FaUsers,
  FaBoxes,
  FaUserShield,
} from "react-icons/fa";

export default function Sidebar({ open, setOpen }) {
  // auto close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setOpen(false);
      else setOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed top-[60px] left-3 z-50 sm:hidden text-black"
      >
        <FaBars size={20} />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-[65px] left-0 z-40 h-[calc(100vh-65px)]
          bg-white border-r border-gray-200 transition-all duration-300
          ${open ? "w-[220px]" : "w-[70px]"}
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
          {open && (
            <span className="text-sm font-bold text-indigo-900">
              Admin Dashboard
            </span>
          )}
          <button onClick={() => setOpen((p) => !p)}>
            <FaBars />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col text-gray-600">
          <SidebarItem
            href="/upload-data"
            icon={<FaUpload />}
            label="Upload Data"
            open={open}
          />
          <SidebarItem
            href="/category"
            icon={<FaUsers />}
            label="Category"
            open={open}
          />
          <SidebarItem
            href="/orders"
            icon={<FaBoxes />}
            label="Orders"
            open={open}
          />
          <SidebarItem
            href="/roles"
            icon={<FaUserShield />}
            label="Admin Roles"
            open={open}
          />
        </nav>
      </aside>
    </>
  );
}

/* REUSABLE ITEM */
function SidebarItem({ href, icon, label, open }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 text-sm hover:bg-gray-100 border-b border-gray-200"
    >
      <span className="text-lg">{icon}</span>
      {open && <span>{label}</span>}
    </Link>
  );
}
