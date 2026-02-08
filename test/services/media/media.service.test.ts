/**
 * Media Service Tests
 */

import { describe, expect, it, vi } from "vitest";

// Mock api
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

import api from "@/lib/api";
import { searchMedia, fetchMediaAsset } from "@/services/media";

describe("searchMedia", () => {
    it("searches media with params", async () => {
        const mockItems = [{ nasa_id: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockItems } } as any);

        const params = { q: "moon" };
        const result = await searchMedia(params);

        expect(api.get).toHaveBeenCalledWith("/media/search", { params });
        expect(result).toEqual(mockItems);
    });
});

describe("fetchMediaAsset", () => {
    it("fetches media asset manifest", async () => {
        const mockAsset = [{ href: "http://test.com/image.jpg" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockAsset } } as any);

        const result = await fetchMediaAsset("nasa-id-123");

        expect(api.get).toHaveBeenCalledWith("/media/asset/nasa-id-123");
        expect(result).toEqual(mockAsset);
    });
});
