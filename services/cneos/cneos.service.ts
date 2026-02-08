/**
 * CNEOS Service
 *
 * Interfaces with the Center for Near-Earth Object Studies (CNEOS) API
 * to fetch Sentry (impact risk) and Fireball data.
 */

import api from "@/lib/api";
import type {
  ApiResponse,
  CloseApproachResponse,
  FireballResponse,
  SentryDetail,
  SentryListResponse,
} from "@/types";

export interface CloseApproachParams {
  date_min?: string;
  date_max?: string;
  dist_max?: string;
  sort?: string;
  limit?: number;
  pha?: boolean;
}

export interface SentryParams {
  ps_min?: number;
  ip_min?: number;
  h_max?: number;
}

export interface FireballParams {
  date_min?: string;
  date_max?: string;
  limit?: number;
  sort?: string;
  energy_min?: number;
  req_loc?: boolean;
}

/**
 * GET /cneos/close-approaches — Upcoming close approaches
 */
export async function fetchCloseApproaches(
  params?: CloseApproachParams
): Promise<CloseApproachResponse> {
  const { data } = await api.get<ApiResponse<CloseApproachResponse>>("/cneos/close-approaches", {
    params,
  });
  return data.data;
}

/**
 * GET /cneos/sentry — Sentry-monitored objects
 */
export async function fetchSentryObjects(params?: SentryParams): Promise<SentryListResponse> {
  const { data } = await api.get<ApiResponse<SentryListResponse>>("/cneos/sentry", { params });
  return data.data;
}

/**
 * GET /cneos/sentry/:designation — Single Sentry object detail
 */
export async function fetchSentryByDesignation(designation: string): Promise<SentryDetail> {
  const { data } = await api.get<ApiResponse<SentryDetail>>(`/cneos/sentry/${designation}`);
  return data.data;
}

/**
 * GET /cneos/fireballs — Fireball/bolide events
 */
export async function fetchFireballs(params?: FireballParams): Promise<FireballResponse> {
  const { data } = await api.get<ApiResponse<FireballResponse>>("/cneos/fireballs", { params });
  return data.data;
}
