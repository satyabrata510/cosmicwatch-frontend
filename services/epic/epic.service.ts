/**
 * EPIC Service
 *
 * Fetches imagery from the DSCOVR Earth Polychromatic Imaging Camera (EPIC).
 * Supports both natural and enhanced color collections.
 */

import api from "@/lib/api";
import type { ApiResponse, EpicImage } from "@/types";

/**
 * GET /epic/natural — Natural-color Earth images
 * @param date optional YYYY-MM-DD
 */
export async function fetchEpicNatural(date?: string): Promise<EpicImage[]> {
  const { data } = await api.get<ApiResponse<EpicImage[]>>("/epic/natural", {
    params: date ? { date } : undefined,
  });
  return data.data;
}

/**
 * GET /epic/enhanced — Enhanced-color Earth images
 * @param date optional YYYY-MM-DD
 */
export async function fetchEpicEnhanced(date?: string): Promise<EpicImage[]> {
  const { data } = await api.get<ApiResponse<EpicImage[]>>("/epic/enhanced", {
    params: date ? { date } : undefined,
  });
  return data.data;
}

/**
 * GET /epic/dates — Available dates for EPIC imagery
 * @param type "natural" | "enhanced"
 */
export async function fetchEpicDates(type: "natural" | "enhanced" = "natural"): Promise<string[]> {
  const { data } = await api.get<ApiResponse<string[]>>("/epic/dates", {
    params: { type },
  });
  return data.data;
}
