"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faDownload,
  faBriefcase,
  faDatabase,
  faList,
  faShoppingCart,
  faBookmark,
  faKey,
  faChartLine,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

export default function GridMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="relative">
      {/* GRIP BUTTON */}
      <button
        aria-label="Apps Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-center w-10 h-10 rounded-full
                   bg-gray-100 text-gray-600
                   hover:bg-gray-200 hover:text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FontAwesomeIcon icon={faGrip} size="lg" />
      </button>

      {/* POPUP */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-3 w-80 bg-white
                     rounded-2xl shadow-xl border p-4 z-50"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <MenuItem
              title="Download Sample"
              icon={faDownload}
              active={pathname === "/GridMenu/download-sample"}
              onClick={() => handleNavigate("/GridMenu/download-sample")}
            />

            <MenuItem
              title="Contact Lists"
              icon={faBriefcase}
              active={pathname === "/GridMenu/contacts"}
              onClick={() => handleNavigate("/GridMenu/contacts")}
            />

            <MenuItem title="Dataset Assignments" icon={faDatabase} />
            <MenuItem title="20% Exhibitors list" icon={faList} />
            <MenuItem title="Orders list" icon={faShoppingCart} />
            <MenuItem title="Bookmark" icon={faBookmark} />
            <MenuItem title="API Key Model" icon={faKey} />
            <MenuItem title="UTM Records" icon={faChartLine} />
            <MenuItem title="Help" icon={faCircleQuestion} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ title, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex flex-col items-center gap-2
        ${active ? "text-blue-600" : "text-gray-700"}
        hover:text-blue-600 focus:outline-none`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center
          ${
            active
              ? "bg-blue-50 text-blue-600"
              : "bg-gray-100 text-gray-600"
          }
          hover:bg-blue-50`}
      >
        <FontAwesomeIcon icon={icon} size="sm" />
      </div>

      <span className="text-xs font-medium text-center">
        {title}
      </span>
    </button>
  );
}
