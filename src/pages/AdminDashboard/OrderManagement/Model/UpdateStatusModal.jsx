import React, { useState, useEffect } from "react";
import { FaTimes, FaPaperPlane, FaCheck, FaInfoCircle } from "react-icons/fa";

const UpdateStatusModal = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const [formData, setFormData] = useState({
    status: "",
    courier_details: {
      courier_name: "",
      tracking_number: "",
      shipping_date: "",
      estimated_delivery: "",
    },
    cancellation_reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when order changes
  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        courier_details: order.courier_details || {
          courier_name: "",
          tracking_number: "",
          shipping_date: "",
          estimated_delivery: "",
        },
        cancellation_reason: order.cancellation_reason || "",
      });
      setErrors({});
    }
  }, [order]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "courier_name" ||
      name === "tracking_number" ||
      name === "shipping_date" ||
      name === "estimated_delivery"
    ) {
      setFormData((prev) => ({
        ...prev,
        courier_details: {
          ...prev.courier_details,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    // Validate status transitions
    if (order) {
      const currentStatus = order.status;
      const newStatus = formData.status;

      // Check for invalid transitions
      if (currentStatus === "Delivered" && newStatus !== "Delivered") {
        newErrors.status = "Cannot change status from Delivered";
      }
      if (currentStatus === "Cancelled" && newStatus !== "Cancelled") {
        newErrors.status = "Cannot change status from Cancelled";
      }
      if (currentStatus === newStatus) {
        newErrors.status = "Please select a different status";
      }
    }

    // Validate courier details for Shipped status
    if (formData.status === "Shipped") {
      if (!formData.courier_details.courier_name?.trim()) {
        newErrors.courier_name = "Courier name is required";
      }
      if (!formData.courier_details.tracking_number?.trim()) {
        newErrors.tracking_number = "Tracking number is required";
      }
    }

    // Validate cancellation reason for Cancelled status
    if (formData.status === "Cancelled" && !formData.cancellation_reason?.trim()) {
      newErrors.cancellation_reason = "Cancellation reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare data for API
      const submitData = { status: formData.status };

      // Add courier details for Shipped status
      if (formData.status === "Shipped") {
        submitData.courier_details = {
          courier_name: formData.courier_details.courier_name,
          tracking_number: formData.courier_details.tracking_number,
          shipping_date: formData.courier_details.shipping_date || null,
          estimated_delivery: formData.courier_details.estimated_delivery || null,
        };
      }

      // Add cancellation reason for Cancelled status
      if (formData.status === "Cancelled") {
        submitData.cancellation_reason = formData.cancellation_reason;
      }

      // Call the update function
      await onStatusUpdate(submitData);
      
      setSubmitSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating order status:", error);
      
      // Handle specific error cases
      if (error.response?.data?.non_field_errors) {
        setErrors({ general: error.response.data.non_field_errors[0] });
      } else if (error.response?.data) {
        // Handle field-specific errors from backend
        const backendErrors = error.response.data;
        Object.keys(backendErrors).forEach(key => {
          setErrors(prev => ({ 
            ...prev, 
            [key]: Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key]
          }));
        });
      } else {
        setErrors({ general: "Failed to update order status" });
      }
      
      setIsSubmitting(false);
    }
  };

  const getStatusOptions = () => {
    if (!order) return [];
    
    const currentStatus = order.status;
    const allStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
    
    // Filter out invalid transitions
    return allStatuses.filter(status => {
      if (currentStatus === "Delivered") return status === "Delivered";
      if (currentStatus === "Cancelled") return status === "Cancelled";
      if (currentStatus === "Pending") return status !== "Pending";
      if (currentStatus === "Confirmed") return status !== "Pending" && status !== "Confirmed";
      if (currentStatus === "Shipped") return status === "Delivered" || status === "Cancelled";
      return true;
    });
  };

  if (!isOpen || !order) return null;

  const statusOptions = getStatusOptions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold">Update Order Status</h2>
            <p className="text-orange-100 text-sm">
              Order: #{order.id.substring(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 transition-all duration-300 transform hover:scale-110 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <FaInfoCircle />
              {errors.general}
            </div>
          )}

          {/* Current Status Display */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              Current Status
            </label>
            <div className="px-3 py-2 border border-orange-300 rounded-lg bg-orange-50 text-orange-800 font-medium">
              {order.status}
            </div>
          </div>

          {/* New Status Selection */}
          <div>
            <label className="block text-sm font-medium text-amber-900 mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                errors.status ? 'border-red-500' : 'border-orange-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select new status...</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>

          {/* Courier Details */}
          {formData.status === "Shipped" && (
            <div className="bg-orange-50 p-4 rounded-lg space-y-3 transition-all duration-300 animate-fadeIn">
              <h4 className="font-medium text-amber-900">Courier Details</h4>

              <div>
                <label className="block text-sm text-amber-900 mb-1">
                  Courier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="courier_name"
                  value={formData.courier_details.courier_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                    errors.courier_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., FedEx, UPS, DHL"
                  disabled={isSubmitting}
                />
                {errors.courier_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.courier_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-amber-900 mb-1">
                  Tracking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tracking_number"
                  value={formData.courier_details.tracking_number}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                    errors.tracking_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter tracking number"
                  disabled={isSubmitting}
                />
                {errors.tracking_number && (
                  <p className="text-red-500 text-sm mt-1">{errors.tracking_number}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-amber-900 mb-1">
                    Shipping Date
                  </label>
                  <input
                    type="date"
                    name="shipping_date"
                    value={formData.courier_details.shipping_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm text-amber-900 mb-1">
                    Est. Delivery
                  </label>
                  <input
                    type="date"
                    name="estimated_delivery"
                    value={formData.courier_details.estimated_delivery}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Reason */}
          {formData.status === "Cancelled" && (
            <div className="transition-all duration-300 animate-fadeIn">
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Cancellation Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                name="cancellation_reason"
                value={formData.cancellation_reason}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                  errors.cancellation_reason ? 'border-red-500' : 'border-orange-300'
                }`}
                placeholder="Reason for cancellation..."
                disabled={isSubmitting}
              />
              {errors.cancellation_reason && (
                <p className="text-red-500 text-sm mt-1">{errors.cancellation_reason}</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-orange-500 text-orange-500 rounded-lg transition-all duration-300 
                         hover:bg-orange-500 hover:text-white hover:shadow-lg hover:scale-105 
                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         font-semibold flex items-center justify-center gap-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className={`flex-1 px-4 py-3 text-white rounded-lg transition-all duration-300 font-semibold
                         flex items-center justify-center gap-2 relative overflow-hidden
                         ${
                           submitSuccess
                             ? "bg-green-500 scale-105"
                             : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-500"
                         }
                         hover:shadow-xl hover:scale-105 active:scale-95 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : submitSuccess ? (
                <>
                  <FaCheck className="mr-2 animate-bounce" />
                  Updated!
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" />
                  Update Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add these styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UpdateStatusModal;
