// components/discounts/DiscountForm.jsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { LoadingButton } from "../LoadingButton/LoadingButton";
import {
  getAllCategoryNames,
  getAllProductNames,
} from "../../../../services/productApi/productApi";

export const DiscountForm = ({ discount, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_type: "universal",
    percentage: "",
    start_date: "",
    end_date: "",
    product: "",
    category: "",
  });

  // Initialize as empty arrays
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getAllCategoryNames();
        const productRes = await getAllProductNames();

        setCategories(Array.isArray(categoryRes) ? categoryRes : []);
        setProducts(Array.isArray(productRes) ? productRes : []);
      } catch (error) {
        console.error("Failed to fetch products/categories:", error);
        setCategories([]);
        setProducts([]);
      }
    };

    fetchData();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name || "",
        description: discount.description || "",
        discount_type: discount.discount_type || "universal",
        percentage: discount.percentage || "",
        start_date: discount.start_date
          ? discount.start_date.split("T")[0]
          : "",
        end_date: discount.end_date ? discount.end_date.split("T")[0] : "",
        product:
          discount.product && typeof discount.product === "object"
            ? discount.product.id
            : discount.product || "",
        category:
          discount.category && typeof discount.category === "object"
            ? discount.category.id
            : discount.category || "",
      });
    }
  }, [discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "discount_type" && {
        product: "",
        category: "",
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      percentage: parseFloat(formData.percentage),
      start_date: `${formData.start_date}T00:00:00Z`,
      end_date: `${formData.end_date}T23:59:59Z`,
    };

    if (submitData.discount_type === "universal") {
      delete submitData.product;
      delete submitData.category;
    } else if (submitData.discount_type === "product") {
      submitData.product = parseInt(submitData.product);
      delete submitData.category;
    } else if (submitData.discount_type === "category") {
      submitData.category = parseInt(submitData.category);
      delete submitData.product;
    }

    await onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-orange-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-brown-800">
            {discount ? "Edit Discount" : "Create New Discount"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Discount Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Summer Sale, Masala Day, etc."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Special discount description..."
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type *
            </label>
            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="universal">Universal Discount</option>
              <option value="category">Category Discount</option>
              <option value="product">Product Discount</option>
            </select>
          </div>

          {/* Product Dropdown */}
          {formData.discount_type === "product" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Product *
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Dropdown */}
          {formData.discount_type === "category" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage *
            </label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="15.00"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <LoadingButton type="submit" loading={loading} className="flex-1">
              {discount ? "Update Discount" : "Create Discount"}
            </LoadingButton>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
