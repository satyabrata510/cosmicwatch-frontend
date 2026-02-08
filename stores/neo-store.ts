/**
 * NEO Store
 *
 * Zustand store for managing Near-Earth Object (NEO) feed data,
 * counts, and loading states.
 */

import { create } from "zustand";
import { fetchNeoFeed, today } from "@/services/neo";
import type { NeoObject } from "@/types";

interface NeoState {
  /** Flat list of NEOs for the selected date range */
  neos: NeoObject[];
  /** Total element count from the feed */
  elementCount: number;
  /** Number of hazardous objects */
  hazardousCount: number;
  /** Loading flag */
  isLoading: boolean;
  /** Error message if fetch fails */
  error: string | null;
  /** Date range of the current feed */
  startDate: string;
  endDate: string;

  // Actions
  loadFeed: (startDate?: string, endDate?: string) => Promise<void>;
}

export const useNeoStore = create<NeoState>((set) => ({
  neos: [],
  elementCount: 0,
  hazardousCount: 0,
  isLoading: false,
  error: null,
  startDate: today(),
  endDate: today(),

  loadFeed: async (startDate?: string, endDate?: string) => {
    const start = startDate ?? today();
    const end = endDate ?? start;

    set({ isLoading: true, error: null, startDate: start, endDate: end });

    try {
      const feed = await fetchNeoFeed(start, end);
      // Flatten all date buckets into a single array
      const neos = Object.values(feed.near_earth_objects).flat();
      const hazardousCount = neos.filter((n) => n.is_potentially_hazardous_asteroid).length;

      set({
        neos,
        elementCount: feed.element_count,
        hazardousCount,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load NEO feed",
        isLoading: false,
      });
    }
  },
}));
