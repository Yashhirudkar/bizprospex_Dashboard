import { FaPlus, FaTrash } from "react-icons/fa";
import { SECTION_REGISTRY } from "./SectionRegistry";

export default function DynamicSections({ 
  formData, 
  selectedSectionKey, 
  setSelectedSectionKey, 
  handleAddSection, 
  removeSection, 
  updateSection, 
  addSectionItem, 
  updateSectionItem, 
  removeSectionItem 
}) {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-bold text-gray-800">Dynamic Page Sections</label>
        <div className="flex gap-2">
          <select
            value={selectedSectionKey}
            onChange={(e) => setSelectedSectionKey(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded text-gray-600"
          >
            <option value="">+ Select section type</option>
            {Object.entries(SECTION_REGISTRY).map(([key, config]) => (
              <option key={key} value={key} disabled={!!formData.pageSections[key]}>
                {config.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
          >
            <FaPlus size={10} /> Add Section
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {Object.entries(formData.pageSections).map(([key, section]) => {
          const schema = section._config || SECTION_REGISTRY[key];
          if (!schema) return null;

          const itemsKey = schema.itemsKey;
          const items = section[itemsKey] || [];

          return (
            <div key={key} className="border rounded-lg p-4 bg-gray-50 shadow-sm relative">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <span className="text-sm font-bold text-blue-700 uppercase">{schema.label}</span>
                <button type="button" onClick={() => removeSection(key)} className="text-red-500">
                  <FaTrash size={14} />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => updateSection(key, "enabled", e.target.checked)}
                  />
                  Enabled
                </label>

                {schema.fields.includes("heading") && (
                  <input
                    placeholder="Section Main Heading"
                    value={section.heading || ""}
                    onChange={(e) => updateSection(key, "heading", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-gray-600 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                )}
                {schema.fields.includes("sub_heading") && (
                  <input
                    placeholder="Sub-heading or Intro Text"
                    value={section.sub_heading || ""}
                    onChange={(e) => updateSection(key, "sub_heading", e.target.value)}
                    className="w-full px-3 py-2 border rounded text-gray-600 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>

              <div className="bg-white p-3 rounded border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">{itemsKey} List</span>
                  <button
                    type="button"
                    onClick={() => addSectionItem(key)}
                    className="text-blue-600 text-xs flex items-center gap-1 font-bold hover:underline"
                  >
                    <FaPlus size={10} /> ADD {itemsKey.toUpperCase()}
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 relative group">
                      <button
                        type="button"
                        onClick={() => removeSectionItem(key, i)}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {schema.itemFields.map(field => (
                          <div key={field}>
                            <label className="text-[10px] uppercase text-gray-400 font-bold">{field.replace('_', ' ')}</label>
                            {['description', 'quote', 'detail', 'short_desc'].includes(field) ? (
                              <textarea
                                value={item[field] || ""}
                                onChange={(e) => updateSectionItem(key, i, field, e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded text-gray-600 focus:ring-1 focus:ring-blue-400 outline-none"
                                rows={2}
                              />
                            ) : (
                              <input
                                type="text"
                                value={item[field] || ""}
                                onChange={(e) => updateSectionItem(key, i, field, e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded text-gray-600 focus:ring-1 focus:ring-blue-400 outline-none"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}