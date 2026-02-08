/**
 * APOD Service
 *
 * Interfaces with the Astronomy Picture of the Day (APOD) endpoints
 * for fetching daily space imagery.
 */

import api from "@/lib/api";
import type { ApiResponse, Apod } from "@/types";

/**
 * GET /apod/today — Fetch today's APOD
 * Returns null on failure (graceful fallback)
 */
export async function fetchApodToday(): Promise<Apod | null> {
  try {
    const { data } = await api.get<ApiResponse<Apod>>("/apod/today");
    return data.data;
  } catch {
    return null;
  }
}

/**
 * GET /apod/random?count=N — Fetch random APOD images
 */
export async function fetchApodRandom(count = 5): Promise<Apod[]> {
  const { data } = await api.get<ApiResponse<Apod[]>>("/apod/random", {
    params: { count },
  });
  return data.data;
}

/**
 * GET /apod/range?start_date=&end_date= — Fetch APOD for a date range
 */
export async function fetchApodRange(startDate: string, endDate: string): Promise<Apod[]> {
  const { data } = await api.get<ApiResponse<Apod[]>>("/apod/range", {
    params: { start_date: startDate, end_date: endDate },
  });
  return data.data;
}
