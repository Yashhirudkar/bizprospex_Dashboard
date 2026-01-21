export default function Pagination({ pagination, handlePageChange }) {
  if (pagination.totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
    .filter(page =>
      page === 1 ||
      page === pagination.totalPages ||
      Math.abs(page - pagination.page) <= 1
    );

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
          <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
          <span className="font-medium">{pagination.total}</span> categories
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-3 py-1 rounded-lg ${pagination.page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border text-gray-500 hover:bg-gray-50"}`}
          >
            Previous
          </button>

          {pageNumbers.map((page, index, array) => (
            <div key={page} className="flex items-center">
              {index > 0 && page > array[index - 1] + 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg ${page === pagination.page ? "bg-blue-600 text-white" : "bg-white border hover:bg-gray-50"}`}
              >
                {page}
              </button>
            </div>
          ))}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-3 py-1 rounded-lg ${pagination.page === pagination.totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border text-gray-500 hover:bg-gray-50"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}