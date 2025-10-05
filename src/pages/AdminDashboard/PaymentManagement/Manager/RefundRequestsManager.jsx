import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { listRefunds } from "../../../../services/paymentApi/paymentApi";
import axiosInstance from "../../../../utils/axiosInstance";

const RefundRequestsManager = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchRefunds = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filters,
      };

      const response = await listRefunds(params);
      const data = response.data;

      setRefundRequests(data.results || []);
      setTotalPages(Math.ceil(data.count / pageSize));
      setTotalCount(data.count);
      setCurrentPage(page);
    } catch (error) {
      toast.error("Failed to fetch refund requests");
      console.error("Error fetching refunds:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds(1);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (searchTerm) filters.search = searchTerm;

    fetchRefunds(1, filters);
  }, [statusFilter, searchTerm]);

  const handleUpdateStatus = async (refundId, action) => {
    setActionLoading(refundId);
    try {
      await axiosInstance.post(
        `/new-payments/refunds/${refundId}/update-status/`,
        {
          action: action,
          admin_notes: adminNotes || getDefaultAdminNotes(action),
        }
      );

      toast.success(`Refund ${action} successfully`);
      setShowDecisionModal(false);
      setSelectedRefund(null);
      setAdminNotes("");

      // Refresh current page
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (searchTerm) filters.search = searchTerm;
      fetchRefunds(currentPage, filters);
    } catch (error) {
      toast.error(`Failed to ${action} refund`);
      console.error("Error updating refund status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getDefaultAdminNotes = (action) => {
    const notes = {
      approve: "Refund approved, will process within 24 hours",
      process: "Refund Processed",
      reject: "Refund rejected as per policy",
    };
    return notes[action] || "";
  };

  const handleOpenDecisionModal = (refund, action) => {
    setSelectedRefund(refund);
    setAdminNotes(getDefaultAdminNotes(action));
    setShowDecisionModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      processed: { color: "bg-blue-100 text-blue-800", label: "Processed" },
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

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "change") {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (searchTerm) filters.search = searchTerm;
      fetchRefunds(1, filters);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
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
              if (searchTerm) filters.search = searchTerm;
              fetchRefunds(currentPage - 1, filters);
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
              if (searchTerm) filters.search = searchTerm;
              fetchRefunds(currentPage + 1, filters);
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
                {refundRequests.length > 0
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
                  if (searchTerm) filters.search = searchTerm;
                  fetchRefunds(currentPage - 1, filters);
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
                      if (searchTerm) filters.search = searchTerm;
                      fetchRefunds(pageNum, filters);
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
                  if (searchTerm) filters.search = searchTerm;
                  fetchRefunds(currentPage + 1, filters);
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
        <h2 className="text-2xl font-bold text-gray-800">Refund Requests</h2>
        <button
          onClick={() => {
            const filters = {};
            if (statusFilter) filters.status = statusFilter;
            if (searchTerm) filters.search = searchTerm;
            fetchRefunds(currentPage, filters);
          }}
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      {/* Filters */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search input */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Reason..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processed">Processed</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                fetchRefunds(1); // Refresh list with no filters
              }}
              className="w-full md:w-auto bg-white border border-orange-300 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Refund Requests Table */}
      <div className="bg-white border border-orange-200 rounded-lg overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-orange-200">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Order & Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                  Status
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
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  </td>
                </tr>
              ) : refundRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">
                      No refund requests found
                    </p>
                  </td>
                </tr>
              ) : (
                refundRequests.map((refund) => (
                  <tr
                    key={refund.id}
                    className="hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{refund.order_id?.substring(0, 8)}...
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {refund.reason}
                        </div>
                        {refund.admin_notes && (
                          <div className="text-xs text-gray-400 mt-1">
                            Admin: {refund.admin_notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-orange-600">
                        ₹{parseFloat(refund.amount).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(refund.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(refund.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {refund.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleOpenDecisionModal(refund, "approve")
                            }
                            disabled={actionLoading === refund.id}
                            className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                            title="Approve Refund"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleOpenDecisionModal(refund, "reject")
                            }
                            disabled={actionLoading === refund.id}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                            title="Reject Refund"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {refund.status === "approved" && (
                        <button
                          onClick={() =>
                            handleOpenDecisionModal(refund, "process")
                          }
                          disabled={actionLoading === refund.id}
                          className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50"
                          title="Process Refund"
                        >
                          Process
                        </button>
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

      {/* Decision Modal */}
      {showDecisionModal && selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-lg">
              <h3 className="text-xl font-bold">
                {selectedRefund.status === "pending"
                  ? "Refund Decision"
                  : "Process Refund"}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter your notes..."
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowDecisionModal(false);
                    setSelectedRefund(null);
                    setAdminNotes("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const action =
                      selectedRefund.status === "pending"
                        ? adminNotes.includes("reject")
                          ? "reject"
                          : "approve"
                        : "process";
                    handleUpdateStatus(selectedRefund.id, action);
                  }}
                  disabled={actionLoading === selectedRefund.id}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center"
                >
                  {actionLoading === selectedRefund.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundRequestsManager;
