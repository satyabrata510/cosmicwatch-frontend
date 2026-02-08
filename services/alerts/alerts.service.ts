/**
 * Alerts Service
 *
 * Manages user-specific alerts and notifications.
 * Provides endpoints for fetching, counting, and marking alerts as read.
 */

import api from "@/lib/api";
import type { Alert, ApiResponse } from "@/types";

/**
 * GET /alerts — List user's alerts
 */
export async function fetchAlerts(): Promise<Alert[]> {
  const { data } = await api.get<ApiResponse<Alert[]>>("/alerts");
  return data.data;
}

/**
 * GET /alerts/unread-count — Unread alert count
 */
export async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<ApiResponse<{ count: number }>>("/alerts/unread-count");
  return data.data.count;
}

/**
 * PATCH /alerts/read-all — Mark all alerts as read
 */
export async function markAllAlertsRead(): Promise<void> {
  await api.patch("/alerts/read-all");
}

/**
 * PATCH /alerts/:alertId/read — Mark single alert as read
 */
export async function markAlertRead(alertId: string): Promise<void> {
  await api.patch(`/alerts/${alertId}/read`);
}
