import { FaEllipsisV, FaEdit, FaTrash, FaSearch, FaUpload } from "react-icons/fa";

export default function ActionMenu({ 
  cat, 
  isOpen, 
  setOpenMenu, 
  seoStatus, 
  onEdit, 
  onSeo, 
  onUpload, 
  onDelete 
}) {
  const hasSeoIssues = seoStatus && (!seoStatus.seo_title || !seoStatus.seo_description || !seoStatus.slug);

  return (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
      <button
        onClick={() => setOpenMenu(isOpen ? null : cat.category_id)}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-blue-200 hover:bg-blue-200 cursor-pointer transition">
          <FaEllipsisV className="h-4 w-4 text-gray-600" />
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
          <div className="absolute right-18 top-3 bg-white rounded-xl shadow-lg border border-blue-200 z-30 px-4 py-3 mr-[32px]">
            <div className="flex items-center gap-4">
              {/* EDIT */}
              <MenuButton label="Edit" icon={<FaEdit size={16} />} color="blue" onClick={onEdit} />

              {/* SEO */}
              <div className="relative group">
                <MenuButton label="SEO" icon={<FaSearch size={16} />} color="green" onClick={onSeo} />
                {hasSeoIssues && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
                )}
              </div>

              {/* UPLOAD SAMPLE */}
              <MenuButton label="Upload Sample" icon={<FaUpload size={16} />} color="purple" onClick={onUpload} />

              {/* DELETE */}
              <MenuButton label="Delete" icon={<FaTrash size={16} />} color="red" onClick={onDelete} />
            </div>
          </div>
        </>
      )}
    </td>
  );
}

function MenuButton({ label, icon, color, onClick }) {
  const themes = {
    blue: "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 border-green-200 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100",
    red: "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-10 h-10 flex items-center justify-center rounded-full border transition hover:scale-110 ${themes[color]}`}
      >
        {icon}
      </button>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
        {label}
      </span>
    </div>
  );
}