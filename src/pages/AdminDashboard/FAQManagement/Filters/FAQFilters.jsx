// components/admin/faq/FAQFilters.jsx
import React from 'react';
import { FaSearch, FaSync } from 'react-icons/fa';

const FAQFilters = ({ filters, setFilters, onRefresh }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      faq_type: '',
      product_id: '',
      is_active: '',
      search: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#7C2D12] mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Search questions and answers..."
              className="w-full pl-10 pr-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </div>

        {/* FAQ Type */}
        <div>
          <label className="block text-sm font-medium text-[#7C2D12] mb-2">
            FAQ Type
          </label>
          <select
            value={filters.faq_type}
            onChange={(e) => handleChange('faq_type', e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="common">Common</option>
            <option value="product">Product</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-[#7C2D12] mb-2">
            Status
          </label>
          <select
            value={filters.is_active}
            onChange={(e) => handleChange('is_active', e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end space-x-2">
          <button
            onClick={clearFilters}
            className="flex-1 px-4 py-3 border-2 border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFF5F0] transition-colors font-medium"
          >
            Clear
          </button>
          <button
            onClick={onRefresh}
            className="p-3 bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            title="Refresh"
          >
            <FaSync />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQFilters;