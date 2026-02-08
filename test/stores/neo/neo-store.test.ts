/**
 * NEO Store Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock the neo service
vi.mock("@/services/neo", () => ({
    fetchNeoFeed: vi.fn(),
    today: vi.fn(() => "2026-02-07"),
}));

import { useNeoStore } from "@/stores/neo-store";
import { fetchNeoFeed, today } from "@/services/neo";

describe("useNeoStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useNeoStore.setState({
            neos: [],
            elementCount: 0,
            hazardousCount: 0,
            isLoading: false,
            error: null,
            startDate: "2026-02-07",
            endDate: "2026-02-07",
        });
    });

    describe("loadFeed", () => {
        it("loads NEO feed and calculates hazardous count", async () => {
            const mockFeed = {
                element_count: 3,
                near_earth_objects: {
                    "2026-02-07": [
                        { id: "1", is_potentially_hazardous_asteroid: true },
                        { id: "2", is_potentially_hazardous_asteroid: false },
                    ],
                    "2026-02-08": [
                        { id: "3", is_potentially_hazardous_asteroid: true },
                    ],
                },
            };
            vi.mocked(fetchNeoFeed).mockResolvedValueOnce(mockFeed as any);

            await useNeoStore.getState().loadFeed("2026-02-07", "2026-02-08");

            const state = useNeoStore.getState();
            expect(state.neos).toHaveLength(3);
            expect(state.elementCount).toBe(3);
            expect(state.hazardousCount).toBe(2);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.startDate).toBe("2026-02-07");
            expect(state.endDate).toBe("2026-02-08");
        });

        it("uses default date when no dates provided", async () => {
            const mockFeed = {
                element_count: 0,
                near_earth_objects: {},
            };
            vi.mocked(fetchNeoFeed).mockResolvedValueOnce(mockFeed as any);

            await useNeoStore.getState().loadFeed();

            expect(fetchNeoFeed).toHaveBeenCalledWith("2026-02-07", "2026-02-07");
        });

        it("handles load error with Error instance", async () => {
            vi.mocked(fetchNeoFeed).mockRejectedValueOnce(new Error("API Error"));

            await useNeoStore.getState().loadFeed();

            const state = useNeoStore.getState();
            expect(state.neos).toEqual([]);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe("API Error");
        });

        it("handles load error with non-Error", async () => {
            vi.mocked(fetchNeoFeed).mockRejectedValueOnce("Unknown");

            await useNeoStore.getState().loadFeed();

            expect(useNeoStore.getState().error).toBe("Failed to load NEO feed");
        });

        it("sets isLoading during fetch", async () => {
            let capturedLoading = false;
            vi.mocked(fetchNeoFeed).mockImplementation(() => {
                capturedLoading = useNeoStore.getState().isLoading;
                return Promise.resolve({ element_count: 0, near_earth_objects: {} } as any);
            });

            await useNeoStore.getState().loadFeed();

            expect(capturedLoading).toBe(true);
        });
    });
});
