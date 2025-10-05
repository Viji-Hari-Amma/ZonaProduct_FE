import React, { useState } from "react";

const CategoryFilter = ({ categories, activeCategory, onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      {/* Mobile: Toggle Button */}
      <div className="sm:hidden mb-2">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between w-full px-2 py-1 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 shadow hover:border-orange-400 hover:text-orange-600 transition"
        >
          <span className="flex items-center text-[15px]">
            <svg
              className="w-5 h-5 mr-2 text-orange-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 8v6l-4 2v-8L3 6V4z" />
            </svg>
            {activeCategory === "all"
              ? "Filter by Category"
              : `Category: ${categories.find(cat => cat.id === parseInt(activeCategory))?.name || 'Selected'}`}
          </span>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Desktop: Inline Buttons */}
      <div className="hidden sm:flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
            activeCategory === "all"
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-200"
              : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
          }`}
          onClick={() => onSelectCategory("all")}
        >
          All Products
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              activeCategory === category.id.toString()
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-200"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            }`}
            onClick={() => onSelectCategory(category.id.toString())}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Mobile: Slide-in Drawer */}
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          onClick={() => setIsOpen(false)}
        ></div>

        <div
          className={`relative w-72 max-w-[80%] bg-white h-[80vh] mt-[7.4vh] shadow-xl p-6 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Select Category
          </h2>

          <div className="flex flex-col space-y-3">
            <button
              className={`px-4 py-2 rounded-lg text-left font-medium transition ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50"
              }`}
              onClick={() => {
                onSelectCategory("all");
                setIsOpen(false);
              }}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-left font-medium transition ${
                  activeCategory === category.id.toString()
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-50"
                }`}
                onClick={() => {
                  onSelectCategory(category.id.toString());
                  setIsOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
