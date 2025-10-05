import axiosInstance from "../../utils/axiosInstance";

// Login
export const loginUser = (data) => axiosInstance.post("/Auth/login/", data);

// Logout
export const logoutUser = (data) => axiosInstance.post("/Auth/logout/", data);

// Register
export const registerUser = (data) =>
  axiosInstance.post("/Auth/register/", data);

// Verify OTP
export const verifyOtp = (data) =>
  axiosInstance.post("/Auth/verify-otp/", data);

// Resend OTP
export const resendOtp = (email) =>
  axiosInstance.post("/Auth/resend-otp/", { email });

// Change Password
export const changePassword = (data) =>
  axiosInstance.post("/Auth/change-password/", data);

// Forgot Password
export const forgotPassword = (email) =>
  axiosInstance.post("/Auth/forgot-password/", { email });

// Reset Password
export const resetPassword = async (payload) => {
  const res = await axiosInstance.post("/Auth/reset-password/", payload);
  return res.data;
};

// Admin Register
export const registerAdmin = (data) =>
  axiosInstance.post("/Auth/admin/register/", data);

// Delete User
export const deleteUser = (userId) => 
  axiosInstance.delete(`/Auth/admin/users/${userId}/`);

// Change User Status
export const changeUserStatus = (userId, data) =>
  axiosInstance.patch(`/Auth/admin/users/${userId}/`, data);

// List Users
export const listUsers = () => axiosInstance.get("/Auth/admin/users/");

// Delete Account
export const deleteAccount = () =>
  axiosInstance.delete("/Auth/delete-account/");

// Google Login — uses axiosInstance now
export const googleLogin = (token) => {
  return axiosInstance.post("/Auth/google-login/", { token });
};

// Health Check
export const healthCheck = () => axiosInstance.get("/Auth/health/");

// Verify JWT Token
export const verifyToken = () => axiosInstance.get("/Auth/verify/");

// Get User Count
export const UserCount = () => axiosInstance.get("/Auth/user-count/");

// Refresh JWT Token
export const refreshToken = () => axiosInstance.post("/Auth/token/refresh/");
