/**
 * NASA Media Service
 *
 * Provides methods to search the NASA Image and Video Library
 * and retrieve media assets.
 */

import api from "@/lib/api";
import type { ApiResponse, MediaItem } from "@/types";

export interface MediaSearchParams {
  q: string;
  media_type?: string;
  year_start?: number;
  year_end?: number;
  page?: number;
}

export interface MediaAsset {
  href: string;
}

/**
 * GET /media/search — Search NASA media library
 */
export async function searchMedia(params: MediaSearchParams): Promise<MediaItem[]> {
  const { data } = await api.get<ApiResponse<MediaItem[]>>("/media/search", {
    params,
  });
  return data.data;
}

/**
 * GET /media/asset/:nasaId — Get asset manifest for a media item
 */
export async function fetchMediaAsset(nasaId: string): Promise<MediaAsset[]> {
  const { data } = await api.get<ApiResponse<MediaAsset[]>>(`/media/asset/${nasaId}`);
  return data.data;
}
