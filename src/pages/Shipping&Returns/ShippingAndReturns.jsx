// pages/ShippingReturns.js
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FiTruck,
  FiPackage,
  FiRefreshCw,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

export const ShippingAndReturns = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [activeTab, setActiveTab] = useState("shipping");

  const shippingInfo = {
    domestic: [
      {
        service: "Standard Delivery",
        time: "3-7 business days",
        cost: "₹49",
        description: "Free on orders above ₹499",
      },
      {
        service: "Express Delivery",
        time: "2-3 business days",
        cost: "₹99",
        description: "Available for metro cities",
      },
      {
        service: "Same Day Delivery",
        time: "Within 24 hours",
        cost: "₹149",
        description: "Select pin codes in major cities",
      },
    ],
    partners: ["Delhivery", "DTDC", "Blue Dart", "XpressBees", "Ecom Express"],
  };

  const returnPolicy = [
    {
      step: "1",
      title: "Initiate Return",
      description:
        "Request return within 7 days of delivery from your Orders page",
      time: "Within 7 days",
    },
    {
      step: "2",
      title: "Quality Check",
      description:
        "Our team verifies the product condition and reason for return",
      time: "1-2 days",
    },
    {
      step: "3",
      title: "Pickup Scheduled",
      description: "Courier partner collects the product from your address",
      time: "1-2 days",
    },
    {
      step: "4",
      title: "Refund Processed",
      description:
        "Amount credited to your original payment method after quality check",
      time: "3-4 days",
    },
  ];

  const handleTrackOrder = () => {
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    toast.info(
      `Tracking order: ${trackingNumber}. You will be redirected to the courier website.`
    );
  };

  const tabs = [
    { id: "shipping", label: "Shipping Information", icon: <FiTruck /> },
    { id: "returns", label: "Returns & Refunds", icon: <FiRefreshCw /> },
    // { id: 'tracking', label: 'Track Order', icon: <FiPackage /> }
  ];

  return (
    <div className="min-h-screen bg-body-bg py-8 pt-[11vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary-gradient rounded-full flex items-center justify-center shadow-lg">
            <FiTruck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-deep-brown mb-4">
            Shipping & Returns
          </h1>
          <p className="text-warm-brown text-lg max-w-3xl mx-auto">
            Fast, reliable delivery across India and hassle-free returns for
            your complete peace of mind
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto mb-8 bg-white rounded-xl shadow-red-glow border border-soft-orange p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg mx-1 transition-all duration-300 flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-primary-gradient text-white shadow-button"
                  : "text-warm-brown hover:bg-section-alt"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shipping Information */}
        {activeTab === "shipping" && (
          <div className="space-y-8">
            {/* Delivery Options */}
            <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange overflow-hidden">
              <div className="bg-section-alt px-6 py-4 border-b border-FECACA">
                <h2 className="text-2xl font-bold text-deep-brown flex items-center">
                  <FiTruck className="w-6 h-6 mr-3" />
                  Delivery Options
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {shippingInfo.domestic.map((service, index) => (
                    <div
                      key={index}
                      className="bg-section-alt border border-FECACA rounded-lg p-6 text-center hover:shadow-red-glow-hover transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 mx-auto mb-4 bg-primary-gradient rounded-full flex items-center justify-center">
                        <FiClock className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-deep-brown text-lg mb-2">
                        {service.service}
                      </h3>
                      <p className="text-primary-orange font-bold text-xl mb-2">
                        {service.cost}
                      </p>
                      <p className="text-warm-brown mb-2">{service.time}</p>
                      <p className="text-sm text-warm-brown">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Partners */}
                <div className="border-t border-FECACA pt-6">
                  <h3 className="font-semibold text-deep-brown text-lg mb-4 flex items-center">
                    <FiMapPin className="w-5 h-5 mr-2" />
                    Our Shipping Partners
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {shippingInfo.partners.map((partner, index) => (
                      <span
                        key={index}
                        className="bg-section-alt border border-FECACA px-4 py-2 rounded-lg text-warm-brown"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange p-6 sm:p-8">
              <h3 className="font-semibold text-deep-brown text-lg mb-4">
                Order Processing Timeline
              </h3>

              <div className="grid grid-cols-[repeat(auto-fit,_minmax(120px,_1fr))] gap-4 text-center">
                {[
                  { step: "Order Placed", time: "Instant", icon: "📝" },
                  { step: "Processing", time: "24 hours", icon: "⚡" },
                  { step: "Dispatched", time: "1-2 days", icon: "🚚" },
                  { step: "Delivered", time: "3-7 days", icon: "🎉" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center transition-transform duration-300 hover:scale-105"
                  >
                    <div className="w-16 h-16 mx-auto mb-2 bg-primary-gradient rounded-full flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <p className="font-semibold text-deep-brown">{item.step}</p>
                    <p className="text-warm-brown text-sm">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Returns & Refunds */}
        {activeTab === "returns" && (
          <div className="space-y-8">
            {/* Return Process */}
            <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange overflow-hidden">
              <div className="bg-section-alt px-6 py-4 border-b border-FECACA">
                <h2 className="text-2xl font-bold text-deep-brown flex items-center">
                  <FiRefreshCw className="w-6 h-6 mr-3" />
                  Return Process
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {returnPolicy.map((step, index) => (
                    <div
                      key={index}
                      className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary-gradient rounded-full flex items-center justify-center text-white font-bold text-xl relative">
                        {step.step}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <FiClock className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-deep-brown mb-2">
                        {step.title}
                      </h3>
                      <p className="text-warm-brown text-sm mb-2">
                        {step.description}
                      </p>
                      <div className="bg-orange-100 text-primary-orange px-3 py-1 rounded-full text-xs font-medium inline-block">
                        {step.time}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Return Conditions */}
                <div className="bg-section-alt border border-FECACA rounded-lg p-6">
                  <h3 className="font-semibold text-deep-brown text-lg mb-4">
                    Return Conditions
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">
                        ✅ Eligible for Return
                      </h4>
                      <ul className="text-warm-brown text-sm space-y-1">
                        <li>• Damaged during transit</li>
                        <li>• Incorrect item received</li>
                        <li>• Manufacturing defects</li>
                        <li>• Expired products</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">
                        ❌ Not Eligible for Return
                      </h4>
                      <ul className="text-warm-brown text-sm space-y-1">
                        <li>• Change of mind</li>
                        <li>• Opened food products</li>
                        <li>• Products past best before date</li>
                        <li>• Damage due to improper storage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Track Order */}
        {activeTab === "tracking" && (
          <div className="bg-white rounded-xl shadow-red-glow border border-soft-orange p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-primary-gradient rounded-full flex items-center justify-center">
              <FiPackage className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-deep-brown mb-4">
              Track Your Order
            </h2>
            <p className="text-warm-brown mb-6 max-w-md mx-auto">
              Enter your tracking number to check the current status of your
              delivery
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-FDBA74 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
                <button
                  onClick={handleTrackOrder}
                  className="bg-primary-gradient text-white px-6 py-3 rounded-lg shadow-button hover:shadow-button-hover hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  Track Order
                </button>
              </div>
              <p className="text-sm text-warm-brown">
                Find your tracking number in your order confirmation email or in
                the Orders section of your account
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
