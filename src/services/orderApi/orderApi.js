import axiosInstance from "../../utils/axiosInstance";

export const listOrders = async (
  filterType = "active",
  page = 1,
  pageSize = 9
) => {
  try {
    const response = await axiosInstance.get(`/Orders/orders/`, {
      params: {
        filter_type: filterType,
        page: page,
        page_size: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createOrder = (data) =>
  axiosInstance.post("/Orders/orders/", data);
export const getOrder = (orderId) =>
  axiosInstance.get(`/Orders/orders/${orderId}/`);
export const updateOrderStatus = (orderId, data) =>
  axiosInstance.put(`/Orders/orders/${orderId}/update_status/`, data);
export const cancelOrder = (orderId, cancellation_reason) =>
  axiosInstance.post(`/Orders/orders/${orderId}/cancel/`, {
    cancellation_reason,
  });

// Admin endpoints
export const OrderSummary = (period) =>
  axiosInstance.get(`/Orders/order-summary/?period=${period}`);
export const getAdminOrder = (orderId) =>
  axiosInstance.get(`/Orders/admin/orders/${orderId}/`);

export const getOrderById = (orderId) =>
  axiosInstance.get(`/Orders/orders/${orderId}/`);

// Additional endpoints
export const listCancelledOrders = () =>
  axiosInstance.get("/Orders/cancelled-orders/");
export const getPreviousOrders = () =>
  axiosInstance.get("/Orders/previous-orders/");
export const adminCreateOrder = (data) =>
  axiosInstance.post("/Orders/admin/orders/", data);
export const adminUpdateOrder = (orderId, data) =>
  axiosInstance.put(`/Orders/admin/orders/${orderId}/`, data);
export const adminDeleteOrder = (orderId) =>
  axiosInstance.delete(`/Orders/admin/orders/${orderId}/`);
export const createBuyNowOrder = (data) =>
  axiosInstance.post("/Orders/orders/buy-now/", data);

// Refund endpoints
export const requestRefund = (orderId, reason) =>
  axiosInstance.post(`/Orders/orders/${orderId}/request-refund/`, { reason });
export const getRefundStatus = (orderId) =>
  axiosInstance.get(`/Orders/orders/${orderId}/refund-status/`);
export const cancelRefundRequest = (orderId) =>
  axiosInstance.post(`/Orders/orders/${orderId}/cancel-refund/`);
export const listAllRefunds = () => axiosInstance.get("/Orders/admin/refunds/");
export const processRefund = (orderId, action, notes = "") =>
  axiosInstance.post(`/Orders/admin/orders/${orderId}/process-refund/`, {
    action,
    notes,
  });
export const listAllOrders = (params = {}) =>
  axiosInstance.get("/Orders/admin/orders/", { params });

export const getOrderSummary = () =>
  axiosInstance.get("/Orders/admin/orders/summary/");
