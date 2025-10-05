import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const ReminderFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading,
  order,
  title = "Send Payment Reminder",
  submitButtonText = "Send Reminder",
}) => {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount) => {
    if (!amount || amount === "0.00") return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleFormInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getOrderInfo = () => {
    // Handle different order object structures from both components
    if (order.order_id) {
      // From PaymentRequestsTable
      return {
        id: order.order_id,
        customerName: order.user,
        amount: order.amount,
      };
    } else {
      // From OrdersTable
      return {
        id: order.id,
        customerName: order.user?.full_name,
        amount: order.total_amount || order.payment_info?.amount,
      };
    }
  };

  const orderInfo = getOrderInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="px-6 py-4 bg-orange-100 border-b border-orange-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-amber-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-amber-900 hover:text-amber-700 text-lg font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Type
            </label>
            <select
              value={formData.reminder_type}
              onChange={(e) =>
                handleFormInputChange("reminder_type", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="payment_mode_missing">Payment Mode Missing</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="payment_confirmation">Payment Confirmation</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message
            </label>
            <textarea
              value={formData.custom_message}
              onChange={(e) =>
                handleFormInputChange("custom_message", e.target.value)
              }
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your custom reminder message..."
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Order Information:
            </h4>
            <p className="text-sm text-gray-600">
              Order: #{String(orderInfo.id || "").substring(0, 8)}... |
              Customer: {orderInfo.customerName || "N/A"} | Amount:{" "}
              {formatCurrency(orderInfo.amount)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(orderInfo.id)}
              disabled={loading}
              className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              <FaPaperPlane />
              {loading ? "Sending..." : submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderFormModal;
