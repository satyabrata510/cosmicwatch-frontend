/**
 * NEO Service Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import type { MockedFunction } from "vitest";

// Mock the api module before importing services
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

import api from "@/lib/api";
import {
    today,
    fetchNeoFeed,
    fetchNeoById,
    fetchNeoRisk,
    fetchNeoRiskById,
    fetchNeoSentryRisk,
} from "@/services/neo";

const mockGet = api.get as MockedFunction<typeof api.get>;

describe("today helper", () => {
    it("returns today's date in YYYY-MM-DD format", () => {
        const result = today();
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        const date = new Date();
        const expected = date.toISOString().slice(0, 10);
        expect(result).toBe(expected);
    });
});

describe("fetchNeoFeed", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches NEO feed with default dates", async () => {
        const mockFeed = {
            element_count: 2,
            near_earth_objects: { "2026-02-07": [{ id: "1" }] },
        };
        mockGet.mockResolvedValueOnce({ data: { data: mockFeed } });

        const result = await fetchNeoFeed();

        expect(mockGet).toHaveBeenCalledWith("/neo/feed", {
            params: { start_date: today(), end_date: today() },
        });
        expect(result).toEqual(mockFeed);
    });

    it("fetches NEO feed with custom dates", async () => {
        const mockFeed = {
            element_count: 5,
            near_earth_objects: {},
        };
        mockGet.mockResolvedValueOnce({ data: { data: mockFeed } });

        const result = await fetchNeoFeed("2026-01-01", "2026-01-07");

        expect(mockGet).toHaveBeenCalledWith("/neo/feed", {
            params: { start_date: "2026-01-01", end_date: "2026-01-07" },
        });
        expect(result).toEqual(mockFeed);
    });
});

describe("fetchNeoById", () => {
    it("fetches single NEO by ID", async () => {
        const mockNeo = { id: "123", name: "Asteroid X" };
        mockGet.mockResolvedValueOnce({ data: { data: mockNeo } });

        const result = await fetchNeoById("123");

        expect(mockGet).toHaveBeenCalledWith("/neo/lookup/123");
        expect(result).toEqual(mockNeo);
    });
});

describe("fetchNeoRisk", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns assessments array when response is wrapped", async () => {
        const assessments = [{ risk_score: 50 }];
        mockGet.mockResolvedValueOnce({ data: { data: { assessments } } });

        const result = await fetchNeoRisk("2026-01-01", "2026-01-02");

        expect(result).toEqual(assessments);
    });

    it("returns array directly when response is already an array", async () => {
        const riskScores = [{ risk_score: 30 }];
        mockGet.mockResolvedValueOnce({ data: { data: riskScores } });

        const result = await fetchNeoRisk();

        expect(result).toEqual(riskScores);
    });

    it("returns empty array when no assessments", async () => {
        mockGet.mockResolvedValueOnce({ data: { data: {} } });

        const result = await fetchNeoRisk();

        expect(result).toEqual([]);
    });
});

describe("fetchNeoRiskById", () => {
    it("returns risk score directly when not double-wrapped", async () => {
        const riskScore = { risk_score: 75, asteroid_id: "123" };
        mockGet.mockResolvedValueOnce({ data: { data: riskScore } });

        const result = await fetchNeoRiskById("123");

        expect(mockGet).toHaveBeenCalledWith("/neo/lookup/123/risk");
        expect(result).toEqual(riskScore);
    });

    it("unwraps double-wrapped response", async () => {
        const riskScore = { risk_score: 75, asteroid_id: "123" };
        mockGet.mockResolvedValueOnce({ data: { data: { data: riskScore } } });

        const result = await fetchNeoRiskById("123");

        expect(result).toEqual(riskScore);
    });
});

describe("fetchNeoSentryRisk", () => {
    it("returns sentry risk score directly when not double-wrapped", async () => {
        const sentryScore = { risk_score: 80, sentry_available: true };
        mockGet.mockResolvedValueOnce({ data: { data: sentryScore } });

        const result = await fetchNeoSentryRisk("123");

        expect(mockGet).toHaveBeenCalledWith("/neo/lookup/123/sentry-risk");
        expect(result).toEqual(sentryScore);
    });

    it("unwraps double-wrapped sentry response", async () => {
        const sentryScore = { risk_score: 80, sentry_available: true };
        mockGet.mockResolvedValueOnce({ data: { data: { data: sentryScore } } });

        const result = await fetchNeoSentryRisk("123");

        expect(result).toEqual(sentryScore);
    });
});
