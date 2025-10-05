// components/OrderManagement/OrderManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getOrderSummary,
  listAllOrders,
  updateOrderStatus,
} from "../../../services/orderApi/orderApi";
import LoadingSpinner from "./Loader/LoadingSpinner";
import OrderStats from "./Stats/OrderStats";
import OrderFilters from "./Filter/OrderFilters";
import OrdersTable from "./Tables/OrdersTable";
import Pagination from "./Pagination/Pagination";
import OrderDetailsModal from "./Model/OrderDetailsModal";
import UpdateStatusModal from "./Model/UpdateStatusModal";
import ReminderHistoryModal from "./Model/ReminderHistoryModal";
import { sendOrderPaymentReminder } from "../../../services/paymentApi/paymentApi";

export const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [showReminderHistory, setShowReminderHistory] = useState(false);
  const [selectedOrderForReminderHistory, setSelectedOrderForReminderHistory] =
    useState(null);
  const [stats, setStats] = useState({});

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    next: null,
    previous: null,
  });

  // Filters state
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    user_email: "",
    created_after: "",
    created_before: "",
  });

  // Fetch orders with pagination and filters
  useEffect(() => {
    fetchOrders();
    fetchOrderSummary();
  }, [pagination.currentPage, pagination.pageSize, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = {
        page: pagination.currentPage,
        page_size: pagination.pageSize,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const response = await listAllOrders(params);

      if (response.data) {
        setOrders(response.data.results || []);

        // Update pagination metadata
        setPagination((prev) => ({
          ...prev,
          totalCount: response.data.count || 0,
          totalPages: Math.ceil(
            (response.data.count || 0) / pagination.pageSize
          ),
          next: response.data.next,
          previous: response.data.previous,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderSummary = async () => {
    try {
      const response = await getOrderSummary();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching order summary:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleViewOrderPage = (order) => {
    navigate(`/admin/Order_Management/${order.id}`);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (updatedData) => {
    try {
      setLoading(true);

      const payload = {
        status: updatedData.status,
      };

      if (updatedData.status === "Shipped" && updatedData.courier_details) {
        payload.courier_details = updatedData.courier_details;
      }

      if (
        updatedData.status === "Cancelled" &&
        updatedData.cancellation_reason
      ) {
        payload.cancellation_reason = updatedData.cancellation_reason;
      }

      const response = await updateOrderStatus(selectedOrder.id, payload);

      if (response.status === 200) {
        toast.success(`Order status updated to ${updatedData.status}`);
        await fetchOrders();
        setIsStatusModalOpen(false);
        setSelectedOrder(null);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating order status:", error);

      if (error.response?.data?.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else if (error.response?.data) {
        const errorData = error.response.data;
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) {
          toast.error(firstError[0]);
        } else {
          toast.error(firstError || "Failed to update order status");
        }
      } else {
        toast.error("Failed to update order status");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (order) => {
    try {
      const payload = {
        order_id: order.id,
        reminder_type:
          order.reminder_info?.suggested_reminder_type || "payment_pending",
        custom_message: `Dear ${
          order.user?.full_name
        }, this is a reminder for your pending payment of ₹${
          order.total_amount
        } for order #${order.id?.substring(
          0,
          8
        )}. Please complete the payment to proceed with your order.`,
      };

      const response = await sendOrderPaymentReminder(payload);

      if (response.data.success) {
        toast.success("Payment reminder sent successfully!");
        fetchOrders(); // Refresh orders
      } else {
        toast.error(response.data.message || "Failed to send reminder");
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Error sending payment reminder");
    }
  };

  const handleRefresh = () => {
    fetchOrders();
    fetchOrderSummary();
    toast.info("Orders refreshed successfully");
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handlePageSizeChange = (size) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(size),
      currentPage: 1,
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      search: "",
      user_email: "",
      created_after: "",
      created_before: "",
    });
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900">Order Management</h1>
        <p className="text-red-600 mt-2">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <OrderStats stats={stats} totalOrders={pagination.totalCount} />

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onRefresh={handleRefresh}
      />

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onViewOrderPage={handleViewOrderPage}
        loading={loading}
        toast={toast}
        onRefresh={handleRefresh}
      />

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Modals */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
        onViewReminderHistory={(order) => {
          setSelectedOrderForReminderHistory(order);
          setShowReminderHistory(true);
        }}
        onSendReminder={handleSendReminder}
        toast={toast}
      />

      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />

      <ReminderHistoryModal
        isOpen={showReminderHistory}
        onClose={() => setShowReminderHistory(false)}
        order={selectedOrderForReminderHistory}
      />
    </div>
  );
};
