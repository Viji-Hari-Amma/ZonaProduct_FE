import axiosInstance from "../../../utils/axiosInstance";

// Create Ingredient
export const createIngredient = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/ingredients/`, data);

// Alias for createIngredient (for consistency)
export const addProductIngredient = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/ingredients/`, data);

// Bulk Upload Ingredients
export const bulkAddIngredients = (productId, ingredientsData) => {

  // Ensure we're sending the correct format
  const payload = {
    ingredients: ingredientsData,
  };

  return axiosInstance.post(
    `/Product/products/${productId}/ingredients/bulk-upload/`,
    payload
  );
};

// Get All Ingredients for Product
export const listIngredients = (productId) =>
  axiosInstance.get(`/Product/products/${productId}/ingredients/`);

// Get Single Ingredient
export const getIngredient = (productId, ingredientId) =>
  axiosInstance.get(
    `/Product/products/${productId}/ingredients/${ingredientId}/`
  );

// Update Ingredient
export const updateIngredient = (productId, ingredientId, data) =>
  axiosInstance.patch(
    `/Product/products/${productId}/ingredients/${ingredientId}/`,
    data
  );

// Delete Ingredient
export const deleteIngredient = (productId, ingredientId) =>
  axiosInstance.delete(
    `/Product/products/${productId}/ingredients/${ingredientId}/`
  );


export const bulkReplaceIngredients = async (productId, ingredientsData) => {
  const response = await axiosInstance.post(
    `/Product/products/${productId}/ingredients/bulk-replace/`,
    ingredientsData
  );
  return response;
};