import axiosInstance from "../../utils/axiosInstance";

// 1. Create review (productId required)
export const createReview = (productId, data) =>
  axiosInstance.post(`/Product/products/${productId}/reviews/`, data);

// 2. Update specific review
export const updateReview = (productId, reviewId, data) =>
  axiosInstance.patch(
    `/Product/products/${productId}/reviews/${reviewId}/`,
    data
  );

// 3. Approve a review
export const approveReview = (productId, reviewId) =>
  axiosInstance.post(
    `/Product/products/${productId}/reviews/${reviewId}/approve/`
  );

// 4. Reject a review
export const rejectReview = (productId, reviewId) =>
  axiosInstance.post(
    `/Product/products/${productId}/reviews/${reviewId}/reject/`
  );

// 5. Get all reviews (all products)
export const listReviews = () => axiosInstance.get("/Product/reviews/");

// 6. Get all reviews for a specific product
export const listProductReviews = (productId) =>
  axiosInstance.get(`/Product/products/${productId}/reviews/`);



// 9. Delete review
export const deleteReview = (productId, reviewId) =>
  axiosInstance.delete(`/Product/products/${productId}/reviews/${reviewId}/`);

// 10. Get single review
export const getReview = (productId, reviewId) =>
  axiosInstance.get(`/Product/products/${productId}/reviews/${reviewId}/`);

// 11. Get all reviews by a specific user
export const listUserReviews = (userId) =>
  axiosInstance.get(`/Product/reviews/by-user/?email=${userId}`);

export const listAllUserReviews = (userId) =>
  axiosInstance.get(`/Product/reviews/by-user/`);

export const getAdminReviews = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/Product/admin-reviews/", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Review settings - CORRECTED URL
export const getReviewSettings = async () => {
  try {
    const response = await axiosInstance.get("/Product/reviews/settings/");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const updateReviewSettings = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/Product/reviews/settings/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
