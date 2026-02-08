/**
 * Alerts Store Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the alerts service
vi.mock("@/services/alerts", () => ({
    fetchAlerts: vi.fn(),
    fetchUnreadCount: vi.fn(),
    markAlertRead: vi.fn(),
    markAllAlertsRead: vi.fn(),
}));

import { useAlertsStore } from "@/stores/alerts-store";
import { fetchAlerts, fetchUnreadCount, markAlertRead, markAllAlertsRead } from "@/services/alerts";

describe("useAlertsStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAlertsStore.setState({
            alerts: [],
            unreadCount: 0,
            isLoading: false,
            error: null,
        });
    });

    describe("load", () => {
        it("loads alerts successfully", async () => {
            const mockAlerts = [
                { id: "1", isRead: false, alertType: "CLOSE_APPROACH" },
                { id: "2", isRead: true, alertType: "HAZARDOUS_DETECTED" },
            ];
            vi.mocked(fetchAlerts).mockResolvedValueOnce(mockAlerts as any);

            await useAlertsStore.getState().load();

            expect(useAlertsStore.getState().alerts).toEqual(mockAlerts);
            expect(useAlertsStore.getState().isLoading).toBe(false);
            expect(useAlertsStore.getState().error).toBeNull();
        });

        it("handles load error", async () => {
            vi.mocked(fetchAlerts).mockRejectedValueOnce(new Error("Network error"));

            await useAlertsStore.getState().load();

            expect(useAlertsStore.getState().alerts).toEqual([]);
            expect(useAlertsStore.getState().isLoading).toBe(false);
            expect(useAlertsStore.getState().error).toBe("Network error");
        });

        it("handles non-Error rejection", async () => {
            vi.mocked(fetchAlerts).mockRejectedValueOnce("Unknown error");

            await useAlertsStore.getState().load();

            expect(useAlertsStore.getState().error).toBe("Failed to load alerts");
        });
    });

    describe("loadUnread", () => {
        it("loads unread count successfully", async () => {
            vi.mocked(fetchUnreadCount).mockResolvedValueOnce(3);

            await useAlertsStore.getState().loadUnread();

            expect(useAlertsStore.getState().unreadCount).toBe(3);
        });

        it("silently handles errors", async () => {
            vi.mocked(fetchUnreadCount).mockRejectedValueOnce(new Error("Error"));
            useAlertsStore.setState({ unreadCount: 5 });

            await useAlertsStore.getState().loadUnread();

            // Should not change on error - silent fail
            expect(useAlertsStore.getState().unreadCount).toBe(5);
        });
    });

    describe("markRead", () => {
        it("marks alert as read and decrements count", async () => {
            useAlertsStore.setState({
                alerts: [
                    { id: "1", isRead: false } as any,
                    { id: "2", isRead: false } as any,
                ],
                unreadCount: 2,
            });
            vi.mocked(markAlertRead).mockResolvedValueOnce(undefined);

            await useAlertsStore.getState().markRead("1");

            const state = useAlertsStore.getState();
            expect(state.alerts[0].isRead).toBe(true);
            expect(state.alerts[1].isRead).toBe(false);
            expect(state.unreadCount).toBe(1);
        });

        it("does not go below 0 unread count", async () => {
            useAlertsStore.setState({
                alerts: [{ id: "1", isRead: false } as any],
                unreadCount: 0,
            });
            vi.mocked(markAlertRead).mockResolvedValueOnce(undefined);

            await useAlertsStore.getState().markRead("1");

            expect(useAlertsStore.getState().unreadCount).toBe(0);
        });

        it("silently handles errors", async () => {
            useAlertsStore.setState({
                alerts: [{ id: "1", isRead: false } as any],
                unreadCount: 1,
            });
            vi.mocked(markAlertRead).mockRejectedValueOnce(new Error("Error"));

            await useAlertsStore.getState().markRead("1");

            // State should not change on error
            expect(useAlertsStore.getState().alerts[0].isRead).toBe(false);
        });
    });

    describe("markAllRead", () => {
        it("marks all alerts as read and sets count to 0", async () => {
            useAlertsStore.setState({
                alerts: [
                    { id: "1", isRead: false } as any,
                    { id: "2", isRead: false } as any,
                ],
                unreadCount: 2,
            });
            vi.mocked(markAllAlertsRead).mockResolvedValueOnce(undefined);

            await useAlertsStore.getState().markAllRead();

            const state = useAlertsStore.getState();
            expect(state.alerts.every((a) => a.isRead)).toBe(true);
            expect(state.unreadCount).toBe(0);
        });

        it("silently handles errors", async () => {
            useAlertsStore.setState({
                alerts: [{ id: "1", isRead: false } as any],
                unreadCount: 1,
            });
            vi.mocked(markAllAlertsRead).mockRejectedValueOnce(new Error("Error"));

            await useAlertsStore.getState().markAllRead();

            expect(useAlertsStore.getState().alerts[0].isRead).toBe(false);
        });
    });
});
