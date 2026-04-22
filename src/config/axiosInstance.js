import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/auth/session";
import { authApi } from "@/api";

const API_BASE_URL = "https://44snapshot-node.dotlinkertech.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // required to send cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// Attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest?.url?.includes("/auth/refreshaccessToken")) {
        clearAccessToken();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...(originalRequest.headers || {}),
              Authorization: `Bearer ${token}`
            };
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refresh token comes automatically from cookies
        const data = await authApi.refresh();

        const newAccessToken = data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Failed to refresh access token.");
        }

        setAccessToken(newAccessToken);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:refreshed"));
        }

        processQueue(null, newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`
        };

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        clearAccessToken();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
