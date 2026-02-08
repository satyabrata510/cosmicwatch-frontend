/**
 * Alerts Store
 *
 * Zustand store for managing application-wide alert state.
 * Handles fetching, read-status updates, and unread counts.
 */

import { create } from "zustand";
import { fetchAlerts, fetchUnreadCount, markAlertRead, markAllAlertsRead } from "@/services/alerts";
import type { Alert } from "@/types";

interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  load: () => Promise<void>;
  loadUnread: () => Promise<void>;
  markRead: (alertId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const alerts = await fetchAlerts();
      set({ alerts, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load alerts",
        isLoading: false,
      });
    }
  },

  loadUnread: async () => {
    try {
      const count = await fetchUnreadCount();
      set({ unreadCount: count });
    } catch {
      // silent
    }
  },

  markRead: async (alertId) => {
    try {
      await markAlertRead(alertId);
      set((s) => ({
        alerts: s.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }));
    } catch {
      // silent
    }
  },

  markAllRead: async () => {
    try {
      await markAllAlertsRead();
      set((s) => ({
        alerts: s.alerts.map((a) => ({ ...a, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // silent
    }
  },
}));
