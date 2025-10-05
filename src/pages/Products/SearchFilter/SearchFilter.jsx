import React, { useState } from "react";

const SearchFilter = ({ searchTerm, onSearch, onClear, hasActiveFilters }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm("");
    onClear();
  };

  return (
    <div className="mb-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            placeholder="Search products by name, description, or flavor..."
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          />
          {localSearchTerm && (
            <button
              type="button"
              onClick={() => setLocalSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
        >
          Search
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchFilter;