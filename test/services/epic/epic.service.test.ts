/**
 * EPIC Service Tests
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
    fetchEpicNatural,
    fetchEpicEnhanced,
    fetchEpicDates,
} from "@/services/epic";

describe("fetchEpicNatural", () => {
    it("fetches natural images without date", async () => {
        const mockImages = [{ identifier: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockImages } } as any);

        const result = await fetchEpicNatural();

        expect(api.get).toHaveBeenCalledWith("/epic/natural", { params: undefined });
        expect(result).toEqual(mockImages);
    });

    it("fetches natural images with date", async () => {
        const mockImages = [{ identifier: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockImages } } as any);

        const result = await fetchEpicNatural("2023-01-01");

        expect(api.get).toHaveBeenCalledWith("/epic/natural", {
            params: { date: "2023-01-01" },
        });
        expect(result).toEqual(mockImages);
    });
});

describe("fetchEpicEnhanced", () => {
    it("fetches enhanced images without date", async () => {
        const mockImages = [{ identifier: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockImages } } as any);

        const result = await fetchEpicEnhanced();

        expect(api.get).toHaveBeenCalledWith("/epic/enhanced", { params: undefined });
        expect(result).toEqual(mockImages);
    });

    it("fetches enhanced images with date", async () => {
        const mockImages = [{ identifier: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockImages } } as any);

        const result = await fetchEpicEnhanced("2023-01-01");

        expect(api.get).toHaveBeenCalledWith("/epic/enhanced", {
            params: { date: "2023-01-01" },
        });
        expect(result).toEqual(mockImages);
    });
});

describe("fetchEpicDates", () => {
    it("fetches available dates", async () => {
        const mockDates = ["2023-01-01"];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockDates } } as any);

        const result = await fetchEpicDates("natural");

        expect(api.get).toHaveBeenCalledWith("/epic/dates", {
            params: { type: "natural" },
        });
        expect(result).toEqual(mockDates);
    });
});
