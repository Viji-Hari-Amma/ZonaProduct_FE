import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-2 px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        <FiChevronLeft size={16} />
        Previous
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[#7C2D12] font-medium">
          Page {page} of {totalPages}
        </span>
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-2 px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        Next
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
