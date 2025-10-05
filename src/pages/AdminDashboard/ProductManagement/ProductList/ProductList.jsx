import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaStar,
  FaSearch,
  FaSync,
  FaBox,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllCategoryNames } from "../../../../services/productApi/productApi";

const ProductList = ({
  products,
  loading,
  onEdit,
  onView,
  onDelete,
  onRefresh,
  pagination,
  onPageChange,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // NEW: Apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 500); // Debounce to avoid too many API calls

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter, statusFilter, featuredFilter]);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await getAllCategoryNames();

      // Handle different possible response structures
      let categoriesData = [];

      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && Array.isArray(response.data.results)) {
        categoriesData = response.data.results;
      } else if (response.data && Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      } else {
        console.warn("Unexpected categories response structure:", response);
        categoriesData = [];
      }

      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // NEW: Apply filters to backend
  const applyFilters = () => {
    if (onFilterChange) {
      const filters = {
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        is_active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : undefined,
        is_featured:
          featuredFilter === "featured"
            ? true
            : featuredFilter === "not-featured"
            ? false
            : undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach((key) => {
        if (filters[key] === undefined) {
          delete filters[key];
        }
      });

      onFilterChange(filters);
    }
  };

  const getStatusBadge = (product) => {
    if (!product.is_active) {
      return (
        <span className="px-2 py-1 bg-red-300 text-gray-800 text-xs rounded-full">
          Inactive
        </span>
      );
    }
    if (!product.availability_status) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          Out of Stock
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        Active
      </span>
    );
  };

  const getStockBadge = (stockCount) => {
    if (stockCount === 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          Out of Stock
        </span>
      );
    }
    if (stockCount < 10) {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          Low Stock
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        In Stock
      </span>
    );
  };

  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleFilterReset = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setFeaturedFilter("");
    // Filters will be automatically applied via useEffect
  };

  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.current - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(pagination.current - 1)}
        disabled={pagination.current === 1}
        className="px-3 py-1 border border-orange-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 flex items-center"
      >
        <FaChevronLeft className="mr-1" />
        Previous
      </button>
    );

    // First page
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 border border-orange-200 rounded-lg text-sm hover:bg-orange-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 border border-orange-200 rounded-lg text-sm ${
            pagination.current === page
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-orange-50"
          }`}
        >
          {page}
        </button>
      );
    }

    // Last page
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 py-1 text-gray-500">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="px-3 py-1 border border-orange-200 rounded-lg text-sm hover:bg-orange-50"
        >
          {pagination.totalPages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(pagination.current + 1)}
        disabled={pagination.current === pagination.totalPages}
        className="px-3 py-1 border border-orange-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 flex items-center"
      >
        Next
        <FaChevronRight className="ml-1" />
      </button>
    );

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-orange-100">
      {/* Filters */}
      <div className="p-4 border-b border-orange-100 bg-orange-50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              disabled={categoriesLoading}
              className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}{" "}
                    {category.product_count
                      ? `(${category.product_count})`
                      : ""}
                  </option>
                ))}
            </select>
            {categoriesLoading && (
              <div className="text-xs text-gray-500 mt-1">
                Loading categories...
              </div>
            )}
          </div>

          {/* Featured Filter */}
          <div>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Products</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-3">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm("")}
                className="ml-2 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Category:{" "}
              {categories.find((c) => c.id === categoryFilter)?.name ||
                categoryFilter}
              <button
                onClick={() => setCategoryFilter("")}
                className="ml-2 hover:text-red-900"
              >
                ×
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {statusFilter}
              <button
                onClick={() => setStatusFilter("")}
                className="ml-2 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {featuredFilter && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {featuredFilter === "featured" ? "Featured" : "Not Featured"}
              <button
                onClick={() => setFeaturedFilter("")}
                className="ml-2 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          {(searchTerm || categoryFilter || statusFilter || featuredFilter) && (
            <button
              onClick={handleFilterReset}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters or add a new product
            </p>
          </div>
        ) : (
          <div
            className="grid gap-3 p-3"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              display: "grid",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border min-w-[280px] border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Product Image */}
                <div className="h-56 bg-gray-100 relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={
                        product.images.find((img) => img.is_primary)
                          ?.image_url || product.images[0].image_url
                      }
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <FaBox className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {product.is_featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <FaStar className="mr-1" />
                        Featured
                      </span>
                    )}
                    {getStatusBadge(product)}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      {product.category_name}
                    </span>
                    {getStockBadge(product.stock_count)}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      Flavour: {product.flavour || "N/A"}
                    </span>
                    <span className="text-sm font-medium text-orange-600">
                      ₹{product.base_price}
                    </span>
                  </div>
                  {/* Reviews & Discounts */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span>Reviews: {product.reviews_count || 0}</span>
                      {product.average_rating && (
                        <span className="ml-2 flex items-center">
                          ★ {product.average_rating}
                        </span>
                      )}
                    </div>
                    {product.discounts_count > 0 && (
                      <span className="text-green-600 font-medium">
                        {product.discounts_count} discount(s)
                      </span>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(product)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <FaEye className="mr-2" />
                      View
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary and Pagination */}
      <div className="px-6 py-4 border-t border-orange-100 bg-orange-50">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {pagination ? (
              <>
                Showing {(pagination.current - 1) * pagination.pageSize + 1} to{" "}
                {Math.min(
                  pagination.current * pagination.pageSize,
                  pagination.total
                )}{" "}
                of {pagination.total} products
              </>
            ) : (
              <>Showing {products.length} products</>
            )}
          </p>
          <button
            onClick={onRefresh}
            className="flex items-center text-sm text-orange-600 hover:text-orange-700"
          >
            <FaSync className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">{renderPaginationButtons()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
