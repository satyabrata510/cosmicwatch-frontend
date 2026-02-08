/**
 * Socket.io Client
 *
 * Singleton WebSocket connection manager with auto-reconnection
 * and JWT authentication integration.
 */

import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";
import { AUTH_COOKIE_KEY } from "./constants";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";

let socket: Socket | null = null;

/**
 * Get or create a socket.io client connected with JWT auth.
 * Returns null if no auth token exists.
 */
export function getSocket(): Socket | null {
  const token = Cookies.get(AUTH_COOKIE_KEY);
  if (!token) return null;

  if (!socket || socket.disconnected) {
    socket = io(WS_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }

  return socket;
}

/**
 * Disconnect and clean up the socket.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
