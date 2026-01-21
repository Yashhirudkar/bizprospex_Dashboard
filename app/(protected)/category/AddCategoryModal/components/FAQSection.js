import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function FAQSection({ faqs, onAdd, onRemove, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">FAQ Items</label>
        <button type="button" onClick={onAdd} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
          <FaPlus size={12} /> Add FAQ
        </button>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">FAQ {index + 1}</span>
              {faqs.length > 1 && (
                <button type="button" onClick={() => onRemove(index)} className="text-red-600">
                  <FaTrash size={14} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => onChange(index, "question", e.target.value)}
                placeholder="Question"
                className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md outline-none"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => onChange(index, "answer", e.target.value)}
                placeholder="Answer"
                rows={2}
                className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-md outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}