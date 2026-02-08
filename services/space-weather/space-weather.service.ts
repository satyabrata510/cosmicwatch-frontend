/**
 * Space Weather Service
 *
 * Provides access to NASA's Space Weather Database Of Notifications,
 * Knowledge, Information (DONKI) API.
 */

import api from "@/lib/api";
import type {
  ApiResponse,
  CmeResponse,
  GeoStormResponse,
  SolarFlareResponse,
  SpaceWeatherNotificationResponse,
} from "@/types";

export interface SpaceWeatherParams {
  start_date?: string;
  end_date?: string;
}

export interface NotificationParams extends SpaceWeatherParams {
  type?: string;
}

/**
 * GET /space-weather/cme — Coronal Mass Ejections
 */
export async function fetchCME(params?: SpaceWeatherParams): Promise<CmeResponse> {
  const { data } = await api.get<ApiResponse<CmeResponse>>("/space-weather/cme", { params });
  return data.data;
}

/**
 * GET /space-weather/flares — Solar Flares
 */
export async function fetchSolarFlares(params?: SpaceWeatherParams): Promise<SolarFlareResponse> {
  const { data } = await api.get<ApiResponse<SolarFlareResponse>>("/space-weather/flares", {
    params,
  });
  return data.data;
}

/**
 * GET /space-weather/storms — Geomagnetic Storms
 */
export async function fetchGeoStorms(params?: SpaceWeatherParams): Promise<GeoStormResponse> {
  const { data } = await api.get<ApiResponse<GeoStormResponse>>("/space-weather/storms", {
    params,
  });
  return data.data;
}

/**
 * GET /space-weather/notifications — Space weather notifications
 */
export async function fetchSpaceWeatherNotifications(
  params?: NotificationParams
): Promise<SpaceWeatherNotificationResponse> {
  const { data } = await api.get<ApiResponse<SpaceWeatherNotificationResponse>>(
    "/space-weather/notifications",
    { params }
  );
  return data.data;
}
