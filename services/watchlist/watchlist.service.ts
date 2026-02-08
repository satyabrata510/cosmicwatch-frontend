/**
 * Watchlist Service
 *
 * CRUD operations for managing the authenticated user's
 * asteroid watchlist.
 */

import api from "@/lib/api";
import type { AddToWatchlist, ApiResponse, UpdateWatchlist, WatchlistItem } from "@/types";

/**
 * GET /watchlist — List user's watchlist items
 */
export async function fetchWatchlist(page = 1, limit = 20): Promise<WatchlistItem[]> {
  const { data } = await api.get<ApiResponse<WatchlistItem[]>>("/watchlist", {
    params: { page, limit },
  });
  return data.data;
}

/**
 * POST /watchlist — Add asteroid to watchlist
 */
export async function addToWatchlist(payload: AddToWatchlist): Promise<WatchlistItem> {
  const { data } = await api.post<ApiResponse<WatchlistItem>>("/watchlist", payload);
  return data.data;
}

/**
 * DELETE /watchlist/:asteroidId — Remove from watchlist
 */
export async function removeFromWatchlist(asteroidId: string): Promise<void> {
  await api.delete(`/watchlist/${asteroidId}`);
}

/**
 * PATCH /watchlist/:asteroidId — Update alert settings
 */
export async function updateWatchlistItem(
  asteroidId: string,
  payload: UpdateWatchlist
): Promise<WatchlistItem> {
  const { data } = await api.patch<ApiResponse<WatchlistItem>>(`/watchlist/${asteroidId}`, payload);
  return data.data;
}
