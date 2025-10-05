import axiosInstance from "../../../utils/axiosInstance";

// 1. Get sizes of a product
export const getProductSizes = (productId) =>
  axiosInstance.get(`/Product/products/${productId}/sizes/`);

// 2. Add single size for product
export const addProductSize = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/sizes/`, data);

// 3. Get single size
export const getSingleSize = (productId, sizeId) =>
  axiosInstance.get(`/Product/products/${productId}/sizes/${sizeId}/`);

// 4. Update single size
export const updateSize = (productId, sizeId, data) =>
  axiosInstance.patch(`/Product/products/${productId}/sizes/${sizeId}/`, data);

// 5. Delete single size
export const deleteSize = (productId, sizeId) =>
  axiosInstance.delete(`/Product/products/${productId}/sizes/${sizeId}/`);

// 6. Bulk add sizes
export const bulkAddSizes = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/sizes/bulk/`, data);
