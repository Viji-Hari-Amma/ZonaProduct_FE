// components/discounts/DeleteConfirmation.jsx
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { LoadingButton } from "../LoadingButton/LoadingButton";
import { toast } from "react-toastify";

export const DeleteConfirmation = ({
  discount,
  onConfirm,
  onCancel,
  loading,
}) => {
  if (!discount) return null;

  // Enhanced handling for discount object
  const getDiscountId = () => {
    if (typeof discount === "object" && discount !== null && discount.id) {
      return discount.id;
    }
    // If discount is already the ID (number)
    if (typeof discount === "number") {
      return discount;
    }
    // If discount is string ID
    if (typeof discount === "string" && discount !== "undefined") {
      return parseInt(discount);
    }
    return null;
  };

  const getDiscountName = () => {
    if (typeof discount === "object" && discount !== null && discount.name) {
      return discount.name;
    }
    return "this discount";
  };

  const handleConfirm = () => {
    const discountId = getDiscountId();

    if (!discountId || isNaN(discountId)) {
      console.error("Invalid discount ID:", discountId, "from:", discount);
      toast.error("Invalid discount ID. Please try again.");
      return;
    }
    onConfirm(discountId);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-brown-800">
            Delete Discount
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>"{getDiscountName()}"</strong>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <LoadingButton
            onClick={handleConfirm}
            loading={loading}
            className="bg-gradient-to-r from-red-500 to-red-600 flex-1"
          >
            Delete Discount
          </LoadingButton>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
