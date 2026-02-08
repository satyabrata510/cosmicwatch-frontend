/**
 * APOD Service Tests
 */

import { describe, expect, it, vi } from "vitest";

// Mock api
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

import api from "@/lib/api";
import { fetchApodToday, fetchApodRandom, fetchApodRange } from "@/services/apod";

describe("fetchApodToday", () => {
    it("fetches today's APOD", async () => {
        const mockApod = { title: "Starry Night" };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockApod } } as any);

        const result = await fetchApodToday();

        expect(api.get).toHaveBeenCalledWith("/apod/today");
        expect(result).toEqual(mockApod);
    });

    it("returns null on error", async () => {
        vi.mocked(api.get).mockRejectedValueOnce(new Error("API Error"));

        const result = await fetchApodToday();

        expect(result).toBeNull();
    });
});

describe("fetchApodRandom", () => {
    it("fetches random APODs", async () => {
        const mockApods = [{ title: "A" }, { title: "B" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockApods } } as any);

        const result = await fetchApodRandom(2);

        expect(api.get).toHaveBeenCalledWith("/apod/random", {
            params: { count: 2 },
        });
        expect(result).toEqual(mockApods);
    });
});

describe("fetchApodRange", () => {
    it("fetches APODs for a date range", async () => {
        const mockApods = [{ title: "A" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockApods } } as any);

        const result = await fetchApodRange("2023-01-01", "2023-01-02");

        expect(api.get).toHaveBeenCalledWith("/apod/range", {
            params: { start_date: "2023-01-01", end_date: "2023-01-02" },
        });
        expect(result).toEqual(mockApods);
    });
});
