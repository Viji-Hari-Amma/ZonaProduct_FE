import React from "react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

const ReviewFilters = ({ filters, setFilters, onClearFilters }) => {
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters =
    filters.search ||
    filters.is_approved !== "all" ||
    filters.rating ||
    filters.user_email;

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 mb-6 shadow-[0_6px_16px_rgba(220,38,38,0.15)] border border-[#FED7AA]">
      <div className="flex items-center gap-2 mb-4">
        <FiFilter className="text-[#F97316]" />
        <h3 className="text-lg font-semibold text-[#7C2D12]">Filters</h3>
        {hasActiveFilters && (
          <span className="bg-[#F97316] text-white text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-[#7C2D12] mb-2">
            Search
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-[#7C2D12] mb-2">
            Status
          </label>
          <select
            value={filters.is_approved}
            onChange={(e) => handleFilterChange("is_approved", e.target.value)}
            className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-[#7C2D12] mb-2">
            Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange("rating", e.target.value)}
            className="w-full px-4 py-3 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 border border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFEDE9] transition-all duration-200 hover:scale-105"
          >
            <FiX size={16} />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewFilters;
