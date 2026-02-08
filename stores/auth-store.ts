/**
 * Authentication Store
 *
 * Manages user session state, including authentication status,
 * profile hydration, and secure token persistence.
 */

import Cookies from "js-cookie";
import { create } from "zustand";
import api from "@/lib/api";
import { AUTH_COOKIE_KEY, REFRESH_COOKIE_KEY } from "@/lib/constants";
import { disconnectSocket } from "@/lib/socket";
import type { ApiResponse, AuthData, LoginCredentials, RegisterCredentials, User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const IS_SECURE = typeof window !== "undefined" && window.location.protocol === "https:";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  sameSite: "lax",
  ...(IS_SECURE && { secure: true }),
  expires: 7, // 7 days — matches refresh token lifetime
};

const persistTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(AUTH_COOKIE_KEY, accessToken, COOKIE_OPTIONS);
  Cookies.set(REFRESH_COOKIE_KEY, refreshToken, COOKIE_OPTIONS);
};

const clearTokens = () => {
  Cookies.remove(AUTH_COOKIE_KEY);
  Cookies.remove(REFRESH_COOKIE_KEY);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  hydrate: async () => {
    const token = Cookies.get(AUTH_COOKIE_KEY);
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data } = await api.get<ApiResponse<User>>("/auth/profile");
      const user = data.data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const { data } = await api.post<ApiResponse<AuthData>>("/auth/login", credentials);
    persistTokens(data.data.accessToken, data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
  },

  register: async (credentials) => {
    const { data } = await api.post<ApiResponse<AuthData>>("/auth/register", credentials);
    persistTokens(data.data.accessToken, data.data.refreshToken);
    set({ user: data.data.user, isAuthenticated: true });
  },

  logout: () => {
    disconnectSocket();
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));
