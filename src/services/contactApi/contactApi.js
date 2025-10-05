// contactApi.js
import axiosInstance from "../../utils/axiosInstance";

// 1. Send contact message
export const sendContactMessage = (data) =>
  axiosInstance.post("/Contact/create/", data);

// 2. Get all contacts with pagination and filters
export const getContacts = (params = {}) =>
  axiosInstance.get("/Contact/list/", { params });

// 3. Get single message
export const getContactMessage = (messageId) =>
  axiosInstance.get(`/Contact/list/${messageId}/`);

// 4. Update single message (general update/patch)
export const updateContactMessage = (messageId, data) =>
  axiosInstance.patch(`/Contact/list/${messageId}/`, data);

// 5. Delete single message
export const deleteContactMessage = (messageId) =>
  axiosInstance.delete(`/Contact/list/${messageId}/`);

// 6. Archive/unarchive single message
export const toggleArchiveContact = (messageId, data) =>
  axiosInstance.patch(`/Contact/archive/${messageId}/`, data);

// 7. Mark single message as read/unread
export const toggleReadStatusContact = (messageId, data) =>
  axiosInstance.patch(`/Contact/read-status/${messageId}/`, data);

// 8. Bulk archive messages
export const bulkArchiveContacts = (data) =>
  axiosInstance.post("/Contact/bulk-archive/", data);

// 9. Bulk update read status
export const bulkReadStatusContacts = (data) =>
  axiosInstance.post("/Contact/bulk-read-status/", data);
