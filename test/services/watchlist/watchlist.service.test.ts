/**
 * Watchlist Service Tests
 */

import { describe, expect, it, vi } from "vitest";

// Mock api
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
    },
}));

import api from "@/lib/api";
import {
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
} from "@/services/watchlist";

describe("fetchWatchlist", () => {
    it("fetches watchlist with default pagination", async () => {
        const mockItems = [{ id: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockItems } } as any);

        const result = await fetchWatchlist();

        expect(api.get).toHaveBeenCalledWith("/watchlist", {
            params: { page: 1, limit: 20 },
        });
        expect(result).toEqual(mockItems);
    });

    it("fetches watchlist with custom pagination", async () => {
        const mockItems = [{ id: "1" }];
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockItems } } as any);

        await fetchWatchlist(2, 50);

        expect(api.get).toHaveBeenCalledWith("/watchlist", {
            params: { page: 2, limit: 50 },
        });
    });
});

describe("addToWatchlist", () => {
    it("adds item to watchlist", async () => {
        const mockItem = { id: "1", asteroidId: "ast1" };
        vi.mocked(api.post).mockResolvedValueOnce({ data: { data: mockItem } } as any);

        const payload = { asteroidId: "ast1", asteroidName: "Asteroid 1" };
        const result = await addToWatchlist(payload);

        expect(api.post).toHaveBeenCalledWith("/watchlist", payload);
        expect(result).toEqual(mockItem);
    });
});

describe("removeFromWatchlist", () => {
    it("removes item from watchlist", async () => {
        vi.mocked(api.delete).mockResolvedValueOnce({} as any);

        await removeFromWatchlist("ast1");

        expect(api.delete).toHaveBeenCalledWith("/watchlist/ast1");
    });
});

describe("updateWatchlistItem", () => {
    it("updates watchlist item", async () => {
        const mockItem = { id: "1", alertOnApproach: true };
        vi.mocked(api.patch).mockResolvedValueOnce({ data: { data: mockItem } } as any);

        const payload = { alertOnApproach: true };
        const result = await updateWatchlistItem("ast1", payload);

        expect(api.patch).toHaveBeenCalledWith("/watchlist/ast1", payload);
        expect(result).toEqual(mockItem);
    });
});
