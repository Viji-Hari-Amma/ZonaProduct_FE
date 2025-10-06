import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEdit,
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaPaperPlane,
  FaReceipt,
  FaQrcode,
  FaHistory,
  FaCheck,
} from "react-icons/fa";
import {
  listAdminPayments,
  sendOrderPaymentReminder,
} from "../../../../services/paymentApi/paymentApi";
import QRProofModal from "../Model/QRProofModal";
import ReminderHistoryModal from "../Model/ReminderHistoryModal";
import ReminderFormModal from "../../PaymentManagement/Model/ReminderFormModal";

const OrdersTable = ({
  orders,
  onViewDetails,
  onUpdateStatus,
  loading,
  toast,
  onRefresh,
}) => {
  const [sendingReminders, setSendingReminders] = useState({});
  const [disabledReminders, setDisabledReminders] = useState({});
  const [showReminderForm, setShowReminderForm] = useState(null);
  const [reminderFormData, setReminderFormData] = useState({
    reminder_type: "payment_mode_missing",
    custom_message: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // States for QR Proof functionality
  const [showQRProof, setShowQRProof] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loadingPaymentRequests, setLoadingPaymentRequests] = useState(false);
  const [showDecisionFormInModal, setShowDecisionFormInModal] = useState(false);

  // States for Reminder History functionality
  const [showReminderHistory, setShowReminderHistory] = useState(false);
  const [selectedOrderForReminderHistory, setSelectedOrderForReminderHistory] =
    useState(null);

  // Effect to manage disabled reminders countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setDisabledReminders((prev) => {
        const updated = { ...prev };
        let changed = false;

        Object.keys(updated).forEach((orderId) => {
          if (updated[orderId] && updated[orderId] <= Date.now()) {
            delete updated[orderId];
            changed = true;
          }
        });

        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch payment requests when QR proof modal opens
  useEffect(() => {
    if (showQRProof) {
      fetchPaymentRequests();
    }
  }, [showQRProof]);

  // In your OrdersTable component
  const fetchPaymentRequests = async () => {
    setLoadingPaymentRequests(true);
    try {
      const response = await listAdminPayments();

      // Ensure we always have an array
      let paymentData = [];

      if (response.data && Array.isArray(response.data)) {
        paymentData = response.data;
      } else if (
        response.data &&
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        // Handle paginated response
        paymentData = response.data.results;
      } else if (response.data && typeof response.data === "object") {
        // Convert object to array if needed
        paymentData = Object.values(response.data);
      }

      setPaymentRequests(paymentData);
    } catch (error) {
      console.error("Error fetching payment requests:", error);
      toast.error("Failed to load payment details");
      // Set empty array on error
      setPaymentRequests([]);
    } finally {
      setLoadingPaymentRequests(false);
    }
  };

  const handleViewQRProof = (order) => {
    setSelectedOrder(order);
    setShowQRProof(true);
    setShowDecisionFormInModal(false);

    // Ensure paymentRequests is initialized as array
    if (!paymentRequests || !Array.isArray(paymentRequests)) {
      setPaymentRequests([]);
    }
  };

  const handleVerifyPayment = (order) => {
    setSelectedOrder(order);
    setShowQRProof(true);
    setShowDecisionFormInModal(true);
  };

  const handleCloseQRProof = () => {
    setShowQRProof(false);
    setSelectedOrder(null);
    setShowDecisionFormInModal(false);
  };

  const handleViewPaymentProof = (paymentInfo) => {
    if (paymentInfo?.upi_proof_image_url) {
      window.open(paymentInfo.upi_proof_image_url, "_blank");
    } else {
      toast.error("No payment proof available");
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "confirmed":
        return <FaCheckCircle className="text-green-500" />;
      case "shipped":
        return <FaShippingFast className="text-blue-500" />;
      case "delivered":
        return <FaBox className="text-purple-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "shipped":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "delivered":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentBadge = (paymentInfo) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (!paymentInfo || paymentInfo.mode === "Unknown") {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }

    switch (paymentInfo.status) {
      case "paid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "submitted":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRefundBadge = (refundInfo) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (!refundInfo) return `${baseClasses} bg-gray-100 text-gray-800`;

    switch (refundInfo.status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "processed":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === "0.00") return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get product image for display in table
  const getProductImage = (item) => {
    const primaryImage = item.product?.images?.find((img) => img.is_primary);
    return primaryImage?.image_url || item.product?.images?.[0]?.image_url;
  };

  const handleSendPaymentReminder = async (orderId) => {
    if (!orderId) {
      toast.error("No order ID found");
      return;
    }

    setSendingReminders((prev) => ({ ...prev, [orderId]: true }));
    setFormErrors({});

    try {
      const payload = {
        order_id: orderId,
        reminder_type: reminderFormData.reminder_type,
        custom_message: reminderFormData.custom_message,
      };

      const response = await sendOrderPaymentReminder(payload);

      if (response.data.success) {
        toast.success("Payment reminder sent successfully!");
        setShowReminderForm(null);
        setReminderFormData({
          reminder_type: "payment_mode_missing",
          custom_message: "",
        });

        // Disable reminder button for 15 minutes (900000 ms)
        const disableUntil = Date.now() + 15 * 60 * 1000;
        setDisabledReminders((prev) => ({
          ...prev,
          [orderId]: disableUntil,
        }));
      } else {
        toast.error(response.data.message || "Failed to send payment reminder");
      }
    } catch (error) {
      console.error("Error sending payment reminder:", error);

      if (error.response?.data?.non_field_errors) {
        const errorMessage = error.response.data.non_field_errors[0];
        toast.error(errorMessage);

        if (
          errorMessage.includes("already sent") &&
          errorMessage.includes("minutes")
        ) {
          const disableUntil = Date.now() + 15 * 60 * 1000;
          setDisabledReminders((prev) => ({
            ...prev,
            [orderId]: disableUntil,
          }));
        }
      } else if (error.response?.data) {
        const firstError = Object.values(error.response.data)[0];
        if (Array.isArray(firstError)) {
          toast.error(firstError[0]);
        } else {
          toast.error(firstError || "Error sending payment reminder");
        }
      } else {
        toast.error("Error sending payment reminder");
      }
    } finally {
      setSendingReminders((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getDefaultReminderMessage = (order) => {
    const customerName = order.user?.full_name || "Customer";
    const orderIdShort = String(order.id || "").substring(0, 8);
    const orderAmount = formatCurrency(order.total_amount);
    const daysSinceCreated = order.days_since_created || 0;
    const reminderCount = order.reminder_info?.total_reminders_sent || 0;

    const reminderType =
      order.reminder_info?.suggested_reminder_type || "payment_mode_missing";

    const baseMessages = {
      payment_mode_missing: `Dear ${customerName}, we noticed that you haven't selected a payment method for your order #${orderIdShort}. Please complete your payment of ${orderAmount} to proceed with your order.`,
      payment_pending: `Dear ${customerName}, your payment of ${orderAmount} for order #${orderIdShort} is still pending. Please complete the payment to proceed with your order.`,
      payment_confirmation: `Dear ${customerName}, we're awaiting confirmation of your payment for order #${orderIdShort}. If you've already paid, please ignore this message.`,
    };

    let message =
      baseMessages[reminderType] || baseMessages.payment_mode_missing;

    if (daysSinceCreated > 3) {
      message += " Your order is awaiting payment confirmation.";
    }

    if (daysSinceCreated > 7) {
      message +=
        " Please complete your payment soon to avoid automatic cancellation.";
    }

    if (reminderCount > 0) {
      message += ` This is a follow-up reminder.`;
    }

    message += " Thank you for your business!";

    return message;
  };

  const handleOpenReminderForm = (order) => {
    const defaultMessage = getDefaultReminderMessage(order);
    setReminderFormData({
      reminder_type:
        order.reminder_info?.suggested_reminder_type || "payment_mode_missing",
      custom_message: defaultMessage,
    });
    setFormErrors({});
    setShowReminderForm(order.id);
  };

  const handleFormInputChange = (field, value) => {
    setReminderFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const shouldShowPaymentReminder = (order) => {
    if (disabledReminders[order.id]) {
      return false;
    }

    return (
      order.reminder_info?.is_eligible_for_reminders &&
      order.reminder_info?.can_send_reminder
    );
  };

  const shouldShowViewProofButton = (order) => {
    return (
      order.payment_info?.mode === "UPI" &&
      order.payment_info?.status === "submitted" &&
      order.payment_info?.upi_proof_image_url
    );
  };

  const shouldShowQRProofButton = (order) => {
    return (
      order.payment_info?.mode === "UPI" &&
      (order.payment_info?.status === "submitted" ||
        order.payment_info?.status === "approved" ||
        order.payment_info?.status === "rejected")
    );
  };

  const getRemainingTime = (orderId) => {
    if (!disabledReminders[orderId]) return 0;
    const remaining = disabledReminders[orderId] - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  };

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="text-amber-900 mt-4">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-orange-100 border-b border-orange-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-900">Orders List</h2>
          <span className="text-red-600 font-medium">
            {orders.length} orders displayed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Order Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Items & Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Refund
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {orders.map((order) => {
                const isReminderDisabled = disabledReminders[order.id];
                const remainingTime = getRemainingTime(order.id);

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-orange-50 transition-colors duration-200"
                  >
                    {/* Order Info Column */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-amber-900">
                          #{String(order.id || "").substring(0, 8)}...
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(order.created_at)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.days_since_created} days ago
                        </div>
                        {order.reminder_info?.has_reminders && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <FaPaperPlane className="text-xs" />
                            {order.reminder_info.total_reminders_sent} reminders
                            sent
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Customer Column */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-amber-900">
                          <FaUser className="text-orange-500" />
                          {order.user?.full_name || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaEnvelope className="text-orange-400" />
                          {order.contact_info?.email || "N/A"}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaPhone className="text-orange-400" />
                          {order.contact_info?.phone_number || "N/A"}
                        </div>
                      </div>
                    </td>
                    {/* Items & Amount Column */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">
                          {order.items?.length} item(s)
                        </div>
                        <div className="text-sm font-medium text-amber-900">
                          {formatCurrency(order.payment_info.amount)}
                        </div>
                        {order.items?.slice(0, 2).map((item, index) => {
                          const productImage = getProductImage(item);
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-xs text-gray-500"
                            >
                              {productImage && (
                                <img
                                  src={productImage}
                                  alt={item.product?.name}
                                  className="w-6 h-6 object-cover rounded border border-gray-200"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="truncate font-medium">
                                  {item.product?.name}
                                </div>
                                <div className="flex justify-between text-gray-400">
                                  <span>Qty: {item.quantity}</span>
                                  <span>{formatCurrency(item.price)}</span>
                                </div>
                                {item.product?.flavour && (
                                  <div className="text-gray-400">
                                    Flavour: {item.product.flavour}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {order.items && order.items.length > 2 && (
                          <div className="text-xs text-orange-500">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Payment Column */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <FaCreditCard className="text-orange-500" />
                          <span className="font-medium">
                            {order.payment_info?.mode || "N/A"}
                          </span>
                        </div>
                        <div className={getPaymentBadge(order.payment_info)}>
                          {order.payment_info?.status || "Unknown"}
                        </div>
                        {order.payment_info?.amount && (
                          <div className="text-xs text-gray-600">
                            Paid: {formatCurrency(order.payment_info.amount)}
                          </div>
                        )}
                        {order.payment_request_id && (
                          <div className="text-xs text-gray-400">
                            Request ID: {order.payment_request_id}
                          </div>
                        )}
                        {order.payment_info?.upi_proof_image_url && (
                          <div className="text-xs text-green-600">
                            ✓ Proof Available
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Status Column */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </div>
                      {order.cancellation_reason && (
                        <div
                          className="text-xs text-gray-600 mt-1 max-w-[150px] truncate"
                          title={order.cancellation_reason}
                        >
                          {order.cancellation_reason}
                        </div>
                      )}
                    </td>
                    {/* Refund Column */}
                    <td className="px-4 py-4">
                      {order.refund_info ? (
                        <div className="space-y-1">
                          <div className={getRefundBadge(order.refund_info)}>
                            {order.refund_info.status}
                          </div>
                          {order.refund_info.amount && (
                            <div className="text-xs text-gray-600">
                              {formatCurrency(order.refund_info.amount)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">N/A</div>
                      )}
                    </td>
                    {/* Actions Column */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        {/* View Details button */}
                        <button
                          onClick={() => onViewDetails(order)}
                          className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
                          title="View full order details"
                        >
                          <FaEye />
                          Details
                        </button>

                        {/* View Proof Button */}
                        {shouldShowViewProofButton(order) && (
                          <button
                            onClick={() =>
                              handleViewPaymentProof(order.payment_info)
                            }
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition-colors"
                            title="View payment proof"
                          >
                            <FaReceipt />
                            View Proof
                          </button>
                        )}

                        {/* QR Proof Button - Show for UPI with submitted, approved, or rejected status */}
                        {order.payment_info?.mode === "UPI" &&
                          (order.payment_info?.status === "submitted" ||
                            order.payment_info?.status === "approved" ||
                            order.payment_info?.status === "rejected") && (
                            <button
                              onClick={() => handleViewQRProof(order)}
                              className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                              title="View detailed payment proof with QR"
                            >
                              <FaQrcode />
                              QR Proof
                            </button>
                          )}

                        {/* Reminder History Button */}
                        {order.payment_info?.mode?.toLowerCase() !== "cod" && (
                          <button
                            onClick={() => {
                              setSelectedOrderForReminderHistory(order);
                              setShowReminderHistory(true);
                            }}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors"
                            title="View reminder history"
                          >
                            <FaHistory />
                            Reminders
                          </button>
                        )}

                        {/* Conditional buttons based on order status and payment verification */}
                        {order.status.toLowerCase() === "cancelled" ? (
                          <button
                            disabled
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                            title="This order has been cancelled. Status updates are not allowed."
                          >
                            <FaTimesCircle />
                            Cancelled
                          </button>
                        ) : order.status.toLowerCase() === "delivered" ? (
                          <button
                            disabled
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg cursor-not-allowed"
                            title="This order has been delivered. No further actions can be taken."
                          >
                            <FaCheckCircle className="text-green-600" />
                            Delivered
                          </button>
                        ) : isReminderDisabled ? (
                          <button
                            disabled
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-400 text-white rounded-lg cursor-not-allowed"
                            title={`Reminder disabled. Please wait ${formatRemainingTime(
                              remainingTime
                            )}`}
                          >
                            <FaPaperPlane />
                            Wait {formatRemainingTime(remainingTime)}
                          </button>
                        ) : shouldShowPaymentReminder(order) ||
                          order.payment_info?.mode === "Unknown" ||
                          order.payment_info?.status === "rejected" ? (
                          <button
                            onClick={() => handleOpenReminderForm(order)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Send payment reminder to customer"
                          >
                            <FaPaperPlane />
                            Send Reminder
                          </button>
                        ) : (
                          // Payment verification logic - UPDATED based on your requirements
                          (() => {
                            const isPaymentApproved =
                              order.payment_info?.status === "approved";
                            const isCOD =
                              order.payment_info?.mode?.toLowerCase() === "cod";
                            const isUPISubmitted =
                              order.payment_info?.mode === "UPI" &&
                              order.payment_info?.status === "submitted";

                            // Show Verify Payment button for UPI submitted status
                            if (isUPISubmitted) {
                              return (
                                <button
                                  onClick={() => handleVerifyPayment(order)}
                                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                  title="Verify payment to proceed with order"
                                >
                                  <FaCheck />
                                  Verify Payment
                                </button>
                              );
                            }
                            // Show Update Status button for approved payments or COD
                            else if (isPaymentApproved || isCOD) {
                              return (
                                <button
                                  onClick={() => onUpdateStatus(order)}
                                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-300"
                                  title="Update order status"
                                >
                                  <FaEdit />
                                  Update Status
                                </button>
                              );
                            } else {
                              // For other cases (like pending payments, etc.), show Update Status button
                              return (
                                <button
                                  onClick={() => onUpdateStatus(order)}
                                  className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-300"
                                  title="Update order status"
                                >
                                  <FaEdit />
                                  Update Status
                                </button>
                              );
                            }
                          })()
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <FaBox className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <ReminderFormModal
          isOpen={!!showReminderForm}
          onClose={() => setShowReminderForm(null)}
          onSubmit={handleSendPaymentReminder}
          formData={reminderFormData}
          setFormData={setReminderFormData}
          loading={sendingReminders[showReminderForm]}
          order={orders.find((o) => o.id === showReminderForm)}
          title="Send Payment Reminder"
          submitButtonText="Send Reminder"
        />
      )}

      {/* QR Proof Modal */}
      <QRProofModal
        isOpen={showQRProof}
        onClose={handleCloseQRProof}
        order={selectedOrder}
        paymentRequests={paymentRequests}
        loading={loadingPaymentRequests}
        toast={toast}
        onRefresh={onRefresh}
        showDecisionForm={showDecisionFormInModal}
      />

      {/* Reminder History Modal */}
      <ReminderHistoryModal
        isOpen={showReminderHistory}
        onClose={() => setShowReminderHistory(false)}
        order={selectedOrderForReminderHistory}
      />
    </>
  );
};

export default OrdersTable;
