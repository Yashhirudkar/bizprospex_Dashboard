import { FaPlus, FaTrash } from "react-icons/fa";

export default function StatsAndFaqFields({ formData, handleStatsChange, addStatsItem, removeStatsItem, handleFaqChange, addFaqItem, removeFaqItem }) {
  return (
    <>
      {/* STATS ITEMS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Stats Items</label>
          <button type="button" onClick={addStatsItem} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            <FaPlus size={12} /> Add Stat
          </button>
        </div>
        <div className="space-y-2">
          {formData.stats_items.map((stat, index) => (
            <div key={index} className="flex gap-2 items-end">
              <input
                type="text"
                value={stat.title}
                onChange={(e) => handleStatsChange(index, "title", e.target.value)}
                placeholder="Stat title"
                className="flex-1 text-gray-600 px-3 py-2 border border-gray-300 rounded-md outline-none"
              />
              <input
                type="text"
                value={stat.value}
                onChange={(e) => handleStatsChange(index, "value", e.target.value)}
                placeholder="e.g. 20k, 5M, 150+"
                className="w-28 px-3 py-2 text-gray-600 border border-gray-300 rounded-md outline-none"
              />
              {formData.stats_items.length > 1 && (
                <button type="button" onClick={() => removeStatsItem(index)} className="text-red-600 p-2">
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ ITEMS */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">FAQ Items</label>
          <button type="button" onClick={addFaqItem} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            <FaPlus size={12} /> Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {formData.faq_items.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500">FAQ {index + 1}</span>
                {formData.faq_items.length > 1 && (
                  <button type="button" onClick={() => removeFaqItem(index)} className="text-red-600">
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                  placeholder="Question"
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-md outline-none"
                />
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                  placeholder="Answer"
                  rows={2}
                  className="w-full px-3 text-gray-600 py-2 border border-gray-300 rounded-md outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}