import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaQrcode,
  FaCreditCard,
  FaHistory,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  adminPaymentDecision,
  sendOrderPaymentReminder,
  listAdminPayments,
} from "../../../../services/paymentApi/paymentApi";
import QRProofModal from "../../OrderManagement/Model/QRProofModal";
import PaymentDecisionForm from "../../OrderManagement/Model/PaymentDecisionForm";
import ReminderHistoryModal from "../../OrderManagement/Model/ReminderHistoryModal";
import ReminderFormModal from "../Model/ReminderFormModal";

const PaymentRequestsTable = ({ onRefresh }) => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [showReminderForm, setShowReminderForm] = useState(null);
  const [showReminderHistory, setShowReminderHistory] = useState(null);
  const [reminderFormData, setReminderFormData] = useState({
    reminder_type: "payment_pending",
    custom_message: "",
  });

  const fetchPaymentRequests = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filters,
      };

      const response = await listAdminPayments(params);
      const data = response.data;
      setPaymentRequests(data.results || []);
      setTotalPages(Math.ceil(data.count / pageSize));
      setTotalCount(data.count);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Failed to fetch payment requests");
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentRequests(1);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (modeFilter) filters.mode = modeFilter;
    if (searchTerm) filters.search = searchTerm;

    fetchPaymentRequests(1, filters);
  }, [statusFilter, modeFilter, searchTerm]);

  const handleOpenReminderForm = (payment) => {
    // Only show reminder for payments that are still pending (user hasn't completed payment)
    if (payment.status !== "pending") {
      toast.info("Reminder can only be sent for pending payments");
      return;
    }

    const defaultMessage = getDefaultReminderMessage(payment);
    setReminderFormData({
      reminder_type: "payment_pending",
      custom_message: defaultMessage,
    });
    setShowReminderForm(payment.id);
  };

  const getDefaultReminderMessage = (payment) => {
    const orderIdShort = String(payment.order_id || "").substring(0, 8);
    const amount = parseFloat(payment.amount || 0).toLocaleString("en-IN");

    if (payment.mode === "UPI") {
      return `Dear Customer, we noticed that your UPI payment of ₹${amount} for order #${orderIdShort} is still pending. Please complete the payment using the provided UPI details to proceed with your order. Thank you for your business!`;
    } else {
      return `Dear Customer, we noticed that your COD order #${orderIdShort} for ₹${amount} is pending confirmation. Please confirm your order to proceed with delivery. Thank you for your business!`;
    }
  };

  const handleSendReminder = async (paymentId) => {
    setActionLoading(`reminder-${paymentId}`);
    try {
      const payment = paymentRequests.find((p) => p.id === paymentId);
      await sendOrderPaymentReminder({
        order_id: payment?.order_id,
        reminder_type: reminderFormData.reminder_type,
        custom_message: reminderFormData.custom_message,
      });
      toast.success("Payment reminder sent successfully");
      setShowReminderForm(null);
      setReminderFormData({
        reminder_type: "payment_pending",
        custom_message: "",
      });
    } catch (error) {
      toast.error("Failed to send reminder");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProof = (payment) => {
    setSelectedPayment(payment);
    setShowQRModal(true);
  };

  const handleMakeDecision = (payment) => {
    setSelectedPayment(payment);
    setShowDecisionForm(true);
  };

  const handleDecision = async (action, notes = "") => {
    if (!selectedPayment) return;

    setActionLoading("decision");
    try {
      await adminPaymentDecision(selectedPayment.id, action, notes);
      toast.success(
        `Payment ${action === "approve" ? "approved" : "rejected"} successfully`
      );
      setShowDecisionForm(false);
      setSelectedPayment(null);

      // Refresh current page with filters
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (modeFilter) filters.mode = modeFilter;
      if (searchTerm) filters.search = searchTerm;
      fetchPaymentRequests(currentPage, filters);
    } catch (error) {
      toast.error(`Failed to ${action} payment: ${error.message}`);
    } finally {
      setActionLoading(null);
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

  const getModeBadge = (mode) => {
    return mode === "UPI" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        UPI
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        COD
      </span>
    );
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "change") {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (modeFilter) filters.mode = modeFilter;
      if (searchTerm) filters.search = searchTerm;
      fetchPaymentRequests(1, filters);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleModeFilterChange = (e) => {
    setModeFilter(e.target.value);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-orange-200 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => {
              const filters = {};
              if (statusFilter) filters.status = statusFilter;
              if (modeFilter) filters.mode = modeFilter;
              if (searchTerm) filters.search = searchTerm;
              fetchPaymentRequests(currentPage - 1, filters);
            }}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => {
              const filters = {};
              if (statusFilter) filters.status = statusFilter;
              if (modeFilter) filters.mode = modeFilter;
              if (searchTerm) filters.search = searchTerm;
              fetchPaymentRequests(currentPage + 1, filters);
            }}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {paymentRequests.length > 0
                  ? (currentPage - 1) * pageSize + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => {
                  const filters = {};
                  if (statusFilter) filters.status = statusFilter;
                  if (modeFilter) filters.mode = modeFilter;
                  if (searchTerm) filters.search = searchTerm;
                  fetchPaymentRequests(currentPage - 1, filters);
                }}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <FaChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      const filters = {};
                      if (statusFilter) filters.status = statusFilter;
                      if (modeFilter) filters.mode = modeFilter;
                      if (searchTerm) filters.search = searchTerm;
                      fetchPaymentRequests(pageNum, filters);
                    }}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNum
                        ? "bg-orange-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  const filters = {};
                  if (statusFilter) filters.status = statusFilter;
                  if (modeFilter) filters.mode = modeFilter;
                  if (searchTerm) filters.search = searchTerm;
                  fetchPaymentRequests(currentPage + 1, filters);
                }}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <FaChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Payment Requests</h2>
        <button
          onClick={() => {
            const filters = {};
            if (statusFilter) filters.status = statusFilter;
            if (modeFilter) filters.mode = modeFilter;
            if (searchTerm) filters.search = searchTerm;
            fetchPaymentRequests(currentPage, filters);
          }}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div>
            <select
              value={modeFilter}
              onChange={handleModeFilterChange}
              className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Modes</option>
              <option value="UPI">UPI</option>
              <option value="COD">COD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white border border-orange-200 rounded-lg overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-orange-200">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Order & User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Mode & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Payment Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  </td>
                </tr>
              ) : paymentRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FaCreditCard className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">
                      No payment requests found
                    </p>
                  </td>
                </tr>
              ) : (
                paymentRequests.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{String(payment.order_id || "").substring(0, 8)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.user}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-orange-600">
                        ₹
                        {parseFloat(payment.amount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getModeBadge(payment.mode)}
                        {getStatusBadge(payment.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          {payment.payment_completed ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                          <span>
                            Payment{" "}
                            {payment.payment_completed
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </div>
                        {payment.requires_action && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Action Required
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {payment.mode === "UPI" &&
                        payment.upi_proof_image_url && (
                          <button
                            onClick={() => handleViewProof(payment)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Payment Proof"
                          >
                            <FaQrcode />
                          </button>
                        )}

                      {(payment.status === "submitted" ||
                        payment.status === "pending") && (
                        <button
                          onClick={() => handleMakeDecision(payment)}
                          disabled={actionLoading === "decision"}
                          className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                          title="Make Decision"
                        >
                          <FaCheck />
                        </button>
                      )}

                      {/* Show reminder button only for pending payments (user hasn't completed payment) */}
                      {payment.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleOpenReminderForm(payment)}
                            disabled={
                              actionLoading === `reminder-${payment.id}`
                            }
                            className="text-orange-600 hover:text-orange-900 transition-colors disabled:opacity-50"
                            title="Send Reminder"
                          >
                            <FaEnvelope />
                          </button>
                          <button
                            onClick={() =>
                              setShowReminderHistory(payment.order_id)
                            }
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Reminder History"
                          >
                            <FaHistory />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </div>

      {/* Modals */}
      {showQRModal && selectedPayment && (
        <QRProofModal
          isOpen={showQRModal}
          onClose={() => {
            setShowQRModal(false);
            setSelectedPayment(null);
          }}
          order={{
            id: String(selectedPayment.order_id || ""),
            user: { full_name: selectedPayment.user },
          }}
          paymentRequests={[selectedPayment]}
          loading={false}
          toast={toast}
          onRefresh={() => {
            const filters = {};
            if (statusFilter) filters.status = statusFilter;
            if (modeFilter) filters.mode = modeFilter;
            if (searchTerm) filters.search = searchTerm;
            fetchPaymentRequests(currentPage, filters);
          }}
        />
      )}

      {showDecisionForm && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <PaymentDecisionForm
              paymentRequest={selectedPayment}
              onDecision={handleDecision}
              onCancel={() => {
                setShowDecisionForm(false);
                setSelectedPayment(null);
              }}
              loading={actionLoading === "decision"}
            />
          </div>
        </div>
      )}

      {/* Use the reusable ReminderFormModal */}
      {showReminderForm && (
        <ReminderFormModal
          isOpen={!!showReminderForm}
          onClose={() => setShowReminderForm(null)}
          onSubmit={handleSendReminder}
          formData={reminderFormData}
          setFormData={setReminderFormData}
          loading={actionLoading === `reminder-${showReminderForm}`}
          order={paymentRequests.find((p) => p.id === showReminderForm)}
          title="Send Payment Reminder"
          submitButtonText="Send Reminder"
        />
      )}

      {showReminderHistory && (
        <ReminderHistoryModal
          isOpen={!!showReminderHistory}
          onClose={() => setShowReminderHistory(null)}
          order={{ id: showReminderHistory }}
        />
      )}
    </div>
  );
};

export default PaymentRequestsTable;
