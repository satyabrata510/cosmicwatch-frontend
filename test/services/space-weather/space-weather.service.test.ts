/**
 * Space Weather Service Tests
 */

import { describe, expect, it, vi } from "vitest";

// Mock api
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

import api from "@/lib/api";
import {
    fetchCME,
    fetchSolarFlares,
    fetchGeoStorms,
    fetchSpaceWeatherNotifications,
} from "@/services/space-weather";

describe("fetchCME", () => {
    it("fetches CMEs with params", async () => {
        const mockResponse = { totalCount: 1, events: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { start_date: "2023-01-01" };
        const result = await fetchCME(params);

        expect(api.get).toHaveBeenCalledWith("/space-weather/cme", { params });
        expect(result).toEqual(mockResponse);
    });
});

describe("fetchSolarFlares", () => {
    it("fetches solar flares with params", async () => {
        const mockResponse = { totalCount: 2, events: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { start_date: "2023-01-01" };
        const result = await fetchSolarFlares(params);

        expect(api.get).toHaveBeenCalledWith("/space-weather/flares", { params });
        expect(result).toEqual(mockResponse);
    });
});

describe("fetchGeoStorms", () => {
    it("fetches geomagnetic storms with params", async () => {
        const mockResponse = { totalCount: 3, events: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { start_date: "2023-01-01" };
        const result = await fetchGeoStorms(params);

        expect(api.get).toHaveBeenCalledWith("/space-weather/storms", { params });
        expect(result).toEqual(mockResponse);
    });
});

describe("fetchSpaceWeatherNotifications", () => {
    it("fetches notifications with params", async () => {
        const mockResponse = { totalCount: 5, notifications: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { type: "FLARE" };
        const result = await fetchSpaceWeatherNotifications(params);

        expect(api.get).toHaveBeenCalledWith("/space-weather/notifications", { params });
        expect(result).toEqual(mockResponse);
    });
});
