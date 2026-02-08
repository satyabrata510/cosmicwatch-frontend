/**
 * Watchlist Store Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the watchlist service
vi.mock("@/services/watchlist", () => ({
    fetchWatchlist: vi.fn(),
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
    updateWatchlistItem: vi.fn(),
}));

import { useWatchlistStore } from "@/stores/watchlist-store";
import {
    fetchWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchlistItem,
} from "@/services/watchlist";

describe("useWatchlistStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useWatchlistStore.setState({
            items: [],
            isLoading: false,
            error: null,
        });
    });

    describe("load", () => {
        it("loads watchlist successfully", async () => {
            const mockItems = [
                { id: "1", asteroidId: "ast1", asteroidName: "Asteroid 1" },
                { id: "2", asteroidId: "ast2", asteroidName: "Asteroid 2" },
            ];
            vi.mocked(fetchWatchlist).mockResolvedValueOnce(mockItems as any);

            await useWatchlistStore.getState().load();

            expect(fetchWatchlist).toHaveBeenCalledWith(1, 100);
            expect(useWatchlistStore.getState().items).toEqual(mockItems);
            expect(useWatchlistStore.getState().isLoading).toBe(false);
        });

        it("handles load error with Error instance", async () => {
            vi.mocked(fetchWatchlist).mockRejectedValueOnce(new Error("Network error"));

            await useWatchlistStore.getState().load();

            expect(useWatchlistStore.getState().error).toBe("Network error");
            expect(useWatchlistStore.getState().isLoading).toBe(false);
        });

        it("handles load error with non-Error", async () => {
            vi.mocked(fetchWatchlist).mockRejectedValueOnce("Unknown");

            await useWatchlistStore.getState().load();

            expect(useWatchlistStore.getState().error).toBe("Failed to load watchlist");
        });
    });

    describe("add", () => {
        it("adds item to watchlist", async () => {
            const newItem = { id: "1", asteroidId: "ast1", asteroidName: "New Asteroid" };
            vi.mocked(addToWatchlist).mockResolvedValueOnce(newItem as any);

            await useWatchlistStore.getState().add({
                asteroidId: "ast1",
                asteroidName: "New Asteroid",
            });

            expect(useWatchlistStore.getState().items[0]).toEqual(newItem);
            expect(useWatchlistStore.getState().error).toBeNull();
        });

        it("handles add error and throws", async () => {
            vi.mocked(addToWatchlist).mockRejectedValueOnce(new Error("Failed"));

            await expect(
                useWatchlistStore.getState().add({ asteroidId: "x", asteroidName: "X" })
            ).rejects.toThrow();

            expect(useWatchlistStore.getState().error).toBe("Failed");
        });

        it("handles add error with non-Error and throws", async () => {
            vi.mocked(addToWatchlist).mockRejectedValueOnce("Unknown");

            await expect(
                useWatchlistStore.getState().add({ asteroidId: "x", asteroidName: "X" })
            ).rejects.toBe("Unknown");

            expect(useWatchlistStore.getState().error).toBe("Failed to add");
        });
    });

    describe("remove", () => {
        it("removes item from watchlist", async () => {
            useWatchlistStore.setState({
                items: [
                    { id: "1", asteroidId: "ast1" } as any,
                    { id: "2", asteroidId: "ast2" } as any,
                ],
            });
            vi.mocked(removeFromWatchlist).mockResolvedValueOnce(undefined);

            await useWatchlistStore.getState().remove("ast1");

            expect(useWatchlistStore.getState().items).toHaveLength(1);
            expect(useWatchlistStore.getState().items[0].asteroidId).toBe("ast2");
        });

        it("handles remove error and throws", async () => {
            useWatchlistStore.setState({ items: [{ id: "1", asteroidId: "ast1" } as any] });
            vi.mocked(removeFromWatchlist).mockRejectedValueOnce(new Error("Not found"));

            await expect(useWatchlistStore.getState().remove("ast1")).rejects.toThrow();

            expect(useWatchlistStore.getState().error).toBe("Not found");
        });

        it("handles remove error with non-Error and throws", async () => {
            useWatchlistStore.setState({ items: [] });
            vi.mocked(removeFromWatchlist).mockRejectedValueOnce("Unknown");

            await expect(useWatchlistStore.getState().remove("x")).rejects.toBe("Unknown");

            expect(useWatchlistStore.getState().error).toBe("Failed to remove");
        });
    });

    describe("update", () => {
        it("updates watchlist item", async () => {
            useWatchlistStore.setState({
                items: [{ id: "1", asteroidId: "ast1", alertOnApproach: false } as any],
            });
            vi.mocked(updateWatchlistItem).mockResolvedValueOnce({
                alertOnApproach: true,
            } as any);

            await useWatchlistStore.getState().update("ast1", { alertOnApproach: true });

            expect(useWatchlistStore.getState().items[0].alertOnApproach).toBe(true);
        });

        it("handles update error and throws", async () => {
            useWatchlistStore.setState({
                items: [{ id: "1", asteroidId: "ast1" } as any],
            });
            vi.mocked(updateWatchlistItem).mockRejectedValueOnce(new Error("Update failed"));

            await expect(
                useWatchlistStore.getState().update("ast1", { alertOnApproach: true })
            ).rejects.toThrow();

            expect(useWatchlistStore.getState().error).toBe("Update failed");
        });

        it("handles update error with non-Error and throws", async () => {
            useWatchlistStore.setState({ items: [] });
            vi.mocked(updateWatchlistItem).mockRejectedValueOnce("Unknown");

            await expect(
                useWatchlistStore.getState().update("x", { alertOnApproach: true })
            ).rejects.toBe("Unknown");

            expect(useWatchlistStore.getState().error).toBe("Failed to update");
        });
        it("ignores update for non-existent item", async () => {
            const initialItem = { id: "1", asteroidId: "ast1", alertOnApproach: false };
            useWatchlistStore.setState({
                items: [initialItem as any],
            });
            vi.mocked(updateWatchlistItem).mockResolvedValueOnce({
                alertOnApproach: true,
            } as any);

            await useWatchlistStore.getState().update("non-existent", { alertOnApproach: true });

            expect(useWatchlistStore.getState().items[0]).toEqual(initialItem);
        });
    });

    describe("isWatched", () => {
        it("returns true when asteroid is in watchlist", () => {
            useWatchlistStore.setState({
                items: [{ id: "1", asteroidId: "ast1" } as any],
            });

            expect(useWatchlistStore.getState().isWatched("ast1")).toBe(true);
        });

        it("returns false when asteroid is not in watchlist", () => {
            useWatchlistStore.setState({
                items: [{ id: "1", asteroidId: "ast1" } as any],
            });

            expect(useWatchlistStore.getState().isWatched("ast2")).toBe(false);
        });

        it("returns false for empty watchlist", () => {
            expect(useWatchlistStore.getState().isWatched("any")).toBe(false);
        });
    });
});
