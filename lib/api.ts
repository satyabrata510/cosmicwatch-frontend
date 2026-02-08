/**
 * Axios API Client
 *
 * Configured Axios instance with request/response interceptors
 * for automatic JWT attachment and token refresh logic.
 */

import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth-store";
import { API_BASE_URL, AUTH_COOKIE_KEY, REFRESH_COOKIE_KEY } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Request interceptor: attach access token ──────────────
api.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_COOKIE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 → refresh token ──────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh for auth endpoints — let the caller handle errors
    const url = originalRequest?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get(REFRESH_COOKIE_KEY);
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data;
        Cookies.set(AUTH_COOKIE_KEY, accessToken, { sameSite: "lax" });
        Cookies.set(REFRESH_COOKIE_KEY, newRefreshToken, { sameSite: "lax" });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        // Sync Zustand state so UI reflects logged-out status
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
