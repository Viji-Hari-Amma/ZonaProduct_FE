import React, { useEffect, useState } from "react";
import {
  listOrders,
  cancelOrder,
  requestRefund,
} from "../../services/orderApi/orderApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tabs from "./Tabs/Tabs";
import OrderSection from "./OrderSection/OrderSection";
import CancelOrderModal from "./CancelOrderModal/CancelOrderModal";
import PaymentModal from "../CheckoutPage/PaymentModal/PaymentModal";
import SearchBar from "./SearchBar/SearchBar";
import {
  FaClipboardList,
  FaHistory,
  FaBan,
  FaCreditCard,
  FaChevronLeft,
  FaChevronRight,
  FaSync,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  createPayment,
  getUPISettings,
  uploadPaymentProof,
  reuploadPaymentProof,
  createRepayment,
} from "../../services/paymentApi/paymentApi";
import RateProductModal from "./RateProductModal";
import {
  createReview,
  deleteReview,
  listProductReviews,
  updateReview,
} from "../../services/reviewApi/reviewApi";

export const Orders = () => {
  const [orders, setOrders] = useState({
    current: [],
    pending_payment: [],
    previous: [],
    cancelled: [],
    upi_pending: [],
    cod_orders: [],
  });

  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState({
    current: false,
    pending_payment: false,
    previous: false,
    cancelled: false,
    upi_pending: false,
    cod_orders: false,
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  // Rate Product Modal State
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // Server-side pagination state
  const [pagination, setPagination] = useState({
    current: { page: 1, totalPages: 1, totalCount: 0, pageSize: 9 },
    pending_payment: { page: 1, totalPages: 1, totalCount: 0, pageSize: 9 },
    previous: { page: 1, totalPages: 1, totalCount: 0, pageSize: 9 },
    cancelled: { page: 1, totalPages: 1, totalCount: 0, pageSize: 9 },
    upi_pending: { page: 1, totalPages: 1, totalCount: 0, pageSize: 9 },
    cod_orders: { page: 1, totalPages: 1, totalCount: 0, pageSize: 9 },
  });

  // Payment state management
  const [paymentMethod, setPaymentMethod] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [upiSettings, setUpiSettings] = useState(null);

  // Repayment state
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [selectedOrderForRepay, setSelectedOrderForRepay] = useState(null);
  const [repaymentScreenshot, setRepaymentScreenshot] = useState(null);
  const [repayLoading, setRepayLoading] = useState(false);

  const navigate = useNavigate();

  // Map tabs to API filter types
  const tabToFilterMap = {
    current: "active",
    pending_payment: "payment_pending",
    previous: "delivered",
    cancelled: "cancelled",
    upi_pending: "upi_pending",
    cod_orders: "cod_orders",
  };

  // Fetch orders for specific tab with pagination
  const fetchOrdersForTab = async (tabKey, page = 1) => {
    try {
      setLoading((prev) => ({ ...prev, [tabKey]: true }));
      const filterType = tabToFilterMap[tabKey];
      const pageSize = pagination[tabKey]?.pageSize || 9;

      const response = await listOrders(filterType, page, pageSize);

      // Handle the API response structure
      let ordersData = [];
      let totalPages = 1;
      let totalCount = 0;

      if (response && typeof response === "object") {
        if (Array.isArray(response.results)) {
          ordersData = response.results;
          totalPages = response.total_pages || 1;
          totalCount = response.total_count || 0;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
          totalPages = response.total_pages || 1;
          totalCount = response.total_count || 0;
        } else if (Array.isArray(response.orders)) {
          ordersData = response.orders;
          totalPages = response.total_pages || 1;
          totalCount = response.total_count || 0;
        } else {
          ordersData = [response];
        }
      }

      // Filter out invalid orders but keep orders with empty items
      const validOrders = ordersData.filter((order) => order && order.id);

      setOrders((prev) => ({
        ...prev,
        [tabKey]: validOrders,
      }));

      // Update pagination info for this tab
      setPagination((prev) => ({
        ...prev,
        [tabKey]: {
          ...prev[tabKey],
          page: page,
          totalPages: totalPages,
          totalCount: totalCount,
        },
      }));
    } catch (error) {
      console.error(`Error fetching ${tabKey} orders:`, error);
      toast.error(`Failed to load ${tabKey.replace("_", " ")} orders`);
      setOrders((prev) => ({
        ...prev,
        [tabKey]: [],
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [tabKey]: false }));
    }
  };

  // Fetch all orders when component mounts
  useEffect(() => {
    // Fetch initial tab data
    fetchOrdersForTab(activeTab, 1);

    // Also fetch current orders for search functionality
    fetchOrdersForTab("current", 1);
  }, []);

  // Fetch orders when tab changes
  useEffect(() => {
    // When tab changes, fetch first page of the new tab
    fetchOrdersForTab(activeTab, 1);
  }, [activeTab]);

  // Fetch UPI settings when payment modal opens
  useEffect(() => {
    const fetchUPISettings = async () => {
      if (showPaymentModal) {
        try {
          const response = await getUPISettings();
          const activeUPI = Array.isArray(response.data)
            ? response.data.find((setting) => setting.is_active)
            : null;
          setUpiSettings(activeUPI || null);
        } catch (error) {
          console.error("Error fetching UPI settings:", error);
          toast.error("Failed to load UPI settings");
        }
      }
    };

    fetchUPISettings();
  }, [showPaymentModal]);

  // Enhanced order selection
  const handleOrderSelect = (order) => {
    if (!order || !order.id) return;

    // Determine which tab this order belongs to
    let targetTab = "current";

    if (order.status === "Cancelled") {
      targetTab = "cancelled";
    } else if (order.status === "Delivered") {
      targetTab = "previous";
    } else if (
      order.payment_status === "pending" &&
      order.status !== "Cancelled"
    ) {
      targetTab = "pending_payment";
    } else if (
      order.payment_mode === "UPI" &&
      order.payment_status === "submitted"
    ) {
      targetTab = "upi_pending";
    } else if (order.payment_mode === "COD") {
      targetTab = "cod_orders";
    }

    // Switch to the target tab
    setActiveTab(targetTab);

    // Since we're using server-side pagination, we need to search for the order
    fetchOrdersForTab(targetTab, 1);

    // Scroll to order after a delay to allow data to load
    setTimeout(() => {
      const orderElement = document.getElementById(`order-${order.id}`);
      if (orderElement) {
        orderElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Highlight the order
        orderElement.classList.add(
          "ring-4",
          "ring-orange-400",
          "bg-orange-50",
          "transform",
          "scale-105"
        );

        setTimeout(() => {
          orderElement.classList.remove(
            "ring-4",
            "ring-orange-400",
            "bg-orange-50",
            "transform",
            "scale-105"
          );
        }, 3000);
      }
    }, 1000);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    // Fetch first page when tab changes
    fetchOrdersForTab(tabKey, 1);
  };

  const handleFilterChange = (newFilters) => {
    // When filters change, fetch first page
    fetchOrdersForTab(activeTab, 1);
  };

  const handleCancelOrderClick = (order) => {
    if (!order || !order.id) return;
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleMakePaymentClick = (order) => {
    if (!order || !order.id) return;
    setSelectedOrderForPayment(order);
    setPaymentMethod("");
    setScreenshot(null);
    setShowPaymentModal(true);
  };

  // New function to handle repay button click
  const handleRepayClick = (order) => {
    if (!order || !order.id) return;
    setSelectedOrderForRepay(order);
    setRepaymentScreenshot(null);
    setShowRepayModal(true);
  };

  // Handle Rate Product Click - FIXED VERSION with proper review detection
  const handleRateClick = async (order, product) => {
    if (!order || !product?.product_id) {
      console.error("Invalid order or product data for rating");
      return;
    }

    setLoadingReview(true);
    try {
      // Fetch existing review for this product
      const response = await listProductReviews(product.product_id);
      const reviews = response?.data || response || [];

      // Get current user email for matching
      const currentUserEmail = localStorage.getItem("userEmail");

      console.log("Fetched reviews:", reviews);
      console.log("Current user email:", currentUserEmail);

      // Find the user's review for this product by email
      const userReview = Array.isArray(reviews)
        ? reviews.find((review) => review.user_email === currentUserEmail)
        : null;

      console.log("Found user review:", userReview);

      // Set selected review data
      setSelectedReview({
        orderId: order.id,
        product: {
          id: product.product_id,
          name: product.product_name,
          image_url: product.image_url,
        },
        initialRating: userReview?.rating || 0,
        initialComment: userReview?.comment || "",
        reviewId: userReview?.id || null,
        hasExistingReview: !!userReview,
      });

      // Open modal
      setShowRateModal(true);
    } catch (error) {
      console.error("Failed to fetch user review:", error);
      toast.error("Failed to load review data");

      // Still open modal with empty state
      setSelectedReview({
        orderId: order.id,
        product: {
          id: product.product_id,
          name: product.product_name,
          image_url: product.image_url,
        },
        initialRating: 0,
        initialComment: "",
        reviewId: null,
        hasExistingReview: false,
      });
      setShowRateModal(true);
    } finally {
      setLoadingReview(false);
    }
  };

  // Handle Review Submission - FIXED VERSION
  const handleReviewSubmit = async (reviewData) => {
    try {
      console.log("Submitting review:", reviewData);

      if (!reviewData.productId) {
        toast.error("Product information is missing");
        return;
      }

      if (selectedReview?.hasExistingReview && selectedReview?.reviewId) {
        // Update existing review
        await updateReview(reviewData.productId, selectedReview.reviewId, {
          rating: reviewData.rating,
          comment: reviewData.comment,
        });
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        await createReview(reviewData.productId, {
          rating: reviewData.rating,
          comment: reviewData.comment,
        });
        toast.success("Review submitted successfully!");
      }

      setShowRateModal(false);
      setSelectedReview(null);

      // Refresh orders to reflect the new review state
      fetchOrdersForTab(activeTab, pagination[activeTab].page);
    } catch (error) {
      console.error("Review operation failed:", error);

      // More specific error messages
      if (error.response?.status === 401) {
        toast.error("Please login to submit a review");
      } else if (error.response?.status === 400) {
        toast.error("Invalid review data. Please check your input.");
      } else if (error.response?.status === 404) {
        toast.error("Product not found");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    }
  };

  // Handle Review Deletion - FIXED VERSION
  const handleReviewDelete = async () => {
    if (!selectedReview?.reviewId || !selectedReview?.product?.id) {
      toast.error("No review to delete");
      return;
    }

    try {
      console.log("Deleting review:", selectedReview.reviewId);

      await deleteReview(selectedReview.product.id, selectedReview.reviewId);
      toast.success("Review deleted successfully!");

      setShowRateModal(false);
      setSelectedReview(null);

      // Refresh orders to reflect the deleted review
      fetchOrdersForTab(activeTab, pagination[activeTab].page);
    } catch (error) {
      console.error("Review deletion failed:", error);

      // More specific error messages
      if (error.response?.status === 404) {
        toast.error("Review not found");
      } else if (error.response?.status === 403) {
        toast.error("You are not authorized to delete this review");
      } else {
        toast.error("Failed to delete review. Please try again.");
      }
    }
  };

  const handleOrderCancel = async (orderId, reason) => {
    try {
      await cancelOrder(orderId, reason);
      const orderToCancel = Object.values(orders)
        .flat()
        .find((order) => order.id === orderId);

      if (orderToCancel && orderToCancel.payment_mode === "UPI") {
        try {
          await requestRefund(orderId, reason);
          toast.success("Order cancelled and refund requested successfully");
        } catch (refundError) {
          console.error("Error requesting refund:", refundError);
          toast.error("Order cancelled but refund request failed");
        }
      } else {
        toast.success("Order cancelled successfully");
      }

      // Refresh the current tab to reflect changes
      fetchOrdersForTab(activeTab, pagination[activeTab].page);

      setShowCancelModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handlePaymentConfirm = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (paymentMethod === "UPI" && (!screenshot || !upiSettings)) {
      toast.error("Please upload payment screenshot");
      return;
    }

    try {
      setPaymentLoading(true);

      const paymentData = {
        order: selectedOrderForPayment.id,
        amount: parseFloat(selectedOrderForPayment.total_amount || 0),
        mode: paymentMethod,
      };

      const paymentResponse = await createPayment(paymentData);
      const payment = paymentResponse.data;

      if (paymentMethod === "UPI" && screenshot) {
        await uploadPaymentProof(payment.id, screenshot);
      }

      toast.success("Payment completed successfully!");

      // Close modal
      setShowPaymentModal(false);
      setSelectedOrderForPayment(null);
      setPaymentMethod("");
      setScreenshot(null);

      // Refresh current tab orders after payment
      fetchOrdersForTab(activeTab, pagination[activeTab].page);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedOrderForPayment(null);
    setPaymentMethod("");
    setScreenshot(null);
  };

  // New function to handle re-upload proof
  const handleReuploadProof = async () => {
    if (!repaymentScreenshot) {
      toast.error("Please select a payment screenshot");
      return;
    }

    if (!selectedOrderForRepay?.payment_request_info?.id) {
      toast.error("Payment information not available");
      return;
    }

    setRepayLoading(true);
    try {
      await reuploadPaymentProof(
        selectedOrderForRepay.payment_request_info.id,
        repaymentScreenshot
      );
      toast.success("Payment proof re-uploaded successfully!");
      setShowRepayModal(false);
      setRepaymentScreenshot(null);
      setSelectedOrderForRepay(null);

      // Refresh orders to update status
      fetchOrdersForTab(activeTab, pagination[activeTab].page);
    } catch (error) {
      console.error("Re-upload failed:", error);
      toast.error("Failed to re-upload payment proof");
    } finally {
      setRepayLoading(false);
    }
  };

  // New function to handle create new payment request
  const handleCreateNewPayment = async (paymentMode = "UPI") => {
    if (!selectedOrderForRepay?.id) {
      toast.error("Order information not available");
      return;
    }

    setRepayLoading(true);
    try {
      await createRepayment({
        order_id: selectedOrderForRepay.id,
        payment_mode: paymentMode,
      });
      toast.success("New payment request created successfully!");
      setShowRepayModal(false);
      setSelectedOrderForRepay(null);

      // Refresh orders to update status
      fetchOrdersForTab(activeTab, pagination[activeTab].page);
    } catch (error) {
      console.error("Create repayment failed:", error);
      toast.error("Failed to create new payment request");
    } finally {
      setRepayLoading(false);
    }
  };

  const refreshOrders = () => {
    fetchOrdersForTab(activeTab, pagination[activeTab].page);
    toast.info("Refreshing orders...");
  };

  // Server-side pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination[activeTab].totalPages) return;
    fetchOrdersForTab(activeTab, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Server-side Pagination component
  const Pagination = () => {
    const currentTabPagination = pagination[activeTab];
    const currentPage = currentTabPagination?.page || 1;
    const totalPages = currentTabPagination?.totalPages || 1;
    const totalCount = currentTabPagination?.totalCount || 0;
    const pageSize = currentTabPagination?.pageSize || 9;

    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalCount);

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-4 bg-white rounded-lg border border-orange-200">
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalCount} orders
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
            }`}
          >
            <FaChevronLeft />
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              // Show first page, last page, and pages around current page
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg border font-medium text-sm ${
                      currentPage === page
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white text-gray-700 border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 py-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-orange-600 border-orange-300 hover:bg-orange-50"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  // Repay Modal Component
  const RepayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-h-[75vh] overflow-y-scroll shadow-2xl w-full max-w-md mx-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#7C2D12] max-w-375:text-xl">
              Complete Payment Again
            </h2>
            <button
              onClick={() => {
                setShowRepayModal(false);
                setSelectedOrderForRepay(null);
                setRepaymentScreenshot(null);
              }}
              className="text-[#F97316] hover:text-[#DC2626]"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Order ID:{" "}
              <span className="font-semibold">{selectedOrderForRepay?.id}</span>
            </p>
            <p className="text-gray-600 mb-4">
              Amount:{" "}
              <span className="font-semibold">
                ₹{selectedOrderForRepay?.total_amount}
              </span>
            </p>

            {selectedOrderForRepay?.payment_info?.notes && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 text-justify">
                  <strong>Previous rejection reason:</strong>{" "}
                  {selectedOrderForRepay.payment_info.notes}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 border-2 border-[#F97316] bg-[#FFF5F0] rounded-lg">
              <h3 className="font-semibold mb-2">Re-upload Payment Proof</h3>
              <p className="text-gray-600 text-sm mb-3">
                Upload a new screenshot of your UPI payment
              </p>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Payment Screenshot
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#F97316]">
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                      <svg
                        className="w-6 h-6 text-gray-400 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">
                        Click to upload screenshot
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setRepaymentScreenshot(e.target.files[0])
                      }
                    />
                  </label>
                </div>

                {repaymentScreenshot && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      File selected: {repaymentScreenshot.name}
                    </p>
                    {repaymentScreenshot.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(repaymentScreenshot)}
                        alt="Payment Screenshot Preview"
                        className="mt-2 max-h-32 rounded-lg border border-gray-200 shadow-sm mx-auto"
                      />
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleReuploadProof}
                disabled={!repaymentScreenshot || repayLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {repayLoading ? "Uploading..." : "Re-upload Proof"}
              </button>
            </div>

            <div className="p-4 border-2 border-gray-200 rounded-lg">
              <h3 className="font-semibold mb-2">Create New Payment Request</h3>
              <p className="text-gray-600 text-sm mb-3">
                Start a fresh payment request (you can change payment method)
              </p>

              <div className="grid grid-cols-2 gap-2 max-w-375:flex max-w-375:flex-wrap">
                <button
                  onClick={() => handleCreateNewPayment("UPI")}
                  disabled={repayLoading}
                  className="bg-green-600 text-white py-2 px-4 max-w-375:px-2 max-w-375:w-full rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  New UPI Payment
                </button>
                <button
                  onClick={() => handleCreateNewPayment("COD")}
                  disabled={repayLoading}
                  className="bg-purple-600 text-white py-2 px-4 max-w-375:px-2 max-w-375:w-full rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
                >
                  Switch to COD
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const getTabLoading = () => loading[activeTab];

  // Get all orders for search functionality (use current orders as base)
  const getAllOrdersForSearch = () => {
    return Object.values(orders).flat();
  };

  if (getTabLoading()) {
    return (
      <div className="min-h-screen bg-orange-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 font-sans p-4 pt-[10vh] max-w-375:p-0 max-w-375:pt-[10vh]">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-6 max-w-375:mb-3">
          <h1 className="text-3xl font-bold text-orange-900 max-w-375:text-2xl">
            My Orders
          </h1>
          <button
            onClick={refreshOrders}
            className="bg-orange-500 text-white px-4 py-2 max-w-375:px-3 max-w-375:py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <FaSync className={`${getTabLoading() ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Search Bar with Filters */}
        <SearchBar
          orders={getAllOrdersForSearch()}
          onOrderSelect={handleOrderSelect}
          onFilterChange={handleFilterChange}
          placeholder="Search all orders by ID, product name, flavor, or status..."
        />

        <Tabs activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Current Orders */}
        {activeTab === "current" && (
          <>
            <OrderSection
              title="Active Orders"
              orders={orders.current}
              onCancelOrder={handleCancelOrderClick}
              onMakePayment={handleMakePaymentClick}
              onRepay={handleRepayClick}
              onRateClick={handleRateClick}
              emptyStateIcon={<FaClipboardList />}
              emptyStateMessage="You don't have any active orders"
              buttonText="Start Shopping"
              onButtonClick={() => navigate("/products")}
            />
            <Pagination />
          </>
        )}

        {/* Pending Payment Orders */}
        {activeTab === "pending_payment" && (
          <>
            <OrderSection
              title="Payment Pending"
              orders={orders.pending_payment}
              onCancelOrder={handleCancelOrderClick}
              onMakePayment={handleMakePaymentClick}
              onRepay={handleRepayClick}
              onRateClick={handleRateClick}
              showPaymentButton={true}
              emptyStateIcon={<FaCreditCard />}
              emptyStateMessage="You don't have any pending payments"
              buttonText="Start Shopping"
              onButtonClick={() => navigate("/products")}
            />
            <Pagination />
          </>
        )}

        {/* Previous Orders */}
        {activeTab === "previous" && (
          <>
            <OrderSection
              title="Delivered Orders"
              orders={orders.previous}
              onCancelOrder={handleCancelOrderClick}
              onRepay={handleRepayClick}
              onRateClick={handleRateClick}
              emptyStateIcon={<FaHistory />}
              emptyStateMessage="You don't have any delivered orders"
            />
            <Pagination />
          </>
        )}

        {/* Cancelled Orders */}
        {activeTab === "cancelled" && (
          <>
            <OrderSection
              title="Cancelled Orders"
              orders={orders.cancelled}
              onCancelOrder={handleCancelOrderClick}
              onRepay={handleRepayClick}
              onRateClick={handleRateClick}
              emptyStateIcon={<FaBan />}
              emptyStateMessage="You don't have any cancelled orders"
            />
            <Pagination />
          </>
        )}

        {/* UPI Pending Proof Orders */}
        {activeTab === "upi_pending" && (
          <>
            <OrderSection
              title="UPI Payment Pending"
              orders={orders.upi_pending}
              onCancelOrder={handleCancelOrderClick}
              onRepay={handleRepayClick}
              onRateClick={handleRateClick}
              emptyStateIcon={<FaCreditCard />}
              emptyStateMessage="You don't have any UPI payments pending verification"
              buttonText="Start Shopping"
              onButtonClick={() => navigate("/products")}
            />
            <Pagination />
          </>
        )}

        {/* COD Orders */}
        {activeTab === "cod_orders" && (
          <>
            <OrderSection
              title="Cash on Delivery Orders"
              orders={orders.cod_orders}
              onCancelOrder={handleCancelOrderClick}
              onRepay={handleRepayClick}
              onRateClick={handleRateClick}
              emptyStateIcon={<FaCreditCard />}
              emptyStateMessage="You don't have any COD orders"
              buttonText="Start Shopping"
              onButtonClick={() => navigate("/products")}
            />
            <Pagination />
          </>
        )}
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedOrder(null);
        }}
        onConfirm={(reason) => handleOrderCancel(selectedOrder?.id, reason)}
        order={selectedOrder}
      />

      {/* Payment Modal */}
      {showPaymentModal && selectedOrderForPayment && (
        <PaymentModal
          orderId={selectedOrderForPayment.id}
          amount={parseFloat(selectedOrderForPayment.total_amount || 0)}
          items={selectedOrderForPayment.items || []}
          subtotal={null}
          paymentMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
          screenshot={screenshot}
          onScreenshotChange={setScreenshot}
          onConfirm={handlePaymentConfirm}
          onClose={handleClosePaymentModal}
          loading={paymentLoading}
          upiSettings={upiSettings}
          address={selectedOrderForPayment.address_details}
        />
      )}

      {/* Repay Modal */}
      {showRepayModal && <RepayModal />}

      {/* Rate Product Modal - Rendered at root level */}
      {showRateModal && selectedReview && (
        <RateProductModal
          isOpen={showRateModal}
          onClose={() => {
            setShowRateModal(false);
            setSelectedReview(null);
          }}
          onSubmit={handleReviewSubmit}
          onUpdate={handleReviewSubmit} // Use the same handler for both
          onDelete={handleReviewDelete}
          product={selectedReview.product}
          orderId={selectedReview.orderId}
          initialRating={selectedReview.initialRating}
          initialComment={selectedReview.initialComment}
          hasExistingReview={selectedReview.hasExistingReview}
          isLoading={loadingReview}
        />
      )}
    </div>
  );
};
