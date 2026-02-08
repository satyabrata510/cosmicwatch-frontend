/**
 * Auth Service Tests
 */

import { describe, expect, it, vi } from "vitest";

// Mock api
vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
    },
}));

import api from "@/lib/api";
import { fetchProfile } from "@/services/auth";

describe("fetchProfile", () => {
    it("fetches user profile", async () => {
        const mockUser = { id: "1", name: "Test User" };
        vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockUser } } as any);

        const result = await fetchProfile();

        expect(api.get).toHaveBeenCalledWith("/auth/profile");
        expect(result).toEqual(mockUser);
    });
});
