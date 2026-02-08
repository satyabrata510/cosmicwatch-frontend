/**
 * Alerts Service Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import type { MockedFunction } from "vitest";

// Mock the api module
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

import api from "@/lib/api";
import {
    fetchAlerts,
    fetchUnreadCount,
    markAllAlertsRead,
    markAlertRead,
} from "@/services/alerts";

const mockGet = api.get as MockedFunction<typeof api.get>;
const mockPatch = api.patch as MockedFunction<typeof api.patch>;

describe("fetchAlerts", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches user alerts", async () => {
        const mockAlerts = [
            { id: "1", alertType: "CLOSE_APPROACH" },
            { id: "2", alertType: "HAZARDOUS_DETECTED" },
        ];
        mockGet.mockResolvedValueOnce({ data: { data: mockAlerts } });

        const result = await fetchAlerts();

        expect(mockGet).toHaveBeenCalledWith("/alerts");
        expect(result).toEqual(mockAlerts);
    });
});

describe("fetchUnreadCount", () => {
    it("fetches unread alert count", async () => {
        mockGet.mockResolvedValueOnce({ data: { data: { count: 5 } } });

        const result = await fetchUnreadCount();

        expect(mockGet).toHaveBeenCalledWith("/alerts/unread-count");
        expect(result).toBe(5);
    });
});

describe("markAllAlertsRead", () => {
    it("marks all alerts as read", async () => {
        mockPatch.mockResolvedValueOnce({});

        await markAllAlertsRead();

        expect(mockPatch).toHaveBeenCalledWith("/alerts/read-all");
    });
});

describe("markAlertRead", () => {
    it("marks single alert as read", async () => {
        mockPatch.mockResolvedValueOnce({});

        await markAlertRead("alert-123");

        expect(mockPatch).toHaveBeenCalledWith("/alerts/alert-123/read");
    });
});
