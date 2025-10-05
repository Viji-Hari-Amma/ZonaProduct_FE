// Pagination.jsx
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  indexOfFirstItem,
  indexOfLastItem,
  totalCount,
}) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <p className="text-[#9A3412]">
        Showing {indexOfFirstItem} to {indexOfLastItem} of {totalCount} messages
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-[#FDBA74] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFEDE9] transition-colors"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentPage === page
                ? "bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white"
                : "border border-[#FDBA74] hover:bg-[#FFEDE9]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() =>
            onPageChange((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-[#FDBA74] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFEDE9] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;