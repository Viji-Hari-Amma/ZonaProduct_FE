import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaPlus,
  FaBox,
  FaTags,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaTrash,
} from "react-icons/fa";
import {
  deleteProduct,
  listProducts,
  listInactiveProducts,
} from "../../../services/productApi/productApi";
import ProductList from "./ProductList/ProductList";
import ProductForm from "./ProductForm/ProductForm";
import CategoryManagement from "./CategoryManagement/CategoryManagement";
import ProductDetailModal from "./ProductDetailModal/ProductDetailModal";

export const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("all"); // 'all', 'active', 'inactive'

  const fetchProducts = async (
    page = 1,
    pageSize = 9,
    filterParams = {},
    mode = viewMode
  ) => {
    setLoading(true);
    try {
      let response;
      const params = {
        page,
        page_size: pageSize,
        ...filterParams,
      };

      // Use different endpoints based on view mode
      if (mode === "active") {
        response = await listProducts({ ...params, is_active: true });
      } else if (mode === "inactive") {
        response = await listInactiveProducts(params);
      } else {
        response = await listProducts(params);
      }

      setProducts(response.data.results || []);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: response.data.count || 0,
        totalPages: Math.ceil((response.data.count || 0) / pageSize),
      });
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [viewMode]); // Refetch when view mode changes

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(1, pagination.pageSize, newFilters, viewMode);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setFilters({}); // Reset filters when changing view mode
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      await deleteProduct(productToDelete);
      toast.success("Product deleted successfully");
      fetchProducts(pagination.current, pagination.pageSize, filters, viewMode);
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedProduct(null);
    fetchProducts(pagination.current, pagination.pageSize, filters, viewMode);
  };

  const handleDetailModalClose = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const handlePageChange = (page) => {
    fetchProducts(page, pagination.pageSize, filters, viewMode);
  };

  const handleRefresh = () => {
    fetchProducts(pagination.current, pagination.pageSize, filters, viewMode);
  };

  const tabs = [
    { id: "products", label: "Products", icon: FaBox },
    { id: "categories", label: "Categories", icon: FaTags },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Product Management</h1>
              <p className="text-orange-100">
                Manage your products, categories, and inventory
              </p>
            </div>
            <div className="flex space-x-4">
              {/* View Mode Toggle */}
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewModeChange("all")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      viewMode === "all"
                        ? "bg-white text-orange-600"
                        : "text-white hover:bg-white hover:bg-opacity-20"
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => handleViewModeChange("active")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      viewMode === "active"
                        ? "bg-white text-orange-600"
                        : "text-white hover:bg-white hover:bg-opacity-20"
                    }`}
                  >
                    <FaEye className="inline mr-1" />
                    Active
                  </button>
                  <button
                    onClick={() => handleViewModeChange("inactive")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      viewMode === "inactive"
                        ? "bg-white text-orange-600"
                        : "text-white hover:bg-white hover:bg-opacity-20"
                    }`}
                  >
                    <FaEyeSlash className="inline mr-1" />
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {viewMode === "all" && "All Products"}
                    {viewMode === "active" && "Active Products"}
                    {viewMode === "inactive" && "Inactive Products"}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {viewMode === "all" &&
                      "View and manage all products in your store"}
                    {viewMode === "active" &&
                      "Active products visible to customers"}
                    {viewMode === "inactive" &&
                      "Inactive products hidden from customers"}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Add New Product
                  </button>
                </div>
              </div>

              <ProductList
                products={products}
                loading={loading}
                onEdit={handleEditProduct}
                onView={handleViewProduct}
                onDelete={handleDeleteClick}
                onRefresh={handleRefresh}
                pagination={pagination}
                onPageChange={handlePageChange}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
              />
            </div>
          )}

          {activeTab === "categories" && <CategoryManagement />}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={handleFormClose}
          onSave={handleFormClose}
        />
      )}

      {/* Product Detail Modal */}
      {showDetailModal && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleDetailModalClose}
          onEdit={() => {
            setShowDetailModal(false);
            setShowForm(true);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Delete Product
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone and all associated data will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-2" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
