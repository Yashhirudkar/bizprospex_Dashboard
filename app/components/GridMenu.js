"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faDownload,
  faList,
  faBriefcase,
  faDatabase,
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <div className="relative">
      <button
        aria-label="Apps Menu"
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <FontAwesomeIcon icon={faGrip} />
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border p-4 z-50"
        >
          <div className="grid grid-cols-3 gap-6 text-center">

            <MenuItem
              title="Product Downloads"
              icon={faDownload}
              active={pathname.startsWith("/GridMenu/product-sample")}
              onClick={() => handleNavigate("/GridMenu/product-sample")}
            />

            <MenuItem
              title="Category Downloads"
              icon={faList}
              active={pathname.startsWith("/GridMenu/category-sample")}
              onClick={() => handleNavigate("/GridMenu/category-sample")}
            />

            <MenuItem
              title="Contact Lists"
              icon={faBriefcase}
              active={pathname.startsWith("/GridMenu/contacts")}
              onClick={() => handleNavigate("/GridMenu/contacts")}
            />

            <MenuItem title="Dataset Assignments" icon={faDatabase} />
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
      className={`flex flex-col items-center gap-2 ${
        active ? "text-blue-600" : "text-gray-700"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          active ? "bg-blue-50" : "bg-gray-100"
        }`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="text-xs font-medium">{title}</span>
    </button>
  );
}
