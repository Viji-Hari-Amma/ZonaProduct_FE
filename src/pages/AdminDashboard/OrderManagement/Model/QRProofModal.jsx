// components/QRProofModal.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaDownload,
  FaExpand,
  FaQrcode,
  FaReceipt,
  FaCheck,
} from "react-icons/fa";
import { adminPaymentDecision } from "../../../../services/paymentApi/paymentApi";
import PaymentDecisionForm from "./PaymentDecisionForm";

const QRProofModal = ({
  isOpen,
  onClose,
  order,
  paymentRequests,
  loading,
  toast,
  onRefresh,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [showDecisionForm, setShowDecisionForm] = useState(false);

  // Find payment request for this order
  const paymentRequest = paymentRequests?.find(
    (pr) => pr.order_id === order?.id
  );

  useEffect(() => {
    if (isOpen && paymentRequest?.upi_proof_image_url) {
      setSelectedImage(paymentRequest.upi_proof_image_url);
      setImageLoading(true);
      setAdminNotes("");
      setShowDecisionForm(false);
    }
  }, [isOpen, paymentRequest]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    toast.error("Failed to load payment proof image");
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement("a");
      link.href = selectedImage;
      link.download = `payment-proof-${order?.id?.substring(0, 8)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Payment proof downloaded successfully!");
    }
  };

  const handleFullscreen = () => {
    if (selectedImage) {
      const newWindow = window.open(selectedImage, "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  const handleDecision = async (action) => {
    if (!paymentRequest?.id) {
      toast.error("Payment request ID not found");
      return;
    }

    setDecisionLoading(true);
    try {
      const result = await adminPaymentDecision(
        paymentRequest.id,
        action,
        adminNotes ||
          (action === "approve"
            ? "Payment verified successfully"
            : "Payment verification failed")
      );

      toast.success(
        action === "approve"
          ? "Payment approved successfully!"
          : "Payment rejected successfully!"
      );

      // Close modal + refresh
      setShowDecisionForm(false);
      onClose();
      onRefresh();
    } catch (error) {
      console.error("Error making decision:", error);
      toast.error(`Failed to ${action} payment: ${error.message}`);
    } finally {
      setDecisionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaQrcode className="text-xl" />
            <div>
              <h3 className="text-lg font-bold">Payment Proof Details</h3>
              <p className="text-blue-100 text-sm">
                Order: #{order?.id?.substring(0, 8)}... | Customer:{" "}
                {order?.user?.full_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 text-xl font-bold transition-colors"
            disabled={decisionLoading}
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading payment details...</p>
            </div>
          ) : !paymentRequest ? (
            // No payment request found
            <div className="text-center py-12">
              <FaReceipt className="text-4xl text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                No Payment Request Found
              </h4>
              <p className="text-gray-500">
                No payment request found for this order.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Proof Image */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Payment Proof
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDownload}
                        disabled={!selectedImage || imageLoading}
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                      >
                        <FaDownload />
                        Download
                      </button>
                      <button
                        onClick={handleFullscreen}
                        disabled={!selectedImage || imageLoading}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                      >
                        <FaExpand />
                        Fullscreen
                      </button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-center min-h-[300px]">
                    {paymentRequest.upi_proof_image_url ? (
                      <div className="relative">
                        {imageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        )}
                        <img
                          src={paymentRequest.upi_proof_image_url}
                          alt="Payment Proof"
                          className={`max-w-full max-h-[400px] rounded-lg shadow-lg ${
                            imageLoading ? "opacity-0" : "opacity-100"
                          } transition-opacity`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <FaReceipt className="text-4xl mx-auto mb-3" />
                        <p>No payment proof image available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Payment Information
                  </h4>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">
                          Amount
                        </p>
                        <p className="text-lg font-bold text-blue-800">
                          ₹
                          {parseFloat(paymentRequest.amount).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">
                          Status
                        </p>
                        {getStatusBadge(paymentRequest.status)}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Payment Mode
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {paymentRequest.mode}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Payment Request ID
                        </p>
                        <p className="text-gray-800 font-mono text-sm">
                          {paymentRequest.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Created Date
                        </p>
                        <p className="text-gray-800">
                          {new Date(
                            paymentRequest.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {paymentRequest.notes && (
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Customer Notes
                          </p>
                          <p className="text-gray-800">
                            {paymentRequest.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Information */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-orange-800 mb-2">
                        Order Information
                      </h5>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-orange-700 font-medium">
                            Order ID:
                          </span>{" "}
                          {order?.id}
                        </p>
                        <p>
                          <span className="text-orange-700 font-medium">
                            Customer:
                          </span>{" "}
                          {order?.user?.full_name}
                        </p>
                        <p>
                          <span className="text-orange-700 font-medium">
                            Email:
                          </span>{" "}
                          {order?.contact_info?.email}
                        </p>
                        <p>
                          <span className="text-orange-700 font-medium">
                            Phone:
                          </span>{" "}
                          {order?.contact_info?.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision Actions - Only show for pending/submitted payments */}
              {(paymentRequest.status === "submitted" ||
                paymentRequest.status === "pending") && (
                <div className="border-t pt-6">
                  {!showDecisionForm ? (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setShowDecisionForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        <FaCheck />
                        Make Decision
                      </button>
                    </div>
                  ) : (
                    <PaymentDecisionForm
                      paymentRequest={paymentRequest}
                      onDecision={handleDecision}
                      onCancel={() => setShowDecisionForm(false)}
                      loading={decisionLoading}
                      adminNotes={adminNotes}
                      setAdminNotes={setAdminNotes}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRProofModal;
