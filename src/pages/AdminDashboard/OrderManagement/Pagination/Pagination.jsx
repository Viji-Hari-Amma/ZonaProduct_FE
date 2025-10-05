// components/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ pagination, onPageChange, onPageSizeChange }) => {
  const { currentPage, totalPages, totalCount, pageSize } = pagination;

  if (totalCount === 0) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-white rounded-lg shadow-sm border border-orange-100">
      {/* Page Info */}
      <div className="text-sm text-amber-900">
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} orders
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-amber-900">Show:</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          className="px-2 py-1 border border-orange-300 rounded text-sm"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span className="text-sm text-amber-900">per page</span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border ${
            currentPage === 1
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-orange-300 text-orange-600 hover:bg-orange-50'
          }`}
        >
          <FaChevronLeft />
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`px-3 py-1 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 text-sm`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-orange-400">...</span>}
          </>
        )}

        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg border text-sm ${
              page === currentPage
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent'
                : 'border-orange-300 text-orange-600 hover:bg-orange-50'
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-orange-400">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-1 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 text-sm`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border ${
            currentPage === totalPages
              ? 'border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-orange-300 text-orange-600 hover:bg-orange-50'
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;