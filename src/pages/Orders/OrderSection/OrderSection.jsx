// OrderSection/OrderSection.js
import React from "react";
import OrderCard from "../OrderCard/OrderCard";
import EmptyState from "../EmptyState/EmptyState";
import { FaClock, FaCheckCircle, FaBan, FaCreditCard } from "react-icons/fa";

const OrderSection = ({
  title,
  orders,
  onCancelOrder,
  onMakePayment,
  onRepay,
  onRateClick,
  showPaymentButton = false,
  emptyStateIcon,
  emptyStateMessage,
  buttonText,
  onButtonClick,
}) => {
  const getSectionIcon = (title) => {
    switch (title) {
      case "Active Orders":
        return <FaClock className="text-orange-500" />;
      case "Payment Pending":
        return <FaCreditCard className="text-orange-500" />;
      case "Delivered Orders":
        return <FaCheckCircle className="text-orange-500" />;
      case "Cancelled Orders":
        return <FaBan className="text-orange-500" />;
      case "UPI Payment Pending":
        return <FaCreditCard className="text-orange-500" />;
      case "Cash on Delivery Orders":
        return <FaCreditCard className="text-orange-500" />;
      default:
        return <FaClock className="text-orange-500" />;
    }
  };

  return (
    <div>
      <h2 className="text-2xl text-red-900 mb-5 flex items-center gap-2 font-bold">
        {getSectionIcon(title)} {title}
      </h2>
      {orders && orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 items-start lg:grid-cols-3 gap-5">
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              onCancelOrder={onCancelOrder}
              onMakePayment={onMakePayment}
              onRepay={onRepay}
              onRateClick={onRateClick}
              showPaymentButton={showPaymentButton}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={emptyStateIcon}
          message={emptyStateMessage}
          buttonText={buttonText}
          onButtonClick={onButtonClick}
        />
      )}
    </div>
  );
};

export default OrderSection;
