import axiosInstance from "../../utils/axiosInstance";

const FAQ_API = {
  // List all FAQs
  list: (params = {}) => axiosInstance.get("/Product/faqs/", { params }),

  // Create a new FAQ
  create: (data) => axiosInstance.post("/Product/faqs/", data),

  // Get FAQ detail by ID
  get: (id) => axiosInstance.get(`/Product/faqs/${id}/`),

  // Update FAQ (full update)
  update: (id, data) => axiosInstance.put(`/Product/faqs/${id}/`, data),

  // Partial update FAQ (PATCH)
  patch: (id, data) => axiosInstance.patch(`/Product/faqs/${id}/`, data),

  // Delete FAQ
  delete: (id) => axiosInstance.delete(`/Product/faqs/${id}/`),

  // Bulk create FAQs
  bulkCreate: (data) => axiosInstance.post("/Product/faqs/bulk_create/", data),

  // Bulk delete FAQs (send IDs in request body)
  bulkDelete: (ids) =>
    axiosInstance.post("/Product/faqs/bulk_delete/", { ids }),

  // Reorder FAQ
  reorder: (id, data) =>
    axiosInstance.post(`/Product/faqs/${id}/reorder/`, data),

  // Mark FAQ as helpful
  markHelpful: (id, data) => axiosInstance.post(`/Product/faqs/${id}/mark_helpful/`, data),

  // Get common issues
  commonIssues: () => axiosInstance.get("/Product/faqs/common_issues/"),

  // Get FAQs by product
  byProduct: (productId) =>
    axiosInstance.get("/Product/faqs/by-product/", {
      params: { product_id: productId },
    }),

  // Get popular FAQs
  popular: () => axiosInstance.get("/Product/faqs/popular/"),
};

export default FAQ_API;
