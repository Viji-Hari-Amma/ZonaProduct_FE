import React from "react";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaShippingFast,
  FaUser,
  FaCalendar,
  FaIdCard,
  FaSync,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaReceipt,
  FaTag,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaShoppingCart,
  FaPercent,
  FaPaperPlane,
  FaHistory,
  FaCheck,
  FaStar,
  FaFlask,
} from "react-icons/fa";

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  onViewReminderHistory,
  onSendReminder,
  toast,
}) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === "0.00") return "₹0.00";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount));
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-300`;
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-300`;
      case "shipped":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-300`;
      case "delivered":
        return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-300`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-300`;
    }
  };

  const getPaymentStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "submitted":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Calculate order totals with proper discount handling
  const calculateOrderTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let deliveryCharge = 0;
    let taxAmount = 0;

    order.items?.forEach((item) => {
      const itemPrice = parseFloat(item.price || 0);
      const quantity = item.quantity || 1;
      const itemTotal = itemPrice * quantity;
      subtotal += itemTotal;
    });

    // Calculate delivery charge and tax from order data
    deliveryCharge = parseFloat(order.delivery_charge || 0);
    taxAmount = parseFloat(order.tax_amount || 0);

    // Use order's discount amount if available
    const finalTotalDiscount = order.discount_amount
      ? parseFloat(order.discount_amount)
      : totalDiscount;

    return {
      subtotal,
      totalDiscount: finalTotalDiscount,
      deliveryCharge,
      taxAmount,
      grandTotal: subtotal - finalTotalDiscount + deliveryCharge + taxAmount,
    };
  };

  const totals = calculateOrderTotals();

  // Get user information safely
  const getUserInfo = () => {
    if (typeof order.user === "string") {
      return {
        email: order.user,
        full_name: order.contact_info?.email || "N/A",
        mobile: order.contact_info?.phone_number || "N/A",
        date_joined: order.user?.date_joined,
        id: order.user?.id,
      };
    } else if (typeof order.user === "object" && order.user !== null) {
      return {
        email: order.user.email,
        full_name: order.user.full_name,
        mobile: order.user.mobile,
        date_joined: order.user.date_joined,
        id: order.user.id,
      };
    }
    return {
      email: "N/A",
      full_name: "N/A",
      mobile: "N/A",
      date_joined: null,
      id: null,
    };
  };

  const userInfo = getUserInfo();

  // Check if should show reminder button - don't show for COD payments
  const shouldShowReminderButton = () => {
    // Don't show reminder buttons for COD payments
    if (order.payment_info?.mode?.toLowerCase() === "cod") {
      return false;
    }
    return (
      order.reminder_info?.is_eligible_for_reminders &&
      order.reminder_info?.can_send_reminder
    );
  };

  // Check if should show reminder history - don't show for COD payments
  const shouldShowReminderHistory = () => {
    // Don't show reminder history for COD payments
    if (order.payment_info?.mode?.toLowerCase() === "cod") {
      return false;
    }
    return order.reminder_info?.has_reminders;
  };

  const handleSendReminder = async () => {
    if (onSendReminder) {
      await onSendReminder(order);
    }
  };

  // Get primary image for a product
  const getPrimaryImage = (product) => {
    const primaryImage = product.images?.find((img) => img.is_primary);
    return primaryImage?.image_url || product.images?.[0]?.image_url || null;
  };

  // Get active discounts for a product
  const getActiveDiscounts = (product) => {
    return product.active_discounts || [];
  };

  // Safely get courier information
  const getCourierInfo = () => {
    if (!order.courier) return null;

    // If courier is a string, return basic info
    if (typeof order.courier === "string") {
      return {
        courier_name: order.courier,
        tracking_number: order.tracking_number || "N/A",
      };
    }

    // If courier is an object, extract the fields
    if (typeof order.courier === "object") {
      return {
        courier_name: order.courier.courier_name || order.courier.name || "N/A",
        tracking_number:
          order.courier.tracking_number || order.tracking_number || "N/A",
        shipping_date: order.courier.shipping_date,
        estimated_delivery: order.courier.estimated_delivery,
        notes: order.courier.notes,
      };
    }

    return null;
  };

  const courierInfo = getCourierInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <FaReceipt className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-amber-100 text-sm">
                  Complete order information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 transform hover:scale-110"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Order & Customer Info */}
            <div className="xl:col-span-2 space-y-8">
              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <FaBox className="text-amber-600" />
                  Order Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <InfoItem
                      icon={FaTag}
                      label="Order ID"
                      value={order.id?.split("-")[0] || order.id}
                    />
                    <InfoItem
                      icon={FaCalendar}
                      label="Order Date"
                      value={formatDate(order.created_at)}
                    />
                    <InfoItem
                      icon={FaSync}
                      label="Last Updated"
                      value={formatDate(order.updated_at)}
                    />
                    <InfoItem
                      icon={FaShoppingCart}
                      label="Total Items"
                      value={order.items?.length || 0}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Status:
                      </span>
                      <span className={getStatusBadge(order.status)}>
                        {order.status === "Cancelled" && (
                          <FaExclamationTriangle />
                        )}
                        {order.status}
                      </span>
                    </div>
                    <InfoItem
                      icon={FaMoneyBillWave}
                      label="Total Amount"
                      value={formatCurrency(order.total_amount)}
                    />

                    {/* Reminder Actions - Only show for non-COD payments */}
                    {order.payment_info?.mode?.toLowerCase() !== "cod" && (
                      <div className="pt-2 border-t border-amber-200 space-y-2">
                        {/* Send Reminder Button */}
                        {shouldShowReminderButton() && (
                          <button
                            onClick={handleSendReminder}
                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <FaPaperPlane />
                            Send Payment Reminder
                          </button>
                        )}

                        {/* Reminder History Button */}
                        {shouldShowReminderHistory() && (
                          <button
                            onClick={() => onViewReminderHistory(order)}
                            className="w-full px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <FaHistory />
                            View Reminder History (
                            {order.reminder_info?.total_reminders_sent || 0})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <InfoItem
                      icon={FaUser}
                      label="Full Name"
                      value={userInfo.full_name}
                    />
                    <InfoItem
                      icon={FaEnvelope}
                      label="Email"
                      value={userInfo.email}
                    />
                    <InfoItem
                      icon={FaPhone}
                      label="Mobile"
                      value={userInfo.mobile}
                    />
                  </div>
                  <div className="space-y-3">
                    <InfoItem
                      icon={FaCalendar}
                      label="Member Since"
                      value={formatDate(userInfo.date_joined)}
                    />
                    <InfoItem
                      icon={FaIdCard}
                      label="User ID"
                      value={userInfo.id ? `#${userInfo.id}` : "N/A"}
                    />
                  </div>
                </div>
              </div>

              {/* Order Items Card with Enhanced Product Details */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBox className="text-green-600" />
                  Order Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-6">
                  {order.items?.map((item, index) => {
                    const itemTotal =
                      parseFloat(item.price || 0) * (item.quantity || 1);
                    const product = item.product;
                    const primaryImage = getPrimaryImage(product);
                    const activeDiscounts = getActiveDiscounts(product);

                    return (
                      <div
                        key={index}
                        className="p-6 bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl border border-amber-100"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          {primaryImage && (
                            <div className="flex-shrink-0">
                              <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {product.description}
                                </p>

                                {/* Product Badges */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {product.category_name}
                                  </span>
                                  {product.flavour && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                      {product.flavour}
                                    </span>
                                  )}
                                  {product.is_featured && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                                      <FaStar className="text-xs" />
                                      Featured
                                    </span>
                                  )}
                                  {product.availability_status ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      In Stock ({product.stock_count})
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                      Out of Stock
                                    </span>
                                  )}
                                </div>

                                {/* Active Discounts */}
                                {activeDiscounts.length > 0 && (
                                  <div className="mt-2">
                                    {activeDiscounts.map((discount, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
                                      >
                                        <FaPercent className="text-xs" />
                                        <span className="font-medium">
                                          {discount.name}: {discount.percentage}
                                          % off
                                        </span>
                                        <span className="text-xs text-green-500">
                                          (Until {formatDate(discount.end_date)}
                                          )
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Ingredients */}
                                {product.ingredients?.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                      <FaFlask className="text-xs" />
                                      Ingredients:
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {product.ingredients.map(
                                        (ingredient, idx) => (
                                          <span
                                            key={idx}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                          >
                                            {ingredient.name}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Nutritional Facts */}
                                {product.nutritional_facts?.length > 0 && (
                                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                    <p className="text-xs font-bold text-gray-700 mb-2">
                                      Nutritional Facts (per serving):
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                      {product.nutritional_facts.map(
                                        (fact, idx) => (
                                          <div key={idx} className="text-xs">
                                            <span className="font-medium text-gray-600">
                                              {fact.component}:
                                            </span>
                                            <span className="ml-1 text-gray-800">
                                              {fact.value}
                                              {fact.unit}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Price and Quantity */}
                              <div className="text-right min-w-[120px]">
                                <div className="space-y-2">
                                  <div>
                                    <p className="font-bold text-gray-900 text-lg">
                                      {formatCurrency(item.price)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      each
                                    </p>
                                  </div>
                                  <div className="bg-amber-100 px-3 py-2 rounded-lg">
                                    <p className="font-bold text-amber-700">
                                      Qty: {item.quantity || 1}
                                    </p>
                                    <p className="font-bold text-amber-800 text-lg">
                                      Total: {formatCurrency(itemTotal)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Order Totals Breakdown */}
                  <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>

                    {totals.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                          <FaPercent className="text-green-500" />
                          Total Discount:
                        </span>
                        <span className="font-medium text-green-600">
                          -{formatCurrency(totals.totalDiscount)}
                        </span>
                      </div>
                    )}

                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">
                          {formatCurrency(totals.taxAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Charge:</span>
                      <span className="font-medium">
                        {formatCurrency(totals.deliveryCharge)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                      <span className="font-bold text-lg text-gray-900">
                        Grand Total
                      </span>
                      <span className="font-bold text-2xl text-amber-600">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Details */}
            <div className="space-y-8">
              {/* Payment Information Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-blue-600" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <InfoItem
                    icon={FaCreditCard}
                    label="Payment Mode"
                    value={order.payment_info?.mode || "Unknown"}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Payment Status:
                    </span>
                    <span
                      className={getPaymentStatusBadge(
                        order.payment_info?.status
                      )}
                    >
                      {order.payment_info?.status || "Unknown"}
                    </span>
                  </div>
                  <InfoItem
                    icon={FaMoneyBillWave}
                    label="Amount Paid"
                    value={formatCurrency(order.payment_info?.amount || 0)}
                  />
                  <InfoItem
                    icon={FaCalendar}
                    label="Payment Date"
                    value={formatDate(order.payment_info?.created_at)}
                  />
                  {order.payment_request_id && (
                    <InfoItem
                      icon={FaInfoCircle}
                      label="Payment Request ID"
                      value={order.payment_request_id}
                    />
                  )}
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  Delivery Address
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 font-medium">
                        {order.address}
                      </p>
                      {order.contact_info && (
                        <>
                          <p className="text-gray-600 text-sm">
                            Email: {order.contact_info.email}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Phone: {order.contact_info.phone_number}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier Information Card */}
              {courierInfo && (
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200 shadow-sm">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <FaShippingFast className="text-purple-600" />
                    Courier Details
                  </h3>
                  <div className="space-y-3">
                    <InfoItem
                      icon={FaShippingFast}
                      label="Courier Service"
                      value={courierInfo.courier_name}
                    />
                    <InfoItem
                      icon={FaTag}
                      label="Tracking Number"
                      value={courierInfo.tracking_number}
                    />
                    {courierInfo.shipping_date && (
                      <InfoItem
                        icon={FaCalendar}
                        label="Shipping Date"
                        value={formatDate(courierInfo.shipping_date)}
                      />
                    )}
                    {courierInfo.estimated_delivery && (
                      <InfoItem
                        icon={FaCalendar}
                        label="Estimated Delivery"
                        value={formatDate(courierInfo.estimated_delivery)}
                      />
                    )}
                    {courierInfo.notes && (
                      <InfoItem
                        icon={FaInfoCircle}
                        label="Notes"
                        value={courierInfo.notes}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Reminder Status Card - Only show for non-COD payments */}
              {order.reminder_info &&
                order.payment_info?.mode?.toLowerCase() !== "cod" && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 shadow-sm">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                      <FaPaperPlane className="text-indigo-600" />
                      Reminder Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Eligible:
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.reminder_info.is_eligible_for_reminders
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.reminder_info.is_eligible_for_reminders
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Can Send:
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.reminder_info.can_send_reminder
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.reminder_info.can_send_reminder ? "Yes" : "No"}
                        </span>
                      </div>
                      <InfoItem
                        icon={FaPaperPlane}
                        label="Total Sent"
                        value={order.reminder_info.total_reminders_sent}
                      />
                      <InfoItem
                        icon={FaCheck}
                        label="Successful"
                        value={order.reminder_info.successful_reminders}
                      />
                      <InfoItem
                        icon={FaPercent}
                        label="Success Rate"
                        value={`${order.reminder_info.success_rate || 0}%`}
                      />
                      {order.reminder_info.suggested_reminder_type && (
                        <InfoItem
                          icon={FaInfoCircle}
                          label="Suggested Type"
                          value={order.reminder_info.suggested_reminder_type}
                        />
                      )}
                      {order.reminder_info.last_reminder_sent_at && (
                        <InfoItem
                          icon={FaCalendar}
                          label="Last Reminder"
                          value={formatDate(
                            order.reminder_info.last_reminder_sent_at
                          )}
                        />
                      )}
                    </div>
                  </div>
                )}

              {/* Quick Items Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-amber-600" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="text-sm border-b border-amber-100 pb-2 last:border-b-0"
                    >
                      <p className="font-semibold text-gray-800">
                        {item.product?.name}
                      </p>
                      <div className="flex justify-between text-gray-600">
                        <span>
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            parseFloat(item.price || 0) * (item.quantity || 1)
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-amber-200">
                    <div className="flex justify-between font-bold text-amber-900">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for consistent info items
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
      <Icon className="text-amber-600" />
      {label}:
    </span>
    <span className="text-sm font-semibold text-gray-900">
      {value || "N/A"}
    </span>
  </div>
);

export default OrderDetailsModal;
