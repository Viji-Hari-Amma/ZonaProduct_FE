// components/discounts/DiscountStats.jsx
import React from "react";
import { FaChartBar, FaTags, FaClock, FaCalendarTimes } from "react-icons/fa";
import { DiscountCard } from "../Card/DiscountCard";

export const DiscountStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: "Total Discounts",
      value: stats.total_discounts,
      icon: FaTags,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Active Discounts",
      value: stats.active_discounts,
      icon: FaChartBar,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Expired Discounts",
      value: stats.expired_discounts,
      icon: FaCalendarTimes,
      color: "from-red-500 to-pink-500",
    },
    {
      label: "Upcoming Discounts",
      value: stats.upcoming_discounts,
      icon: FaClock,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <DiscountCard key={index} hover className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </DiscountCard>
        ))}
      </div>

      {/* Discount Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <DiscountCard className="p-6">
          <h3 className="text-lg font-semibold text-brown-800 mb-4">
            Discounts by Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(stats.by_type).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
              >
                <span className="capitalize font-medium text-brown-700">
                  {type}
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </DiscountCard>

        {/* Pie Chart */}
        <DiscountCard className="p-6">
          <h3 className="text-lg font-semibold text-brown-800 mb-4">
            Status Breakdown
          </h3>
        </DiscountCard>
      </div>
    </div>
  );
};
