import React from "react";
import {
  FaUsers,
  FaUserCheck,
  FaExclamationTriangle,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      icon: FaUsers,
      label: "Total Users",
      value: stats.totalUsers,
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: FaUserCheck,
      label: "Active Users",
      value: stats.activeUsers,
      color: "from-green-500 to-teal-600",
    },
    {
      icon: FaExclamationTriangle,
      label: "Requires Action",
      value: stats.requiresAction,
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: FaUserShield,
      label: "Super Users",
      value: stats.superusers,
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: FaUserTie,
      label: "Staff Members",
      value: stats.staffMembers,
      color: "from-[#F97316] to-[#DC2626]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-lg border border-[#FED7AA] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center flex-col">
              <p className="text-[#9A3412] text-sm font-medium">{stat.label}</p>
              <p
                className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${stat.color}`}
              >
                {stat.value}
              </p>
            </div>
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${stat.color} text-white`}
            >
              <stat.icon className="text-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
