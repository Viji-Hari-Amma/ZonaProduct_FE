import axios from "axios";
import axiosRetry from "axios-retry";
import { getAccessToken, setAccessToken, clearTokens } from "./tokenUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;
let isRefreshing = false;
let refreshSubscribers = [];

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosRetry(axiosInstance, {
  retries: 3, // try up to 3 times
  retryDelay: axiosRetry.exponentialDelay, // waits 100ms, then 200ms, then 400ms...
  retryCondition: (error) =>
    error.code === "ECONNABORTED" || error.response?.status >= 500,
});

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const handleTokenRefresh = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${BASE_URL}Auth/token/refresh/`,
      {
        refresh: refreshToken,
      },
      {
        timeout: 10000,
      }
    );

    if (!response.data?.access) {
      throw new Error("Invalid response from token refresh");
    }

    const newAccessToken = response.data.access;
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await handleTokenRefresh();
        onRefreshed(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed, clearing tokens:", refreshError);
        clearTokens();

        const publicPrefixes = [
          "/",
          "/about",
          "/contact",
          "/products",
          "/login",
          "/register",
        ];
        const currentPath = window.location.pathname.toLowerCase();
        const shouldRedirect = !publicPrefixes.some((prefix) =>
          currentPath.startsWith(prefix.toLowerCase())
        );

        if (shouldRedirect) {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
