// src/api/axiosClient.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 1. Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. NEW: Response Interceptor (Handles Expiration)
apiClient.interceptors.response.use(
  (response) => response, // If success, just return data
  (error) => {
    // Check if error is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Force Logout: Clear Zustand & LocalStorage
      useAuthStore.getState().logout();

      // Redirect to Login (Optional: window.location is a hard refresh)
      // Since we cleared the store, your App.tsx <Navigate> logic
      // might automatically switch views, but a reload ensures a clean slate.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
