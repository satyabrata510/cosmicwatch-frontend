/**
 * Socket Utility Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { getSocket, disconnectSocket } from "@/lib/socket";
import { io } from "socket.io-client";
import Cookies from "js-cookie";

// Mock dependencies
vi.mock("socket.io-client", () => ({
    io: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        close: vi.fn(),
        removeAllListeners: vi.fn(), // Added this
        connected: false,
    })),
}));

vi.mock("js-cookie", () => ({
    default: {
        get: vi.fn(),
    },
}));

describe("Socket Utility", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        disconnectSocket();
    });

    it("creates a new socket connection if none exists", () => {
        vi.mocked(Cookies.get).mockReturnValue("valid-token" as never);
        const socket = getSocket();

        expect(io).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            auth: { token: "valid-token" },
        }));
        expect(socket).toBeDefined();
    });

    it("reuses existing socket connection", () => {
        vi.mocked(Cookies.get).mockReturnValue("valid-token" as never);
        const socket1 = getSocket();
        const socket2 = getSocket();

        expect(io).toHaveBeenCalledTimes(1);
        expect(socket1).toBe(socket2);
    });

    it("disconnects socket", () => {
        vi.mocked(Cookies.get).mockReturnValue("valid-token" as never);
        const socket = getSocket();
        // @ts-ignore
        socket.removeAllListeners = vi.fn(); // Ensure method exists on the instance if mock factory isn't enough (it should be)

        disconnectSocket();

        expect(socket?.disconnect).toHaveBeenCalled();
    });

    it("does not create socket if no token", () => {
        vi.mocked(Cookies.get).mockReturnValue(undefined as never);
        const socket = getSocket();
        expect(socket).toBeNull();
    });
});
