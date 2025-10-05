import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full lg:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-[#9CA3AF]" />
      </div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-10 py-3 bg-white border border-[#FDBA74] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all duration-300"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#F97316] focus:outline-none"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
