// components/OrderStats.jsx
import React from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaTimesCircle,
  FaShippingFast,
} from "react-icons/fa";

const OrderStats = ({ stats, orders }) => {
  let calculatedStats;

  if (stats) {
    // Map API stats into the same shape
    calculatedStats = {
      total: stats.total_orders || 0,
      completed:
        stats.status_distribution?.find((s) => s.status === "Delivered")
          ?.count || 0,
      cancelled:
        stats.status_distribution?.find((s) => s.status === "Cancelled")
          ?.count || 0,
      in_transit:
        stats.pending_orders ||
        stats.status_distribution?.find((s) => s.status === "Pending")?.count ||
        0,
    };
  } else if (orders) {
    // Fallback: calculate from raw orders array
    calculatedStats = {
      total: orders.length,
      completed: orders.filter((order) => order.status === "Delivered").length,
      cancelled: orders.filter((order) => order.status === "Cancelled").length,
      in_transit: orders.filter((order) =>
        ["Confirmed", "Shipped"].includes(order.status)
      ).length,
    };
  } else {
    // Default empty
    calculatedStats = { total: 0, completed: 0, cancelled: 0, in_transit: 0 };
  }

  const statCards = [
    {
      title: "Total Orders",
      value: calculatedStats.total,
      icon: FaShoppingCart,
      color: "from-orange-500 to-orange-400",
      bgColor: "bg-orange-100",
    },
    {
      title: "Completed",
      value: calculatedStats.completed,
      icon: FaCheckCircle,
      color: "from-green-500 to-green-400",
      bgColor: "bg-green-100",
    },
    {
      title: "Cancelled",
      value: calculatedStats.cancelled,
      icon: FaTimesCircle,
      color: "from-red-500 to-red-400",
      bgColor: "bg-red-100",
    },
    {
      title: "In Transit",
      value: calculatedStats.in_transit,
      icon: FaShippingFast,
      color: "from-blue-500 to-blue-400",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg border border-orange-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-evenly">
            <div className="flex items-center justify-center flex-col gap-1">
              <p className="text-3xl font-bold text-amber-900 mt-2">
                {stat.value}
              </p>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon
                className={`text-2xl text-${stat.color
                  .split(" ")[0]
                  .replace("from-", "")}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;
