import axiosInstance from "../../utils/axiosInstance";

// =============================
// Payment Requests
// =============================

// Create a new payment request
export const createPayment = (data) =>
  axiosInstance.post("/new-payments/payment-requests/", data);

// Upload proof of online payment
export const uploadPaymentProof = (paymentId, file) => {
  const formData = new FormData();
  formData.append("upi_proof_image", file);
  return axiosInstance.post(
    `/new-payments/payment-requests/${paymentId}/upload-proof/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// Get all payments
export const listPayments = () =>
  axiosInstance.get("/new-payments/payment-requests/");

// Retrieve a specific payment
export const getPayment = (paymentId) =>
  axiosInstance.get(`/new-payments/payment-requests/${paymentId}/`);

// Send payment reminder (old endpoint - keep for backward compatibility)
export const sendPaymentReminder = (paymentId) =>
  axiosInstance.post("/new-payments/payment-requests/send-reminder/", {
    payment_id: paymentId,
  });

// =============================
// New Payment Reminder Endpoints
// =============================

// Send payment reminder with order_id
export const sendOrderPaymentReminder = (data) =>
  axiosInstance.post("/new-payments/payment-reminders/send-reminder/", data);

// Get payment reminder history
export const getPaymentReminderHistory = (orderId) =>
  axiosInstance.get(
    `/new-payments/payment-reminders/order/${orderId}/history/`
  );

// =============================
// UPI Settings
// =============================

// Upload UPI ID with QR
export const uploadUpi = (upiId, qrImage, isActive = true) => {
  const formData = new FormData();
  formData.append("upi_id", upiId);
  formData.append("qr_image", qrImage);
  formData.append("is_active", isActive);
  return axiosInstance.post("/new-payments/upi-settings/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get specific UPI QR
export const getUpi = (upiId) =>
  axiosInstance.get(`/new-payments/upi-settings/${upiId}/`);

export const getUPISettings = () =>
  axiosInstance.get("/new-payments/upi-settings/");

// Update UPI QR (PATCH)
export const updateUpi = (upiId, data) => {
  const formData = new FormData();
  if (data.upi_id) formData.append("upi_id", data.upi_id);
  if (data.qr_image) formData.append("qr_image", data.qr_image);
  if (data.is_active !== undefined)
    formData.append("is_active", data.is_active);
  return axiosInstance.patch(`/new-payments/upi-settings/${upiId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete a UPI QR
export const deleteUpi = (upiId) =>
  axiosInstance.delete(`/new-payments/upi-settings/${upiId}/`);

// =============================
// Admin Endpoints
// =============================

// List all payment requests (admin) with pagination & filters
export const listAdminPayments = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.status) queryParams.append("status", params.status);
  if (params.mode) queryParams.append("mode", params.mode);
  if (params.search) queryParams.append("search", params.search);

  const response = await axiosInstance.get(
    `/new-payments/admin/payment-requests/?${queryParams}`
  );
  return response;
};

// Verify or reject payment (admin decision)
export const adminPaymentDecision = (paymentId, action, notes) =>
  axiosInstance.post(
    `/new-payments/admin/payment-requests/${paymentId}/decision/`,
    { action, notes }
  );

// =============================
// Refund Endpoints
// =============================

// List all refunds (admin) with pagination & filters
export const listRefunds = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.status) queryParams.append("status", params.status);
  if (params.search) queryParams.append("search", params.search);

  const response = await axiosInstance.get(
    `/new-payments/refunds/?${queryParams}`
  );
  return response;
};

// List refunds for logged-in user
export const listUserRefunds = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.pageSize) queryParams.append("page_size", params.pageSize);
  if (params.status) queryParams.append("status", params.status);
  if (params.search) queryParams.append("search", params.search);

  const response = await axiosInstance.get(
    `/new-payments/user/refunds/?${queryParams}`
  );
  return response;
};

// =============================
// Payment Proof Endpoints
// =============================

// Get payment proof details
export const getPaymentProof = (paymentId) =>
  axiosInstance.get(`/new-payments/payment-requests/${paymentId}/proof/`);

// Verify UPI payment proof
export const verifyUPIPayment = (paymentId, data) =>
  axiosInstance.post(
    `/new-payments/admin/payment-requests/${paymentId}/verify-upi/`,
    data
  );

// Re-upload proof for rejected payment
export const reuploadPaymentProof = (paymentRequestId, file) => {
  const formData = new FormData();
  formData.append("upi_proof_image", file);
  return axiosInstance.post(
    `/new-payments/payment-requests/${paymentRequestId}/reupload-proof/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// Create new repayment request
export const createRepayment = (data) =>
  axiosInstance.post("/new-payments/payment-requests/create-repayment/", data);

// Get repayment info for rejected payment
export const getRepaymentInfo = (paymentRequestId) =>
  axiosInstance.get(
    `/new-payments/payment-requests/${paymentRequestId}/repayment-info/`
  );


  export const createPaymentWithProof = (data) => {
  const formData = new FormData();
  
  // Append all payment data
  formData.append("order", data.order);
  formData.append("amount", data.amount);
  formData.append("mode", data.mode);
  if (data.notes) formData.append("notes", data.notes);
  
  // Append the image file
  formData.append("upi_proof_image", data.upi_proof_image);
  
  return axiosInstance.post(
    "/new-payments/payment-requests/create-with-proof/",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};