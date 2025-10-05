import axiosInstance from "../../utils/axiosInstance";

// Create Product
export const createProduct = (data) =>
  axiosInstance.post("/Product/products/", data);

// Get All Products (with pagination and filters)
export const listProducts = (params = {}) =>
  axiosInstance.get("/Product/products/", { params });

export const adminlistProducts = (params = {}) => {
  // Ensure page and page_size are included
  const defaultParams = {
    page: 1,
    page_size: 9,
    ...params,
  };

  return axiosInstance.get("/Product/products/", { params: defaultParams });
};

// Get the Product Count
export const ProductCount = () =>
  axiosInstance.get("/Product/products/total-count/");

// Get Top Products by period + status
export const getTopProducts = (period = "this_month", status = "all") => {
  return axiosInstance.get(
    `/Product/top-products/?period=${period}&status=${status}`
  );
};

// Get All Products (no pagination, optional category filter) - Keep for backward compatibility
export const listProductsNoPagination = (categoryId = null) => {
  const url = categoryId
    ? `/Product/products/no-pagination/?category=${categoryId}`
    : `/Product/products/no-pagination/`;
  return axiosInstance.get(url);
};

// Get Single Product
export const getProduct = (id) => axiosInstance.get(`/Product/products/${id}/`);

// Update Product
export const updateProduct = (id, data) =>
  axiosInstance.patch(`/Product/products/${id}/`, data);

// Delete Product
export const deleteProduct = (id) =>
  axiosInstance.delete(`/Product/products/${id}/`);

// Get All Product Names
export const getAllProductNames = async () => {
  try {
    const response = await axiosInstance.get(`/Product/products/names/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product names:", error);
    throw error;
  }
};

// Get All Category Names
export const getAllCategoryNames = async () => {
  try {
    const response = await axiosInstance.get(`/Product/categories/names/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product names:", error);
    throw error;
  }
};

// Get All Categories
export const getAllCategories = () => axiosInstance.get("/Product/categories/");

// Get Active Products only
export const listActiveProducts = (params = {}) => {
  const defaultParams = {
    page: 1,
    page_size: 12,
    ...params,
  };

  return axiosInstance.get("/Product/products/active/", {
    params: defaultParams,
  });
};

// Get Inactive Products only
export const listInactiveProducts = (params = {}) => {
  const defaultParams = {
    page: 1,
    page_size: 12,
    ...params,
  };

  return axiosInstance.get("/Product/products/inactive/", {
    params: defaultParams,
  });
};

export const setProductActiveStatus = (id, data) =>
  axiosInstance.patch(`/Product/products/${id}/set-active/`, data);
