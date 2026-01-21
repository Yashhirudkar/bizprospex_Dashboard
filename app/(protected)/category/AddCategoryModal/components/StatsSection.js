import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function StatsSection({ stats, onAdd, onRemove, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">Stats Items</label>
        <button type="button" onClick={onAdd} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
          <FaPlus size={12} /> Add Stat
        </button>
      </div>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex gap-2 items-end">
            <input
              type="text"
              value={stat.title}
              onChange={(e) => onChange(index, "title", e.target.value)}
              placeholder="Stat title"
              className="flex-1 text-gray-600 px-3 py-2 border border-gray-300 rounded-md outline-none"
            />
            <input
              type="text"
              value={stat.value}
              onChange={(e) => onChange(index, "value", e.target.value)}
              placeholder="e.g. 20k, 150+"
              className="w-28 px-3 py-2 text-gray-600 border border-gray-300 rounded-md outline-none"
            />
            {stats.length > 1 && (
              <button type="button" onClick={() => onRemove(index)} className="text-red-600 p-2">
                <FaTrash size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}