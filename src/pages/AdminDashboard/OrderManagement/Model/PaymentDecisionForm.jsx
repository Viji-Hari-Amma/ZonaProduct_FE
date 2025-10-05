import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const PaymentDecisionForm = ({
  paymentRequest,
  onDecision,
  onCancel,
  loading,
  adminNotes,
  setAdminNotes,
}) => {
  const [decisionType, setDecisionType] = useState(null);

  const handleDecisionClick = async (action) => {
    setDecisionType(action);
    await onDecision(action);
    setDecisionType(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-2xl" />
            <div>
              <h3 className="text-xl font-bold">Payment Verification</h3>
              <p className="text-orange-100 text-sm">
                Make a decision for payment #{paymentRequest?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-orange-700">Amount:</span>
                <p className="text-lg font-bold text-orange-800">
                  ₹
                  {parseFloat(paymentRequest?.amount || 0).toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
              <div>
                <span className="font-medium text-orange-700">Mode:</span>
                <p className="font-semibold text-orange-800">
                  {paymentRequest?.mode}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Admin Notes
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Enter your decision notes..."
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handleDecisionClick("approve")}
              disabled={loading && decisionType === "approve"}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none font-semibold transform hover:scale-105 disabled:transform-none"
            >
              {loading && decisionType === "approve" ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCheck className="text-lg" />
              )}
              Approve
            </button>

            <button
              onClick={() => handleDecisionClick("reject")}
              disabled={loading && decisionType === "reject"}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none font-semibold transform hover:scale-105 disabled:transform-none"
            >
              {loading && decisionType === "reject" ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaTimes className="text-lg" />
              )}
              Reject
            </button>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDecisionForm;
