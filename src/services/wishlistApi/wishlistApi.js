import axiosInstance from "../../utils/axiosInstance";

export const viewWishlist = () => axiosInstance.get("/Cart/wishlist/");

export const addToWishlist = (data) =>
  axiosInstance.post("/Cart/wishlist/", data);

export const getSingleWishlist = (id) =>
  axiosInstance.get(`/Cart/wishlist/${id}/`);

export const removeFromWishlist = (id) =>
  axiosInstance.delete(`/Cart/wishlist/${id}/`);
