import axiosInstance from "../../../utils/axiosInstance";

// Create Product Image
export const createProductImage = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/images/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Alias for createProductImage (for consistency)
export const uploadProductImage = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/images/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Get All Images for Product
export const listProductImages = (productId) =>
  axiosInstance.get(`/Product/products/${productId}/images/`);

// Alias for listProductImages (for consistency)
export const getProductImages = (productId) =>
  axiosInstance.get(`/Product/products/${productId}/images/`);

// Get Single Image
export const getProductImage = (productId, imageId) =>
  axiosInstance.get(`/Product/products/${productId}/images/${imageId}/`);

// Update Product Image
export const updateProductImage = (productId, imageId, data) =>
  axiosInstance.patch(`/Product/products/${productId}/images/${imageId}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete Product Image
export const deleteProductImage = (productId, imageId) =>
  axiosInstance.delete(`/Product/products/${productId}/images/${imageId}/`);

// Set Primary Image
export const setPrimaryImage = (productId, imageId) =>
  axiosInstance.patch(`/Product/products/${productId}/images/${imageId}/set_primary/`);
