// components/admin/faq/FAQForm.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { LoadingButton } from "../../DiscountManagement/LoadingButton/LoadingButton";
import { getAllProductNames } from "../../../../services/productApi/productApi";

const FAQForm = ({ faq, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    faq_type: "common",
    product: "",
    is_active: true,
    // order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        faq_type: faq.faq_type,
        product: faq.product || "",
        is_active: faq.is_active,
        // order: faq.order,
      });
    }
    const fetchProducts = async () => {
      try {
        const products = await getAllProductNames();
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [faq]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        product: formData.faq_type === "product" ? formData.product : null,
      };

      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F97316] to-[#DC2626] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {faq ? "Edit FAQ" : "Create New FAQ"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-[#FFE5E0] transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {/* FAQ Type */}
          <div>
            <label className="block text-sm font-medium text-[#7C2D12] mb-2">
              FAQ Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-4 border-2 border-[#FDBA74] rounded-lg cursor-pointer hover:bg-[#FFF5F0] transition-colors">
                <input
                  type="radio"
                  name="faq_type"
                  value="common"
                  checked={formData.faq_type === "common"}
                  onChange={handleChange}
                  className="text-[#F97316] focus:ring-[#F97316]"
                />
                <span className="ml-3 text-[#7C2D12] font-medium">
                  Common Issue
                </span>
              </label>
              <label className="flex items-center p-4 border-2 border-[#FDBA74] rounded-lg cursor-pointer hover:bg-[#FFF5F0] transition-colors">
                <input
                  type="radio"
                  name="faq_type"
                  value="product"
                  checked={formData.faq_type === "product"}
                  onChange={handleChange}
                  className="text-[#F97316] focus:ring-[#F97316]"
                />
                <span className="ml-3 text-[#7C2D12] font-medium">
                  Product Specific
                </span>
              </label>
            </div>
          </div>

          {/* Product Selection (only for product type) */}
          {formData.faq_type === "product" && (
            <div>
              <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                Product *
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required={formData.faq_type === "product"}
                className="w-full px-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-[#7C2D12] mb-2">
              Question *
            </label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter the question..."
              className="w-full px-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent resize-none"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-[#7C2D12] mb-2">
              Answer *
            </label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Enter the answer..."
              className="w-full px-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent resize-none"
            />
          </div>

          {/* Order and Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-[#7C2D12] mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border-2 border-[#FDBA74] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
              />
            </div> */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.is_active ? "bg-[#16A34A]" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform ${
                      formData.is_active ? "transform translate-x-7" : ""
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-[#7C2D12] font-medium">
                  {formData.is_active ? "Active" : "Inactive"}
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-[#FECACA]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#FDBA74] text-[#7C2D12] rounded-lg hover:bg-[#FFF5F0] transition-colors font-medium"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={loading}
              className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              <FaSave className="mr-2" />
              {faq ? "Update FAQ" : "Create FAQ"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQForm;
