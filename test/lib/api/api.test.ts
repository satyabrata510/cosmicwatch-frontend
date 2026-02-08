/**
 * API Client Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth-store";
import axios from "axios";

// Hoist mocks
const { mockRequestUse, mockResponseUse, mockAxiosInstance, mockLogout } = vi.hoisted(() => {
    const requestUse = vi.fn();
    const responseUse = vi.fn();
    const logout = vi.fn();
    const instance = vi.fn(() => Promise.resolve({ data: {} }));

    // @ts-ignore
    instance.interceptors = {
        request: { use: requestUse },
        response: { use: responseUse },
    };
    // @ts-ignore
    instance.get = vi.fn();
    // @ts-ignore
    instance.post = vi.fn();
    // @ts-ignore
    instance.defaults = { headers: { common: {} } };

    return {
        mockRequestUse: requestUse,
        mockResponseUse: responseUse,
        mockAxiosInstance: instance,
        mockLogout: logout
    };
});

// Mock axios module: handle default export correctly
vi.mock("axios", () => {
    const axiosInstance = mockAxiosInstance;
    // @ts-ignore
    axiosInstance.create = vi.fn(() => mockAxiosInstance);
    // @ts-ignore
    axiosInstance.post = vi.fn();
    return {
        default: axiosInstance,
    };
});

vi.mock("js-cookie", () => ({
    default: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
    },
}));

vi.mock("@/stores/auth-store", () => ({
    useAuthStore: {
        getState: vi.fn(() => ({
            logout: mockLogout,
        })),
    },
}));

describe("API Client", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRequestUse.mockClear();
        mockResponseUse.mockClear();
    });

    describe("Interceptor Registration", () => {
        it("registers interceptors on load", async () => {
            vi.resetModules();
            await import("@/lib/api");
            expect(mockRequestUse).toHaveBeenCalled();
            expect(mockResponseUse).toHaveBeenCalled();
        });
    });

    describe("Request Interceptor", () => {
        it("attaches Authorization header if token exists", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const requestInterceptor = mockRequestUse.mock.calls[0][0];

            vi.mocked(Cookies.get).mockReturnValue("valid-token" as never);
            const config = { headers: {} };

            const result = await requestInterceptor(config);

            expect(result.headers.Authorization).toBe("Bearer valid-token");
        });

        it("does not attach header if no token", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const requestInterceptor = mockRequestUse.mock.calls[0][0];

            vi.mocked(Cookies.get).mockReturnValue(undefined as never);
            const config = { headers: {} };

            const result = await requestInterceptor(config);

            expect(result.headers.Authorization).toBeUndefined();
        });
    });

    describe("Response Interceptor", () => {
        it("returns response if successful", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const successInterceptor = mockResponseUse.mock.calls[0][0];

            const response = { data: "ok" };
            const result = await successInterceptor(response);
            expect(result).toBe(response);
        });

        it("refreshes token on 401", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const errorInterceptor = mockResponseUse.mock.calls[0][1];

            vi.mocked(Cookies.get).mockReturnValue("refresh-token" as never);

            // Mock axios.post for the refresh call
            vi.mocked(axios.post).mockResolvedValueOnce({
                data: {
                    data: {
                        accessToken: "new-access",
                        refreshToken: "new-refresh",
                    }
                }
            } as any);

            // Mock the retry call (api(originalRequest))
            const retriedResponse = { data: "retried" };
            // @ts-ignore
            mockAxiosInstance.mockResolvedValueOnce(retriedResponse);

            const error = {
                config: { _retry: false, url: "/api/test", headers: {} },
                response: { status: 401 },
            };

            const result = await errorInterceptor(error);

            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/auth/refresh"), {
                refreshToken: "refresh-token",
            });
            expect(Cookies.set).toHaveBeenCalledWith("cw_access_token", "new-access", expect.any(Object));
            expect(result).toBe(retriedResponse);
        });

        it("logs out on refresh failure", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const errorInterceptor = mockResponseUse.mock.calls[0][1];

            vi.mocked(Cookies.get).mockReturnValue("refresh-token" as never);
            vi.mocked(axios.post).mockRejectedValueOnce(new Error("Refresh failed"));

            const error = {
                config: { _retry: false, url: "/api/test", headers: {} },
                response: { status: 401 },
            };

            try {
                await errorInterceptor(error);
                throw new Error("Should have rejected");
            } catch (e) {
                // The interceptor bubbles up the original error
                expect(e).toBe(error);
                expect(mockLogout).toHaveBeenCalled();
            }
        });

        it("logs out if no refresh token", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const errorInterceptor = mockResponseUse.mock.calls[0][1];

            vi.mocked(Cookies.get).mockReturnValue(undefined as never); // No refresh token

            const error = {
                config: { _retry: false, url: "/api/test", headers: {} },
                response: { status: 401 },
            };

            try {
                await errorInterceptor(error);
                throw new Error("Should have rejected");
            } catch (e) {
                // The interceptor catches the error and bubbles up the original error
                expect(e).toBe(error);
                expect(mockLogout).toHaveBeenCalled();
            }
        });

        it("rejects immediately for non-401 errors", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const errorInterceptor = mockResponseUse.mock.calls[0][1];

            const error = {
                config: { url: "/api/test", headers: {} },
                response: { status: 500 },
            };

            try {
                await errorInterceptor(error);
                throw new Error("Should have rejected");
            } catch (e) {
                expect(e).toBe(error);
            }
        });

        it("rejects 401 if already retried", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const errorInterceptor = mockResponseUse.mock.calls[0][1];

            const error = {
                config: { _retry: true, url: "/api/test", headers: {} },
                response: { status: 401 },
            };

            try {
                await errorInterceptor(error);
                throw new Error("Should have rejected");
            } catch (e) {
                expect(e).toBe(error);
            }
        });
        it("handles missing url in config", async () => {
            vi.resetModules();
            await import("@/lib/api");
            const errorInterceptor = mockResponseUse.mock.calls[0][1];

            const error = {
                config: { _retry: false, headers: {} }, // No url
                response: { status: 401 },
            };

            try {
                await errorInterceptor(error);
            } catch (e) {
                expect(e).toBe(error);
            }
        });
    });
});
