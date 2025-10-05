// Controls.jsx
import { FaSearch } from "react-icons/fa";

const Controls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  selectedContacts,
  onBulkRead,
  onBulkArchive,
  onBulkDelete,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-[#FED7AA]">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>

        {/* Sort */}
        <div className="flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          >
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="first_name">Name A-Z</option>
            <option value="-first_name">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="mt-4 p-4 bg-[#FFEDE9] rounded-lg border border-[#FECACA]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[#7C2D12] font-medium">
              {selectedContacts.length} selected
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onBulkRead(true)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark Read
              </button>
              <button
                onClick={() => onBulkRead(false)}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Mark Unread
              </button>
              <button
                onClick={onBulkArchive}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={onBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;
