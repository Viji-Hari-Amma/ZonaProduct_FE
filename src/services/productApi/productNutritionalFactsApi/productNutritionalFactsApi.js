import axiosInstance from "../../../utils/axiosInstance";

// Create Nutritional Fact
export const createNutritionalFact = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/nutritional-facts/`, data);

// Alias for createNutritionalFact (for consistency)
export const addProductNutritionalFact = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/nutritional-facts/`, data);

// Bulk Upload Nutritional Facts
export const bulkAddNutritionalFacts = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/nutritional-facts/bulk-upload/`, data);

// Get All Nutritional Facts for Product
export const listNutritionalFacts = (productId) =>
  axiosInstance.get(`/Product/products/${productId}/nutritional-facts/`);

// Get Single Nutritional Fact
export const getNutritionalFact = (productId, factId) =>
  axiosInstance.get(
    `/Product/products/${productId}/nutritional-facts/${factId}/`
  );

// Update Nutritional Fact
export const updateNutritionalFact = (productId, factId, data) =>
  axiosInstance.patch(
    `/Product/products/${productId}/nutritional-facts/${factId}/`,
    data
  );

// Delete Nutritional Fact
export const deleteNutritionalFact = (productId, factId) =>
  axiosInstance.delete(
    `/Product/products/${productId}/nutritional-facts/${factId}/`
  );
