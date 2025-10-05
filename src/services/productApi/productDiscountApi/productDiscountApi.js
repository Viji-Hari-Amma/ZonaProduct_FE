import axiosInstance from "../../../utils/axiosInstance";

export const discountService = {
  // Create Discount
  createDiscount: (data) => axiosInstance.post("/Product/discounts/", data),

  // Get All Discounts
  listDiscounts: () => axiosInstance.get("/Product/discounts/"),

  // Get Discount Stats
  getStats: () => axiosInstance.get("/Product/discounts/stats/"),

  // Get Single Discount
  getDiscount: (discountId) =>
    axiosInstance.get(`/Product/discounts/${discountId}/`),

  // Update Discount
  updateDiscount: (discountId, data) =>
    axiosInstance.patch(`/Product/discounts/${discountId}/`, data),

  // Delete Discount
  deleteDiscount: (id) => axiosInstance.delete(`/Product/discounts/${id}/`),

  // Toggle Active Status
  toggleActive: (discountId) =>
    axiosInstance.post(`/Product/discounts/${discountId}/toggle-active/`),

  // Send Notification
  sendNotification: (discountId) =>
    axiosInstance.post(`/Product/discounts/${discountId}/send-notification/`),

  // Send Pending Notifications
  sendPendingNotifications: () =>
    axiosInstance.post("/Product/discounts/send-pending-notifications/"),

  // Reset Notification
  resetNotification: (discountId) =>
    axiosInstance.post(`/Product/discounts/${discountId}/reset-notification/`),

  // Bulk Create Discounts
  bulkCreateDiscounts: (data) =>
    axiosInstance.post("/Product/discounts/bulk/", data),
};
