/**
 * NEO Service
 *
 * Service for fetching Near-Earth Object (NEO) feed data
 * and performing specific asteroid lookups via NASA NeoWs.
 */

import api from "@/lib/api";
import type { ApiResponse, NeoFeedResponse, NeoObject, RiskScore, SentryRiskScore } from "@/types";

/** Format a Date to YYYY-MM-DD */
const fmt = (d: Date) => d.toISOString().slice(0, 10);

/** Today's date string */
export const today = () => fmt(new Date());

/**
 * GET /neo/feed — Near-Earth Object feed
 * @param startDate  YYYY-MM-DD (defaults to today)
 * @param endDate    YYYY-MM-DD (defaults to startDate)
 */
export async function fetchNeoFeed(startDate?: string, endDate?: string): Promise<NeoFeedResponse> {
  const start = startDate ?? today();
  const end = endDate ?? start;
  const { data } = await api.get<ApiResponse<NeoFeedResponse>>("/neo/feed", {
    params: { start_date: start, end_date: end },
  });
  return data.data;
}

/**
 * GET /neo/lookup/:id — Single NEO by ID
 */
export async function fetchNeoById(id: string): Promise<NeoObject> {
  const { data } = await api.get<ApiResponse<NeoObject>>(`/neo/lookup/${id}`);
  return data.data;
}

/**
 * GET /neo/risk — Batch risk analysis for a date range
 * Backend returns EnhancedRiskResult; we extract the assessments array.
 */
export async function fetchNeoRisk(startDate?: string, endDate?: string): Promise<RiskScore[]> {
  const start = startDate ?? today();
  const end = endDate ?? start;
  const { data } = await api.get<ApiResponse<{ assessments?: RiskScore[] }>>("/neo/risk", {
    params: { start_date: start, end_date: end },
  });
  // Backend wraps risk scores inside an EnhancedRiskResult envelope
  const payload = data.data;
  return Array.isArray(payload) ? payload : (payload?.assessments ?? []);
}

/**
 * GET /neo/lookup/:id/risk — Single asteroid risk score
 * Backend double-wraps: ApiResponse → { success, engine, data: RiskScore }
 */
export async function fetchNeoRiskById(id: string): Promise<RiskScore> {
  const { data } = await api.get<ApiResponse<RiskScore | { data: RiskScore }>>(
    `/neo/lookup/${id}/risk`
  );
  const payload = data.data;
  // Handle double-wrapped envelope from Python engine passthrough
  if (payload && typeof payload === "object" && "data" in payload && !("risk_score" in payload)) {
    return (payload as { data: RiskScore }).data;
  }
  return payload as RiskScore;
}

/**
 * GET /neo/lookup/:id/sentry-risk — Sentry-enhanced risk score
 * Same double-wrap handling as single risk endpoint.
 */
export async function fetchNeoSentryRisk(id: string): Promise<SentryRiskScore> {
  const { data } = await api.get<ApiResponse<SentryRiskScore | { data: SentryRiskScore }>>(
    `/neo/lookup/${id}/sentry-risk`
  );
  const payload = data.data;
  if (payload && typeof payload === "object" && "data" in payload && !("risk_score" in payload)) {
    return (payload as { data: SentryRiskScore }).data;
  }
  return payload as SentryRiskScore;
}
