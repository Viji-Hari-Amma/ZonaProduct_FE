import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FaCreditCard, FaQrcode, FaHistory } from "react-icons/fa";
import PaymentRequestsTable from "./Tables/PaymentRequestsTable";
import UPISettingsManager from "./Manager/UPISettingsManager";
import RefundRequestsManager from "./Manager/RefundRequestsManager";

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState("refunds");

  const tabs = [
    { id: "refunds", label: "Refund Requests", icon: FaHistory },
    { id: "upi", label: "UPI Settings", icon: FaQrcode },
    // { id: "payments", label: "Payment Requests", icon: FaCreditCard },
  ];

  return (
    <div className="min-h-[100vh] bg-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
              <p className="text-orange-100">
                Manage payments, UPI settings, and refund requests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 border border-orange-100">
          <div className="border-b border-orange-100">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-orange-500 hover:border-orange-300"
                    }`}
                  >
                    <Icon className="mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
          {activeTab === "payments" && <PaymentRequestsTable />}

          {activeTab === "upi" && <UPISettingsManager />}

          {activeTab === "refunds" && <RefundRequestsManager />}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
