import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaSave } from "react-icons/fa";
import { listCategories } from "../../../../services/productApi/productCategoryApi/productCategoryApi";
import {
  createProduct,
  updateProduct,
} from "../../../../services/productApi/productApi";
import ProductImages from "../ProductImages/ProductImages";
import ProductIngredients from "../ProductIngredients/ProductIngredients";
import ProductNutritionalFacts from "../ProductNutritionalFacts/ProductNutritionalFacts";
import ProductSizes from "../ProductSizes/ProductSizes";

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    availability_status: true,
    stock_count: 0,
    flavour: "",
    is_featured: false,
    is_active: true,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [newProductId, setNewProductId] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        availability_status: product.availability_status || true,
        stock_count: product.stock_count || 0,
        flavour: product.flavour || "",
        is_featured: product.is_featured || false,
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
      setNewProductId(product.id);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      setCategories(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await updateProduct(product.id, formData);
        toast.success("Product updated successfully");
        onSave();
      } else {
        const response = await createProduct(formData);
        toast.success("Product created successfully");
        setNewProductId(response.data.id);
        setActiveSection("images"); // Jump to images section after creation
        // Don't call onSave() here to keep the form open
      }
    } catch (error) {
      toast.error(`Failed to ${product ? "update" : "create"} product`);
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSectionComplete = () => {
    const sections = ["basic", "images", "ingredients", "nutrition", "sizes"];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    } else {
      // All sections completed, close the form
      onSave();
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "images", label: "Images" },
    { id: "ingredients", label: "Ingredients" },
    { id: "nutrition", label: "Nutrition" },
    { id: "sizes", label: "Sizes" },
  ];

  // Use newProductId if available, otherwise use product.id
  const currentProductId = newProductId || product?.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {product ? "Edit Product" : "Create New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 ${
                  activeSection === section.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6">
            {/* Basic Info Section */}
            {activeSection === "basic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flavour
                  </label>
                  <input
                    type="text"
                    name="flavour"
                    value={formData.flavour}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter flavour"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Count *
                  </label>
                  <input
                    type="number"
                    name="stock_count"
                    value={formData.stock_count}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="availability_status"
                      checked={formData.availability_status}
                      onChange={handleChange}
                      className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Available for sale
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Featured product
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            )}

            {/* Images Section */}
            {activeSection === "images" && currentProductId && (
              <ProductImages
                productId={currentProductId}
                onSectionComplete={handleSectionComplete}
              />
            )}

            {/* Ingredients Section */}
            {activeSection === "ingredients" && currentProductId && (
              <ProductIngredients
                productId={currentProductId}
                onSectionComplete={handleSectionComplete}
              />
            )}

            {/* Nutrition Section */}
            {activeSection === "nutrition" && currentProductId && (
              <ProductNutritionalFacts
                productId={currentProductId}
                onSectionComplete={handleSectionComplete}
              />
            )}

            {/* Sizes Section */}
            {activeSection === "sizes" && currentProductId && (
              <ProductSizes
                productId={currentProductId}
                onSectionComplete={handleSectionComplete}
              />
            )}

            {activeSection === "images" && !currentProductId && (
              <div className="text-center py-8 text-gray-500">
                Please save the product first to manage images
              </div>
            )}

            {activeSection === "ingredients" && !currentProductId && (
              <div className="text-center py-8 text-gray-500">
                Please save the product first to manage ingredients
              </div>
            )}

            {activeSection === "nutrition" && !currentProductId && (
              <div className="text-center py-8 text-gray-500">
                Please save the product first to manage nutritional facts
              </div>
            )}

            {activeSection === "sizes" && !currentProductId && (
              <div className="text-center py-8 text-gray-500">
                Please save the product first to manage sizes
              </div>
            )}
          </div>

          {/* Footer - Only show for basic info section */}
          {activeSection === "basic" && (
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <FaSave className="mr-2" />
                  {loading
                    ? "Saving..."
                    : product
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
