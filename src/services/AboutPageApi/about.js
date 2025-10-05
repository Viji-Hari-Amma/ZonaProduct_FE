import axiosInstance from "../../utils/axiosInstance";

export const aboutService = {
  // Owner Info
  getOwnerDetail: () => axiosInstance.get("/About/owner/"),
  updateOwnerDetail: (data) =>
    axiosInstance.put("/About/owner/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  // Company Stats
  getCompanyStatus: () => axiosInstance.get("/About/stats/"),
  updateCompanyStatus: (data) => axiosInstance.put("/About/stats/", data),

  // Social Media Links
  getSocialLinks: () => axiosInstance.get("/About/social/"),
  updateSocialLinks: (data) => axiosInstance.put("/About/social/", data),

  // Contact Details
  getContactDetails: () => axiosInstance.get("/About/contact/"),
  updateContactDetails: (data) => axiosInstance.put("/About/contact/", data),
};
