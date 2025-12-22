"use client";
import React from "react";

export default function DashboardPage() {
  return (
    <div>
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold mb-6">
        Welcome to your Dashboard
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STATS CARD */}
        <div className="bg-white rounded-lg border p-5">
          <h2 className="text-lg font-semibold mb-3">Stats</h2>
          <p className="text-gray-700">Total Users: 120</p>
          <p className="text-gray-700">Active Subscriptions: 45</p>
        </div>

        {/* ACTIVITY CARD */}
        <div className="bg-white rounded-lg border p-5">
          <h2 className="text-lg font-semibold mb-3">
            Recent Activity
          </h2>
          <p className="text-gray-700">• User John registered</p>
          <p className="text-gray-700">• Payment received from Jane</p>
        </div>
      </div>
    </div>
  );
}
