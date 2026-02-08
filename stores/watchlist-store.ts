/**
 * Watchlist Store
 *
 * Zustand store for managing the user's asteroid watchlist.
 * Supports adding, removing, and updating notification preferences for tracked items.
 */

import { create } from "zustand";
import {
  addToWatchlist,
  fetchWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from "@/services/watchlist";
import type { AddToWatchlist, UpdateWatchlist, WatchlistItem } from "@/types";

interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  error: string | null;

  load: () => Promise<void>;
  add: (payload: AddToWatchlist) => Promise<void>;
  remove: (asteroidId: string) => Promise<void>;
  update: (asteroidId: string, payload: UpdateWatchlist) => Promise<void>;
  isWatched: (asteroidId: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await fetchWatchlist(1, 100);
      set({ items, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load watchlist",
        isLoading: false,
      });
    }
  },

  add: async (payload) => {
    try {
      const item = await addToWatchlist(payload);
      set((s) => ({ items: [item, ...s.items], error: null }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to add" });
      throw err;
    }
  },

  remove: async (asteroidId) => {
    try {
      await removeFromWatchlist(asteroidId);
      set((s) => ({
        items: s.items.filter((i) => i.asteroidId !== asteroidId),
        error: null,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to remove" });
      throw err;
    }
  },

  update: async (asteroidId, payload) => {
    try {
      const updated = await updateWatchlistItem(asteroidId, payload);
      set((s) => ({
        items: s.items.map((i) => (i.asteroidId === asteroidId ? { ...i, ...updated } : i)),
        error: null,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update" });
      throw err;
    }
  },

  isWatched: (asteroidId) => {
    return get().items.some((i) => i.asteroidId === asteroidId);
  },
}));
