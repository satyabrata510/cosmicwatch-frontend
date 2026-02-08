/**
 * Chat Store
 *
 * Zustand store for the real-time chat feature.
 * Manages Socket.io connections, room state, and message history.
 */

import type { Socket } from "socket.io-client";
import { create } from "zustand";
import { disconnectSocket, getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";

interface TypingUser {
  userId: string;
  email: string;
}

interface ChatState {
  socket: Socket | null;
  connected: boolean;
  currentRoom: string | null;
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  error: string | null;

  connect: () => void;
  disconnect: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (content: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  connected: false,
  currentRoom: null,
  messages: [],
  typingUsers: [],
  error: null,

  connect: () => {
    const existing = get().socket;
    if (existing?.connected) return;

    const s = getSocket();
    if (!s) {
      set({ error: "Not authenticated" });
      return;
    }

    s.on("connect", () => {
      set({ connected: true, error: null });
    });

    s.on("disconnect", () => {
      set({ connected: false });
    });

    s.on("connect_error", (err) => {
      set({ error: err.message, connected: false });
    });

    s.on("room_history", (data: { roomId: string; messages: ChatMessage[] }) => {
      set({ messages: data.messages });
    });

    s.on("new_message", (msg: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, msg] }));
    });

    s.on("user_typing", (data: TypingUser) => {
      set((state) => {
        if (state.typingUsers.some((u) => u.userId === data.userId)) return state;
        return { typingUsers: [...state.typingUsers, data] };
      });
    });

    s.on("user_stopped_typing", (data: { userId: string }) => {
      set((state) => ({
        typingUsers: state.typingUsers.filter((u) => u.userId !== data.userId),
      }));
    });

    s.on("error", (data: { message: string }) => {
      set({ error: data.message });
    });

    s.connect();
    set({ socket: s });
  },

  disconnect: () => {
    const { currentRoom } = get();
    if (currentRoom) get().leaveRoom();
    disconnectSocket();
    set({ socket: null, connected: false, messages: [], typingUsers: [], currentRoom: null });
  },

  joinRoom: (roomId) => {
    const { socket, currentRoom } = get();
    if (!socket) return;
    if (currentRoom) socket.emit("leave_room", currentRoom);
    socket.emit("join_room", roomId);
    set({ currentRoom: roomId, messages: [], typingUsers: [] });
  },

  leaveRoom: () => {
    const { socket, currentRoom } = get();
    if (socket && currentRoom) {
      socket.emit("leave_room", currentRoom);
    }
    set({ currentRoom: null, messages: [], typingUsers: [] });
  },

  sendMessage: (content) => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;
    socket.emit("send_message", { roomId: currentRoom, content });
  },

  startTyping: () => {
    const { socket, currentRoom } = get();
    if (socket && currentRoom) socket.emit("typing_start", currentRoom);
  },

  stopTyping: () => {
    const { socket, currentRoom } = get();
    if (socket && currentRoom) socket.emit("typing_stop", currentRoom);
  },
}));
