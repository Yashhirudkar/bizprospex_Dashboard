import React from "react";
import { FaTrash } from "react-icons/fa";

export default function SectionItem({ item, index, schema, onUpdate, onRemove }) {
  return (
    <div className="p-3 border rounded bg-gray-50 relative group">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
      >
        <FaTrash size={12} />
      </button>

      <div className="grid grid-cols-1 gap-2 mt-2">
        {schema.itemFields.map((field) => (
          <div key={field}>
            <label className="text-[10px] uppercase text-gray-400 font-bold">
              {field.replace("_", " ")}
            </label>
            {["description", "quote", "detail", "short_desc"].includes(field) ? (
              <textarea
                value={item[field] || ""}
                onChange={(e) => onUpdate(index, field, e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded text-gray-600 focus:ring-1 focus:ring-blue-400 outline-none"
                rows={2}
              />
            ) : (
              <input
                type="text"
                value={item[field] || ""}
                onChange={(e) => onUpdate(index, field, e.target.value)}
                className="w-full px-2 py-1 text-sm border rounded text-gray-600 focus:ring-1 focus:ring-blue-400 outline-none"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}