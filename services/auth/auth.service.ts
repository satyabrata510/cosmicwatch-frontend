/**
 * Auth Service
 *
 * Handles authentication-related API endpoints, including
 * user profile fetching and account management.
 */

import api from "@/lib/api";
import type { ApiResponse, User } from "@/types";

/**
 * GET /auth/profile — Fetch authenticated user profile
 * Returns user with `_count: { watchlist, alerts }`
 */
export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<ApiResponse<User>>("/auth/profile");
  return data.data;
}
