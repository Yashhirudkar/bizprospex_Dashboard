"use client";

import GridMenu from "./GridMenu";

export default function Topbar({ handleLogout }) {
  return (
    <header className="fixed top-0 left-0 w-full h-[65px]
                       bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            src="/main-logo.png"
            alt="Biz Logo"
            className="h-8 sm:h-10 object-contain"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Grid Menu */}
          <GridMenu />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="border border-gray-400 text-gray-600
                       px-3 sm:px-4 py-1.5 sm:py-2
                       rounded-md text-sm font-medium
                       hover:bg-gray-100 hover:text-gray-900
                       transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
