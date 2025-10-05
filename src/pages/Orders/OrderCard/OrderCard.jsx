import React, { useMemo, useState } from "react";
import {
  FaClock,
  FaCheck,
  FaCheckCircle,
  FaTimes,
  FaTruck,
  FaInfoCircle,
  FaStar,
  FaCreditCard,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaSyncAlt,
  FaReceipt,
  FaImage,
  FaCalendarAlt,
  FaRedoAlt,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OrderCard = ({
  order,
  index,
  onCancelOrder,
  onMakePayment,
  onRepay,
  onRateClick,
  showPaymentButton = false,
}) => {
  const [showFullPaymentInfo, setShowFullPaymentInfo] = useState(false);

  const navigate = useNavigate();

  // Check if payment is rejected and needs repayment
  const needsRepayment = useMemo(() => {
    const paymentInfo = order.payment_request_info || order.payment_info;
    return (
      paymentInfo?.status === "rejected" &&
      paymentInfo?.mode === "UPI" &&
      order.payment_status !== "paid"
    );
  }, [order]);

  // Get primary product info
  const primaryProduct = useMemo(() => {
    const items = order.items || [];
    if (items.length === 0) return null;

    const item = items[0];
    const productId = item.product?.id || item.product_id;

    if (!productId) {
      console.error("No product ID found in order item:", item);
      return null;
    }

    return {
      product_id: productId,
      product_name: item.product?.name || "Unknown Product",
      image_url:
        item.product?.images?.find((img) => img.is_primary)?.image_url ||
        item.product?.images?.[0]?.image_url,
    };
  }, [order.items]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    } catch {
      return "Invalid Date";
    }
  };

  const calculateTotal = (items) => {
    if (!items || items.length === 0) {
      return order.total_amount
        ? parseFloat(order.total_amount).toFixed(2)
        : "0.00";
    }

    const total = items.reduce((total, item) => {
      const price = parseFloat(
        item.size?.discounted_price ||
          item.discounted_price ||
          item.price ||
          item.size?.price ||
          0
      );
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);

    return total.toFixed(2);
  };

  const getFormattedItems = (items) => {
    if (!items || items.length === 0) {
      return [];
    }

    return items.map((item) => ({
      product_id: item.product?.id || item.product_id,
      product_name: item.product?.name || "Unknown Product",
      size_info: item.size ? `${item.size.label} ${item.size.unit}` : "",
      quantity: item.quantity || 1,
      price: item.price || item.size?.price || "0.00",
      discounted_price:
        item.size?.discounted_price ||
        item.discounted_price ||
        item.price ||
        "0.00",
      image_url:
        item.product?.images?.find((img) => img.is_primary)?.image_url ||
        item.product?.images?.[0]?.image_url,
      flavour: item.product?.flavour,
      discount_pct: item.product?.active_discounts?.[0]?.percentage,
    }));
  };

  const getPaymentStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "pending":
      case "submitted":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "failed":
      case "rejected":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return <FaCheckCircle />;
      case "pending":
      case "submitted":
        return <FaClock />;
      case "failed":
      case "rejected":
        return <FaExclamationTriangle />;
      default:
        return <FaCreditCard />;
    }
  };

  const getStatusClass = (status, payment_status, payment_mode) => {
    if (!status) return "bg-gray-100 text-gray-600";

    switch (status) {
      case "Pending":
        // Check if it's UPI pending verification
        if (payment_mode === "UPI" && payment_status === "submitted") {
          return "bg-purple-100 text-purple-600";
        }
        return "bg-yellow-100 text-yellow-600";
      case "Confirmed":
        return "bg-blue-100 text-blue-600";
      case "Shipped":
        return "bg-purple-100 text-purple-600";
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status, payment_status, payment_mode) => {
    if (!status) return <FaClock />;

    switch (status) {
      case "Delivered":
        return <FaCheckCircle />;
      case "Pending":
        // Check if it's UPI pending verification
        if (payment_mode === "UPI" && payment_status === "submitted") {
          return <FaClock />;
        }
        return <FaClock />;
      case "Confirmed":
        return <FaCheck />;
      case "Shipped":
        return <FaTruck />;
      case "Cancelled":
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  const getRefundStatusClass = (refundStatus) => {
    if (!refundStatus) return "bg-gray-100 text-gray-600";

    switch (refundStatus.status) {
      case "processed":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "failed":
        return "bg-red-100 text-red-600";
      case "not_requested":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRefundStatusIcon = (refundStatus) => {
    if (!refundStatus) return <FaMoneyBillWave />;

    switch (refundStatus.status) {
      case "processed":
        return <FaCheckCircle />;
      case "pending":
        return <FaSyncAlt />;
      case "failed":
        return <FaExclamationTriangle />;
      case "not_requested":
        return <FaMoneyBillWave />;
      default:
        return <FaMoneyBillWave />;
    }
  };

  // Enhanced payment information display
  const renderPaymentInformation = () => {
    const paymentRequest = order.payment_request_info;

    if (!paymentRequest) {
      return (
        <div className="bg-gray-50 p-3 rounded-lg mt-4 text-sm border border-gray-200">
          <div className="font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <FaCreditCard /> Payment Information
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-semibold text-orange-700">Method:</span>
              <span className="ml-1 font-medium capitalize">
                {order.payment_mode || "Not specified"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-orange-700">Status:</span>
              <span className="ml-1 font-medium capitalize">
                {order.payment_status || "Not specified"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`p-3 rounded-lg mt-4 text-sm border ${
          paymentRequest.status === "rejected"
            ? "bg-red-50 border-red-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <div
            className={`font-semibold flex items-center gap-1 ${
              paymentRequest.status === "rejected"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            <FaReceipt /> Payment Details
            {paymentRequest.status === "rejected" && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2">
                Needs Action
              </span>
            )}
          </div>
          <button
            onClick={() => setShowFullPaymentInfo(!showFullPaymentInfo)}
            className={`text-xs font-medium ${
              paymentRequest.status === "rejected"
                ? "text-red-600 hover:text-red-800"
                : "text-blue-600 hover:text-blue-800"
            }`}
          >
            {showFullPaymentInfo ? "Show Less" : "Show More"}
          </button>
        </div>

        {/* Basic Payment Info - Always Visible */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
          <div>
            <span className="font-semibold text-orange-700">Method:</span>
            <span className="ml-1 font-medium capitalize">
              {paymentRequest.mode}
            </span>
          </div>
          <div>
            <span className="font-semibold text-orange-700">Amount:</span>
            <span className="ml-1 font-medium">₹{paymentRequest.amount}</span>
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-orange-700">Status:</span>
            <span
              className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusClass(
                paymentRequest.status
              )}`}
            >
              {getPaymentStatusIcon(paymentRequest.status)}
              <span className="ml-1 capitalize">{paymentRequest.status}</span>
            </span>
          </div>
        </div>

        {/* Rejection reason and repay button */}
        {needsRepayment && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-red-700 font-semibold text-sm flex items-center gap-1">
                <FaExclamationTriangle />
                Payment Rejected
              </div>
              <button
                onClick={() => onRepay && onRepay(order)}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 flex items-center gap-1"
              >
                <FaRedoAlt />
                Repay
              </button>
            </div>
            {order.payment_info?.notes && (
              <p className="text-xs text-gray-600 mt-1">
                <strong>Reason:</strong> {order.payment_info.notes}
              </p>
            )}
          </div>
        )}

        {/* Detailed Payment Info - Expandable */}
        {showFullPaymentInfo && (
          <div className="mt-3 pt-3 border-t border-blue-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-orange-700">Payment ID:</span>
              <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                #{paymentRequest.id}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-orange-700">Date:</span>
              <span className="flex items-center gap-1 text-xs">
                <FaCalendarAlt />
                {formatDateTime(paymentRequest.created_at)}
              </span>
            </div>

            {/* UPI Proof Image */}
            {paymentRequest.upi_proof_image_url && (
              <div className="mt-2">
                <div className="font-semibold text-orange-700 mb-1 flex items-center gap-1">
                  <FaImage /> Payment Proof:
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={paymentRequest.upi_proof_image_url}
                    alt="UPI Payment Proof"
                    className="w-16 h-16 rounded-lg border-2 border-orange-300 object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      window.open(paymentRequest.upi_proof_image_url, "_blank")
                    }
                  />
                  <button
                    onClick={() =>
                      window.open(paymentRequest.upi_proof_image_url, "_blank")
                    }
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Full Image
                  </button>
                </div>
              </div>
            )}

            {/* Payment Status Explanation */}
            <div className="mt-2 p-2 bg-white rounded border text-xs">
              <div className="font-semibold text-gray-600 mb-1">
                Status Explanation:
              </div>
              <div className="text-gray-600">
                {paymentRequest.status === "approved" &&
                  "Your payment has been approved and verified."}
                {paymentRequest.status === "pending" &&
                  "Your payment is being verified. This usually takes 1-2 hours."}
                {paymentRequest.status === "submitted" &&
                  "Payment proof submitted and awaiting verification."}
                {paymentRequest.status === "rejected" &&
                  "Payment was rejected. Please check the reason above and make payment again."}
                {paymentRequest.status === "failed" &&
                  "Payment verification failed. Please contact support."}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const formattedItems = getFormattedItems(order.items || []);
  const calculatedTotal = calculateTotal(order.items || []);
  const statusClass = getStatusClass(
    order.status,
    order.payment_status,
    order.payment_mode
  );
  const statusIcon = getStatusIcon(
    order.status,
    order.payment_status,
    order.payment_mode
  );
  const refundStatus = order.refund_status;

  const canCancel = ["Pending", "Confirmed"].includes(order.status);
  const isShipped = order.status === "Shipped";

  // Handle rate product click
  const handleRateClick = () => {
    if (primaryProduct?.product_id && onRateClick) {
      onRateClick(order, primaryProduct);
    }
  };

  return (
    <div
      id={`order-${order.id}`}
      className="bg-white border border-orange-200 rounded-xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group hover:bg-gradient-to-br hover:from-white hover:to-orange-50 h-auto"
      style={{
        animation: `fadeIn 0.5s ease forwards`,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Order Header */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-red-200">
        <div>
          <div className="text-sm text-gray-500 font-medium">
            Order #{order.id ? order.id.substring(0, 8) : "N/A"}
          </div>
          <div className="text-xs text-orange-700 font-medium">
            Placed on {formatDate(order.created_at)}
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {statusIcon} {order.status || "Unknown"}
        </span>
      </div>

      {/* Order Details */}
      <div className="mb-4 space-y-3">
        {formattedItems.length > 0 ? (
          formattedItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div className="flex flex-col flex-1">
                <div
                  onClick={() =>
                    item.product_id && navigate(`/products/${item.product_id}`)
                  }
                  className="flex items-center gap-2 cursor-pointer hover:underline"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/32x32?text=No+Img";
                      }}
                    />
                  )}
                  <span className="font-semibold text-gray-900 text-sm">
                    {item.product_name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {item.size_info} • Qty: {item.quantity}
                </span>
                {item.flavour && (
                  <span className="text-xs text-orange-600 font-medium">
                    Flavour: {item.flavour}
                  </span>
                )}
                {item.discount_pct && (
                  <span className="text-xs text-green-600 font-medium">
                    {item.discount_pct}% OFF
                  </span>
                )}
              </div>
              <span className="font-bold text-orange-700 text-sm flex flex-col items-end">
                {item.discounted_price &&
                item.discounted_price !== item.price ? (
                  <>
                    <span className="line-through text-gray-400 text-xs">
                      ₹{item.price}
                    </span>
                    <span>₹{item.discounted_price}</span>
                  </>
                ) : (
                  <span>₹{item.price}</span>
                )}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm font-medium">
              {order.total_amount && parseFloat(order.total_amount) > 0
                ? "Order details not available"
                : "No items in this order"}
            </p>
            {order.total_amount && parseFloat(order.total_amount) > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                Total: ₹{order.total_amount}
              </p>
            )}
          </div>
        )}
      </div>

      {order.address_details && (
        <div className="bg-gray-50 p-3 rounded-lg mt-4 text-sm">
          <div className="font-semibold text-gray-600 mb-1">
            Delivery Address:
          </div>
          <div className="text-gray-700 font-medium">
            {order.address_details.address}, {order.address_details.city},{" "}
            {order.address_details.state} - {order.address_details.zip_code}
          </div>
        </div>
      )}

      <div className="flex justify-between font-bold pt-3 border-t border-dashed border-red-200 text-red-900 text-base">
        <span>Total</span>
        <span>₹{calculatedTotal}</span>
      </div>

      {/* Enhanced Payment Information */}
      {renderPaymentInformation()}

      {/* Refund Status */}
      {refundStatus && (
        <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm">
          <div className="font-semibold text-blue-600 mb-1 flex items-center gap-1">
            <FaMoneyBillWave /> Refund Status
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              {refundStatus.message}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getRefundStatusClass(
                refundStatus
              )}`}
            >
              {getRefundStatusIcon(refundStatus)}{" "}
              {refundStatus.status.replace("_", " ")}
            </span>
          </div>
        </div>
      )}

      {order.courier && (
        <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm">
          <div className="font-semibold text-blue-600 mb-2 flex items-center gap-1">
            <FaTruck /> Shipping Information
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-semibold text-orange-700">Courier:</span>
              <span className="ml-1 font-medium">
                {order.courier.courier_name}
              </span>
            </div>
            <div>
              <span className="font-semibold text-orange-700">Tracking #:</span>
              <span className="ml-1 font-medium">
                {order.courier.tracking_number}
              </span>
            </div>
            <div>
              <span className="font-semibold text-orange-700">Shipped:</span>
              <span className="ml-1 font-medium">
                {formatDate(order.courier.shipping_date)}
              </span>
            </div>
            <div>
              <span className="font-semibold text-orange-700">
                Est. Delivery:
              </span>
              <span className="ml-1 font-medium">
                {formatDate(order.courier.estimated_delivery)}
              </span>
            </div>
          </div>
        </div>
      )}

      {order.cancellation_reason && (
        <div className="bg-red-50 p-3 rounded-lg mt-4 text-sm">
          <div className="font-semibold text-red-600 mb-1 flex items-center gap-1">
            <FaInfoCircle /> Cancellation Reason
          </div>
          <div className="text-gray-700 font-medium">
            {order.cancellation_reason || "No response available"}
          </div>
        </div>
      )}

      {order.cancellation_refund_message && (
        <div className="bg-orange-50 p-3 rounded-lg mt-4 text-sm">
          <div className="font-semibold text-orange-600 mb-1 flex items-center gap-1">
            <FaInfoCircle /> Refund Information
          </div>
          <div className="text-gray-700 font-medium">
            {order.cancellation_refund_message}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        {/* Payment Button for Pending Payment Orders */}
        {(showPaymentButton || order.payment_status === "pending") &&
          order.status !== "Cancelled" &&
          !needsRepayment && (
            <button
              onClick={() => onMakePayment(order)}
              className="px-4 py-2 max-w-375:p-2 text-white rounded-md shadow-[0_4px_12px_rgba(34,197,94,0.35)] transition-all bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 flex items-center gap-1 text-sm font-semibold"
            >
              <FaCreditCard /> Make Payment
            </button>
          )}

        {/* Repay Button for Rejected Payments */}
        {needsRepayment && (
          <button
            onClick={() => onRepay && onRepay(order)}
            className="px-4 py-2 text-white rounded-md shadow-[0_4px_12px_rgba(239,68,68,0.35)] transition-all bg-gradient-to-r from-red-500 to-red-600 hover:scale-105 flex items-center gap-1 text-sm font-semibold"
          >
            <FaRedoAlt /> Repay
          </button>
        )}

        {/* Rate/Update Review Button for Delivered Orders */}
        {order.status === "Delivered" && primaryProduct?.product_id ? (
          <button
            onClick={handleRateClick}
            className="px-4 py-2 text-white rounded-md shadow-[0_4px_12px_rgba(220,38,38,0.35)] transition-all bg-gradient-to-r from-orange-500 to-red-600 hover:scale-105 flex items-center gap-1 text-sm font-semibold"
          >
            <FaStar />
            Rate Product
          </button>
        ) : order.status !== "Cancelled" ? (
          <button
            onClick={() => canCancel && onCancelOrder(order)}
            disabled={!canCancel}
            title={
              canCancel
                ? order.payment_mode?.toLowerCase() === "upi"
                  ? "Cancel this order and refund the payment"
                  : "Cancel this order"
                : isShipped
                ? "Can't cancel after shipped. Contact support."
                : "Order can't be cancelled"
            }
            className={`px-4 py-2 rounded-md flex items-center gap-1 text-sm font-semibold border ${
              canCancel
                ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FaTimes />{" "}
            {canCancel && order.payment_mode?.toLowerCase() === "upi"
              ? "Cancel & Refund"
              : "Cancel Order"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default OrderCard;
