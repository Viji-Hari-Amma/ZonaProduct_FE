import axiosInstance from "../../../utils/axiosInstance";

// Create Category
export const createCategory = (data) =>
  axiosInstance.post("/Product/categories/", data);

// Get All Categories
export const listCategories = () => axiosInstance.get("/Product/categories/");

// Get Single Category
export const getCategory = (id) =>
  axiosInstance.get(`/Product/categories/${id}/`);

// Update Category
export const updateCategory = (id, data) =>
  axiosInstance.patch(`/Product/categories/${id}/`, data);

// Delete Category
export const deleteCategory = (id) =>
  axiosInstance.delete(`/Product/categories/${id}/`);

// Get Category Names Only
export const getCategoryNames = () =>
  axiosInstance.get("/Product/categories/names/");
