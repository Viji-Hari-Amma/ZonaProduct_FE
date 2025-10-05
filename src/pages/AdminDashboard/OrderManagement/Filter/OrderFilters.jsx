// components/OrderFilters.jsx
import React, { useState, useEffect } from 'react';
import { FaFilter, FaSyncAlt, FaSearch, FaCalendarAlt, FaTimes } from 'react-icons/fa';

const OrderFilters = ({ filters, onFilterChange, onClearFilters, onRefresh }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...localFilters,
      [key]: value
    };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const resetFilters = {
      status: '',
      search: '',
      user_email: '',
      created_after: '',
      created_before: ''
    };
    setLocalFilters(resetFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return Object.values(localFilters).some(value => value !== '' && value !== null && value !== undefined);
  };

  return (
    <div className="bg-orange-100 rounded-xl p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Basic Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-amber-900 font-medium text-sm">Status:</label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Search Filter */}
          <div className="flex items-center gap-2">
            <label className="text-amber-900 font-medium text-sm">Search:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Order ID, Customer, Product..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm min-w-[250px]"
              />
              <FaSearch className="absolute left-3 top-3 text-orange-400 text-sm" />
            </div>
          </div>

          {/* Email Filter */}
          <div className="flex items-center gap-2">
            <label className="text-amber-900 font-medium text-sm">Name:</label>
            <input
              type="text"
              placeholder="Filter by name..."
              value={localFilters.user_email || ''}
              onChange={(e) => handleFilterChange('user_email', e.target.value)}
              className="px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm min-w-[200px]"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            <FaFilter />
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="flex flex-wrap items-center gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <label className="text-amber-900 font-medium text-sm">From:</label>
              <div className="relative">
                <input
                  type="date"
                  value={localFilters.created_after || ''}
                  onChange={(e) => handleFilterChange('created_after', e.target.value)}
                  className="pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <FaCalendarAlt className="absolute left-3 top-3 text-orange-400 text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-amber-900 font-medium text-sm">To:</label>
              <div className="relative">
                <input
                  type="date"
                  value={localFilters.created_before || ''}
                  onChange={(e) => handleFilterChange('created_before', e.target.value)}
                  className="pl-10 pr-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <FaCalendarAlt className="absolute left-3 top-3 text-orange-400 text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-amber-700">
            {hasActiveFilters() && (
              <span className="flex items-center gap-1">
                <FaFilter className="text-orange-500" />
                Filters active
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {hasActiveFilters() && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors text-sm"
              >
                <FaTimes />
                Clear Filters
              </button>
            )}
            
            <button
              onClick={applyFilters}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              <FaFilter />
              Apply Filters
            </button>

            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;