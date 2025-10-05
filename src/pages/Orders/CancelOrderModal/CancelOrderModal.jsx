import React, { useState } from "react";

const CancelOrderModal = ({ isOpen, onClose, onConfirm, order }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleSubmit = () => {
    if (!selectedReason) return;

    let finalReason = selectedReason;
    if (selectedReason === "Other" && customReason.trim()) {
      finalReason = `Other: ${customReason.trim()}`;
    }

    onConfirm(finalReason);
    setSelectedReason("");
    setCustomReason("");
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Order</h3>
        <p className="text-gray-600 mb-4 font-medium">
          Are you sure you want to cancel this order?
        </p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for cancellation:
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
          >
            <option value="">Select a reason</option>
            <option value="No Longer Required">No Longer Required</option>
            <option value="I ordered the wrong size">
              I ordered the wrong size
            </option>
            <option value="Found a better deal">Found a better deal</option>
            <option value="Changed my mind">Changed my mind</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {selectedReason === "Other" && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Please specify the reason:
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter your reason here..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium resize-none"
              rows="3"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !selectedReason ||
              (selectedReason === "Other" && !customReason.trim())
            }
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
