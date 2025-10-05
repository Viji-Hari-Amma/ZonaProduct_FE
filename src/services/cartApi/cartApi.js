// src/api/cart.js
import axiosInstance from "../../utils/axiosInstance";

// 1. View cart items
export const viewCart = () => axiosInstance.get("/Cart/");

// 2. Add to cart with entering the quantity of product
export const addToCart = (data) => axiosInstance.post("/Cart/items/", data);

// add to cart without entering the quantity of product
export const QuickAddToCart = (data) => axiosInstance.post("/Cart/items/quick-add/", data);

// 3. Update cart item
export const updateCartItem = (itemId, data) =>
  axiosInstance.patch(`/Cart/items/${itemId}/`, data);

// 4. Delete cart item
export const deleteCartItem = (itemId) =>
  axiosInstance.delete(`/Cart/items/${itemId}/`);

// 5. List cart items
export const listCartItems = () => axiosInstance.get("/Cart/items/");

// 6. Get specific cart item
export const getCartItem = (itemId) =>
  axiosInstance.get(`/Cart/items/${itemId}/`);
