import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

export default function CategoryFilters({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  statusFilter,
  handleStatusFilter,
  clearFilters,
  handleSearch,
  pagination
}) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Box */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    // Trigger fetch with cleared search
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Filter Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition"
          >
            <FaFilter /> Filters
          </button>
          {(searchTerm || statusFilter !== "all" || showFilters) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition"
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Additional Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex gap-2">
                {["all", "active", "inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm ${statusFilter === status
                        ? status === "active"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : status === "inactive"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    {status === "all" ? "All" : status === "active" ? "Active" : "Inactive"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
