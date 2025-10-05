import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../../hooks/useCart";
import {
  listProducts,
  getAllCategories,
} from "../../services/productApi/productApi";
import Breadcrumb from "../../components/SubHeader/Breadcrumb";
import CategoryFilter from "./CategoryFilter/CategoryFilter";
import ProductsGrid from "./ProductsGrid/ProductsGrid";
import Pagination from "./Pagination/Pagination";
import SearchFilter from "./SearchFilter/SearchFilter";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { quickAddToCart, cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Read query parameters from URL - FIXED VERSION
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    const searchParam = params.get("search");
    const pageParam = params.get("page");

    // Only update state if parameters actually exist in URL
    if (categoryParam && categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
    // Don't reset to "all" if no category param - maintain current state

    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    } else if (!searchParam && searchTerm) {
      setSearchTerm(""); // Clear search only if param is removed
    }

    if (pageParam) {
      const page = parseInt(pageParam);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    } else if (currentPage !== 1) {
      setCurrentPage(1); // Reset to page 1 only if no page param and not already on page 1
    }
  }, [location.search]); // Remove other dependencies to prevent loops

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with filters and pagination - FIXED VERSION
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
      };

      // Add category filter if not "all"
      if (activeCategory !== "all") {
        params.category = activeCategory;
      }

      // Add search term if exists
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await listProducts(params);
      let productsData = response.data.results || [];
      productsData = productsData.filter((product) => product.is_active);
      setProducts(productsData);
      setTotalCount(response.data.count);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchTerm, currentPage, itemsPerPage]);

  // Fetch products when filters or pagination changes - FIXED VERSION
  useEffect(() => {
    // Use a small timeout to ensure URL parameters are processed first
    const timer = setTimeout(() => {
      fetchProducts();
    }, 10);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes

    // Update URL
    const params = new URLSearchParams();
    if (categoryId !== "all") {
      params.set("category", categoryId);
    }
    if (searchTerm) {
      params.set("search", searchTerm);
    }

    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ""}`, {
      replace: true, // Use replace to avoid adding to history stack
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when search changes

    // Update URL
    const params = new URLSearchParams();
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (term) {
      params.set("search", term);
    }

    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ""}`, {
      replace: true,
    });
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setSearchTerm("");
    setCurrentPage(1);
    navigate("/products", { replace: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Update URL with page parameter
    const params = new URLSearchParams();
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    params.set("page", page);

    navigate(`/products?${params.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddToCart = async (productId) => {
    setIsAddingToCart(true);
    setAddingProductId(productId);

    try {
      await quickAddToCart(productId);
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
      setAddingProductId(null);
    }
  };

  // Get active category name for breadcrumb
  const activeCategoryName =
    activeCategory !== "all"
      ? categories.find((cat) => cat.id === parseInt(activeCategory))?.name
      : null;

  // Breadcrumb - FIXED: Use current URL state instead of constructing
  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    ...(activeCategoryName
      ? [
          {
            label: activeCategoryName,
            link: `/products?category=${activeCategory}`, // Use current activeCategory
          },
        ]
      : []),
  ];

  // Rest of your component remains the same...
  if (isLoading) {
    return (
      <div className="h-[100vh] bg-gradient-to-b from-orange-50 to-red-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-[100vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50 pb-8 pt-[13vh] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-[11vh] z-30 bg-gradient-to-b from-orange-50 to-red-50 pb-2">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 lg:mb-0 max-w-375:hidden">
              Our Products
              {activeCategoryName && (
                <span className="text-orange-600 ml-2">
                  - {activeCategoryName}
                </span>
              )}
              {searchTerm && (
                <span className="text-orange-600 ml-2">
                  - Search: "{searchTerm}"
                </span>
              )}
            </h1>

            <div className="text-md text-gray-600 hidden md:block">
              Showing {products.length} of {totalCount} products
            </div>
          </div>

          {/* Search Filter */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onClear={handleClearFilters}
            hasActiveFilters={activeCategory !== "all" || searchTerm}
          />

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Products Grid */}
        <ProductsGrid
          products={products}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          isAddingToCart={isAddingToCart}
          addingProductId={addingProductId}
        />

        {/* Pagination */}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={totalCount}
          />
        )}

        {/* No Results */}
        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {searchTerm || activeCategory !== "all"
                ? "Try adjusting your search or filters"
                : "No products available at the moment"}
            </p>
            {(searchTerm || activeCategory !== "all") && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
