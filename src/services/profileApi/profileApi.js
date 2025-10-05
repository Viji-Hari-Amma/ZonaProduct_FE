import axiosInstance from "../../utils/axiosInstance";

// 1. Get user's own profile
export const getProfile = () => axiosInstance.get("/Profile/view/");

// 2. Update user's own profile
export const updateProfile = (data) =>
  axiosInstance.patch("/Profile/view/", data);

// 3. Get profile picture URL
export const getProfilePicture = () =>
  axiosInstance.get("/Profile/profile-picture/");

// 4. Update profile picture
export const updateProfilePicture = (data) =>
  axiosInstance.patch("/Profile/profile-picture/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// 5. List user's addresses
export const listAddresses = () => axiosInstance.get("/Profile/addresses/");

// 6. Create new address
export const createAddress = (data) =>
  axiosInstance.post("/Profile/addresses/", data);

// 7. Get specific address
export const getAddress = (addressId) =>
  axiosInstance.get(`/Profile/addresses/${addressId}/`);

// 8. Update specific address (PUT)
export const updateAddress = (addressId, data) =>
  axiosInstance.put(`/Profile/addresses/${addressId}/`, data);

// 9. Delete specific address
export const deleteAddress = (addressId) =>
  axiosInstance.delete(`/Profile/addresses/${addressId}/`);

// 10. Admin: List all profiles
export const listProfiles = (url = null) => {
  if (url) {
    // Handle full URL with query parameters
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname + urlObj.search;
    return axiosInstance.get(path);
  }
  return axiosInstance.get("/Profile/admin/profiles/");
};

// 11. Admin: Delete user profile
export const deleteProfile = (profileId) =>
  axiosInstance.delete(`/Profile/admin/profiles/${profileId}/delete/`);

// 12. Notify inactive users
export const notifyInactiveUsers = (data) =>
  axiosInstance.post("/Profile/admin/inactive-users/notify/", data);
