/**
 * CNEOS Service Tests
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
    fetchCloseApproaches,
    fetchSentryObjects,
    fetchSentryByDesignation,
    fetchFireballs,
} from "@/services/cneos";

describe("fetchCloseApproaches", () => {
    it("fetches closing approaches with params", async () => {
        const mockResponse = { totalCount: 1, approaches: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { limit: 10, pha: true };
        const result = await fetchCloseApproaches(params);

        expect(api.get).toHaveBeenCalledWith("/cneos/close-approaches", { params });
        expect(result).toEqual(mockResponse);
    });
});

describe("fetchSentryObjects", () => {
    it("fetches sentry objects with params", async () => {
        const mockResponse = { totalCount: 1, objects: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { ps_min: -2 };
        const result = await fetchSentryObjects(params);

        expect(api.get).toHaveBeenCalledWith("/cneos/sentry", { params });
        expect(result).toEqual(mockResponse);
    });
});

describe("fetchSentryByDesignation", () => {
    it("fetches sentry object details", async () => {
        const mockDetail = { designation: "99942" };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockDetail } } as any);

        const result = await fetchSentryByDesignation("99942");

        expect(api.get).toHaveBeenCalledWith("/cneos/sentry/99942");
        expect(result).toEqual(mockDetail);
    });
});

describe("fetchFireballs", () => {
    it("fetches fireballs with params", async () => {
        const mockResponse = { totalCount: 5, fireballs: [] };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockResponse } } as any);

        const params = { limit: 5 };
        const result = await fetchFireballs(params);

        expect(api.get).toHaveBeenCalledWith("/cneos/fireballs", { params });
        expect(result).toEqual(mockResponse);
    });
});
