// components/admin/faq/FAQTable.jsx
import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaArrowUp,
  FaArrowDown,
  FaSync,
} from "react-icons/fa";
import LoadingSpinner from "../Loaders/LoadingSpinner";

const FAQTable = ({
  faqs,
  loading,
  selectedFaqs,
  onSelectFaqs,
  onEdit,
  onDelete,
  onReorder,
  onToggleStatus,
  onRefresh,
}) => {
  const [reordering, setReordering] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectFaqs(faqs.map((faq) => faq.id));
    } else {
      onSelectFaqs([]);
    }
  };

  const handleSelectFaq = (faqId, checked) => {
    if (checked) {
      onSelectFaqs([...selectedFaqs, faqId]);
    } else {
      onSelectFaqs(selectedFaqs.filter((id) => id !== faqId));
    }
  };

  // Calculate min and max orders for the current group
  const getOrderBounds = () => {
    if (faqs.length === 0) return { minOrder: 1, maxOrder: 1 };

    const orders = faqs.map((faq) => faq.order);
    return {
      minOrder: Math.min(...orders),
      maxOrder: Math.max(...orders),
    };
  };

  const { minOrder, maxOrder } = getOrderBounds();

  const handleReorder = async (faq, direction) => {
    setReordering(faq.id);

    let newOrder;
    if (direction === "up") {
      newOrder = faq.order - 1;
      // Don't allow going below minimum order (1)
      if (newOrder < 1) {
        setReordering(null);
        return;
      }
    } else {
      newOrder = faq.order + 1;
      // Don't allow going above current maximum order
      if (newOrder > maxOrder) {
        setReordering(null);
        return;
      }
    }

    try {
      await onReorder(faq.id, newOrder);
    } finally {
      setReordering(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-8">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] p-8 text-center">
        <div className="text-[#9CA3AF] text-lg mb-4">No FAQs found</div>
        <button
          onClick={onRefresh}
          className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <FaSync className="inline mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-[#FED7AA] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#F97316] to-[#DC2626] text-white">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedFaqs.length === faqs.length && faqs.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-4 text-left">Question</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Helpful Ratio</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FECACA]">
            {faqs.map((faq, index) => (
              <tr
                key={faq.id}
                className={`hover:bg-[#FFF5F0] transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-[#FFEDE9]"
                }`}
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedFaqs.includes(faq.id)}
                    onChange={(e) => handleSelectFaq(faq.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="font-medium text-[#7C2D12] line-clamp-2">
                      {faq.question}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      faq.faq_type === "common"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {faq.faq_type === "common" ? "Common" : "Product"}
                  </span>
                </td>
                <td className="px-6 py-4">{faq.product_name || "-"}</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => onToggleStatus(faq.id, faq.is_active)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      faq.is_active
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    } transition-colors`}
                  >
                    {faq.is_active ? (
                      <FaEye className="mr-1" />
                    ) : (
                      <FaEyeSlash className="mr-1" />
                    )}
                    {faq.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#F97316] to-[#DC2626] h-2 rounded-full"
                        style={{ width: `${faq.helpful_ratio * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[#9A3412]">
                      {Math.round(faq.helpful_ratio * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(faq)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit FAQ"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(faq.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete FAQ"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FAQTable;
