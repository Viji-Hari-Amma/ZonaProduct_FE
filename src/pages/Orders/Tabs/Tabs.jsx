import React from "react";
import {
  FaClipboardList,
  FaHistory,
  FaTimesCircle,
  FaCreditCard,
} from "react-icons/fa";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      key: "current",
      label: "Current",
      icon: <FaClipboardList className="text-sm" />,
    },
    {
      key: "pending_payment",
      label: "Pending",
      icon: <FaCreditCard className="text-sm" />,
    },
    {
      key: "previous",
      label: "History",
      icon: <FaHistory className="text-sm" />,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: <FaTimesCircle className="text-sm" />,
    },
  ];

  return (
    <>
      {/* Desktop Tabs */}
      <div className="hidden md:flex gap-2 mb-8 border-b-2 border-red-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 rounded-t-lg font-semibold flex items-center gap-2 transition-all duration-300 whitespace-nowrap relative ${
              activeTab === tab.key
                ? "text-orange-500 font-bold"
                : "text-gray-400 hover:text-orange-500"
            }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Mobile Segmented Control */}
      <div className="md:hidden mb-4 w-full">
        <div className="bg-gray-100 rounded-xl flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg flex-1 transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-orange-500 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tabs;
