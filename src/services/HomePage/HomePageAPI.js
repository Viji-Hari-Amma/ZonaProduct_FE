import axiosInstance from "../../utils/axiosInstance";

export const getCarouselData = async () => {
  try {
    const response = await axiosInstance.get("/Home/carousel/");
    // Handle different response structures
    if (response.data && response.data.data !== undefined) {
      return response.data; // {status: "success", data: [], message: ""}
    } else if (Array.isArray(response.data)) {
      return { status: "success", data: response.data, message: "" };
    } else {
      return { status: "success", data: [], message: "" };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { status: "error", message: error.message, data: [] };
  }
};

export const createCarousel = (data) =>
  axiosInstance.post("/Home/carousel/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCarousel = (id, data) =>
  axiosInstance.patch(`/Home/carousel/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCarousel = (id) =>
  axiosInstance.delete(`/Home/carousel/${id}/`);

// Logo APIs with proper response handling
export const getLogos = async () => {
  try {
    const response = await axiosInstance.get("/Home/logo/");
    // Handle different response structures
    if (response.data && response.data.data !== undefined) {
      return response.data;
    } else if (Array.isArray(response.data)) {
      return { status: "success", data: response.data, message: "" };
    } else {
      return { status: "success", data: [], message: "" };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { status: "error", message: error.message, data: [] };
  }
};

export const createLogo = (data) =>
  axiosInstance.post("/Home/logo/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateLogo = (id, data) =>
  axiosInstance.patch(`/Home/logo/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteLogo = (id) => axiosInstance.delete(`/Home/logo/${id}/`);

export const getActiveLogo = async () => {
  try {
    const response = await axiosInstance.get("/Home/active-logo/");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { status: "error", message: error.message, data: null };
  }
};

// Additional Carousel APIs
export const getActiveCarouselItems = async () => {
  try {
    const response = await axiosInstance.get("/Home/active-carousel/");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return { status: "error", message: error.message, data: [] };
  }
};

export const getCarouselItem = (id) =>
  axiosInstance.get(`/Home/carousel/${id}/`);

export const updateCarouselItem = (id, data) =>
  axiosInstance.put(`/Home/carousel/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
