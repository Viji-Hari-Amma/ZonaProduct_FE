import React, { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaUsers,
  FaPizzaSlice,
} from "react-icons/fa";
import { PiCurrencyInrBold } from "react-icons/pi";
import CountUp from "react-countup";
import { OrderSummary } from "../../../../services/orderApi/orderApi";
import { UserCount } from "../../../../services/AuthService/AuthService";
import { ProductCount } from "../../../../services/productApi/productApi";
import { useNavigate } from "react-router-dom";

const StatsGrid = () => {
  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    userCount: 0,
    productCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchStatsData = async () => {
    try {
      setLoading(true);

      const [orderRes, userRes, productRes] = await Promise.all([
        OrderSummary(),
        UserCount(),
        ProductCount(),
      ]);

      setStatsData({
        totalOrders: orderRes.data.summary?.total_orders || 0,
        totalRevenue: orderRes.data.summary?.total_revenue || 0,
        userCount: userRes.data.user_count || 0,
        productCount: productRes.data.total_products || 0,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching stats data:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
    const interval = setInterval(fetchStatsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: FaShoppingBag,
      value: statsData.totalOrders,
      label: "Total Orders",
      gradient: "from-orange-400 to-red-500",
      prefix: "",
      decimals: 0,
      path: "/admin/Order_Management", // 👈 target route
    },
    {
      icon: PiCurrencyInrBold,
      value: statsData.totalRevenue,
      label: "Total Revenue",
      gradient: "from-green-400 to-green-600",
      prefix: "₹",
      decimals: 2,
      path: "#", // 👈 target route
    },
    {
      icon: FaUsers,
      value: statsData.userCount,
      label: "Registered Users",
      gradient: "from-blue-400 to-blue-600",
      prefix: "",
      decimals: 0,
      path: "/admin/User_Management", // 👈 target route
    },
    {
      icon: FaPizzaSlice,
      value: statsData.productCount,
      label: "Total Products",
      gradient: "from-purple-400 to-purple-600",
      prefix: "",
      decimals: 0,
      path: "#", // 👈 target route
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-card border border-card-border p-6 animate-pulse"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center mr-4">
                <div className="w-6 h-6 bg-gray-300 rounded" />
              </div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-card-border p-6 mb-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchStatsData}
            className="mt-2 px-4 py-2 bg-primary-orange text-white rounded hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={() => navigate(stat.path)} // 👈 navigation
          className="cursor-pointer bg-white rounded-xl shadow-card border border-card-border p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
        >
          <div className="flex items-center">
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mr-4`}
            >
              <stat.icon className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-heading">
                {stat.prefix}
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  separator=","
                  decimals={stat.decimals}
                  decimal="."
                />
              </h3>
              <p className="text-secondary-text">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;