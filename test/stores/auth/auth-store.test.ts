/**
 * Auth Store Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { disconnectSocket } from "@/lib/socket";

// Mock dependencies
vi.mock("js-cookie", () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
    },
}));

vi.mock("@/lib/socket", () => ({
    disconnectSocket: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe("useAuthStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.setState({
            user: null,
            isLoading: true,
            isAuthenticated: false,
        });
    });

    describe("hydrate", () => {
        it("does nothing if no token found", async () => {
            vi.mocked(Cookies.get).mockReturnValue(undefined as never);

            await useAuthStore.getState().hydrate();

            expect(useAuthStore.getState().isLoading).toBe(false);
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
            expect(api.get).not.toHaveBeenCalled();
        });

        it("fetches profile if token exists", async () => {
            vi.mocked(Cookies.get).mockReturnValue("valid-token" as never);
            const mockUser = { id: "1", name: "User" };
            vi.mocked(api.get).mockResolvedValueOnce({ data: { data: mockUser } } as any);

            await useAuthStore.getState().hydrate();

            expect(api.get).toHaveBeenCalledWith("/auth/profile");
            expect(useAuthStore.getState().user).toEqual(mockUser);
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
            expect(useAuthStore.getState().isLoading).toBe(false);
        });

        it("logs out if profile fetch fails", async () => {
            vi.mocked(Cookies.get).mockReturnValue("invalid-token" as never);
            vi.mocked(api.get).mockRejectedValueOnce(new Error("Unauthorized"));

            await useAuthStore.getState().hydrate();

            expect(Cookies.remove).toHaveBeenCalled();
            expect(useAuthStore.getState().user).toBeNull();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
            expect(useAuthStore.getState().isLoading).toBe(false);
        });
    });

    describe("login", () => {
        it("logs in successfully and sets tokens", async () => {
            const mockAuthData = {
                user: { id: "1", name: "User" },
                accessToken: "access-123",
                refreshToken: "refresh-123",
            };
            vi.mocked(api.post).mockResolvedValueOnce({ data: { data: mockAuthData } } as any);

            await useAuthStore.getState().login({ email: "test@test.com", password: "pw" });

            expect(api.post).toHaveBeenCalledWith("/auth/login", {
                email: "test@test.com",
                password: "pw",
            });
            expect(Cookies.set).toHaveBeenCalledWith("cw_access_token", "access-123", expect.any(Object));
            expect(Cookies.set).toHaveBeenCalledWith("cw_refresh_token", "refresh-123", expect.any(Object));
            expect(useAuthStore.getState().user).toEqual(mockAuthData.user);
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
        });
    });

    describe("register", () => {
        it("registers successfully and sets tokens", async () => {
            const mockAuthData = {
                user: { id: "1", name: "User" },
                accessToken: "access-123",
                refreshToken: "refresh-123",
            };
            vi.mocked(api.post).mockResolvedValueOnce({ data: { data: mockAuthData } } as any);

            await useAuthStore.getState().register({
                name: "User",
                email: "test@test.com",
                password: "pw",
            });

            expect(api.post).toHaveBeenCalledWith("/auth/register", {
                name: "User",
                email: "test@test.com",
                password: "pw",
            });
            expect(Cookies.set).toHaveBeenCalledTimes(2);
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
        });
    });

    describe("logout", () => {
        it("logs out, clears tokens, and disconnects socket", () => {
            useAuthStore.setState({ user: { id: "1" } as any, isAuthenticated: true });

            useAuthStore.getState().logout();

            expect(disconnectSocket).toHaveBeenCalled();
            expect(Cookies.remove).toHaveBeenCalledWith("cw_access_token");
            expect(Cookies.remove).toHaveBeenCalledWith("cw_refresh_token");
            expect(useAuthStore.getState().user).toBeNull();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });
        describe("security", () => {
            it("sets secure flag on cookies if protocol is https", async () => {
                vi.resetModules();
                // Mock https protocol
                const originalLocation = window.location;
                Object.defineProperty(window, "location", {
                    value: { protocol: "https:" },
                    writable: true,
                });

                // Re-import to evaluate IS_SECURE
                const { useAuthStore: paramsStore } = await import("@/stores/auth-store");
                // Make sure we are using the re-imported store's login
                const mockAuthData = {
                    user: { id: "1", name: "User" },
                    accessToken: "access-123",
                    refreshToken: "refresh-123",
                };
                // Mock api.post again because resetModules clears its mock state? 
                // No, api mock is hoisted/external. But we need to make sure import uses it.
                // Actually, `vi.mock("@/lib/api", ...)` should persist? 
                // API mock is defined at top of file.
                // But verify if resetModules clears it. default: resetModules() re-evaluates modules.
                // Mocks might need to be re-applied if they were local?
                // The mock in auth-store.test.ts is `vi.mock("@/lib/api", ...)` at top level.
                // It should be fine.

                vi.mocked(api.post).mockResolvedValueOnce({ data: { data: mockAuthData } } as any);

                await paramsStore.getState().login({ email: "secure@test.com", password: "pw" });

                expect(Cookies.set).toHaveBeenCalledWith(
                    "cw_access_token",
                    "access-123",
                    expect.objectContaining({ secure: true })
                );

                // Restore window location
                Object.defineProperty(window, "location", {
                    value: originalLocation,
                    writable: true
                });
            });
        });
    });
});
