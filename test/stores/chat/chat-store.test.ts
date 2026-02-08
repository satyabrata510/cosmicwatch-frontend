/**
 * Chat Store Tests
 */

import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock socket module
const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
};

vi.mock("@/lib/socket", () => ({
    getSocket: vi.fn(() => mockSocket),
    disconnectSocket: vi.fn(),
}));

import { useChatStore } from "@/stores/chat-store";
import { getSocket, disconnectSocket } from "@/lib/socket";

describe("useChatStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSocket.connected = false;
        useChatStore.setState({
            socket: null,
            connected: false,
            currentRoom: null,
            messages: [],
            typingUsers: [],
            error: null,
        });
    });

    describe("connect", () => {
        it("connects to socket and registers event handlers", () => {
            useChatStore.getState().connect();

            expect(getSocket).toHaveBeenCalled();
            expect(mockSocket.on).toHaveBeenCalledWith("connect", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("connect_error", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("room_history", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("new_message", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("user_typing", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("user_stopped_typing", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("error", expect.any(Function));
            expect(mockSocket.connect).toHaveBeenCalled();
        });

        it("does not reconnect if already connected", () => {
            mockSocket.connected = true;
            useChatStore.setState({ socket: mockSocket as any });

            useChatStore.getState().connect();

            expect(mockSocket.connect).not.toHaveBeenCalled();
        });

        it("sets error if socket not available", () => {
            vi.mocked(getSocket).mockReturnValueOnce(null);

            useChatStore.getState().connect();

            expect(useChatStore.getState().error).toBe("Not authenticated");
        });

        it("handles connect event", () => {
            useChatStore.getState().connect();

            const connectHandler = mockSocket.on.mock.calls.find((c) => c[0] === "connect")?.[1];
            connectHandler?.();

            expect(useChatStore.getState().connected).toBe(true);
            expect(useChatStore.getState().error).toBeNull();
        });

        it("handles disconnect event", () => {
            useChatStore.getState().connect();
            useChatStore.setState({ connected: true });

            const disconnectHandler = mockSocket.on.mock.calls.find((c) => c[0] === "disconnect")?.[1];
            disconnectHandler?.();

            expect(useChatStore.getState().connected).toBe(false);
        });

        it("handles connect_error event", () => {
            useChatStore.getState().connect();

            const errorHandler = mockSocket.on.mock.calls.find((c) => c[0] === "connect_error")?.[1];
            errorHandler?.({ message: "Connection failed" });

            expect(useChatStore.getState().error).toBe("Connection failed");
            expect(useChatStore.getState().connected).toBe(false);
        });

        it("handles room_history event", () => {
            useChatStore.getState().connect();

            const historyHandler = mockSocket.on.mock.calls.find((c) => c[0] === "room_history")?.[1];
            historyHandler?.({ roomId: "room1", messages: [{ id: "msg1" }] });

            expect(useChatStore.getState().messages).toEqual([{ id: "msg1" }]);
        });

        it("handles new_message event", () => {
            useChatStore.getState().connect();
            useChatStore.setState({ messages: [{ id: "msg1" } as any] });

            const messageHandler = mockSocket.on.mock.calls.find((c) => c[0] === "new_message")?.[1];
            messageHandler?.({ id: "msg2" });

            expect(useChatStore.getState().messages).toHaveLength(2);
        });

        it("handles user_typing event", () => {
            useChatStore.getState().connect();

            const typingHandler = mockSocket.on.mock.calls.find((c) => c[0] === "user_typing")?.[1];
            typingHandler?.({ userId: "user1", email: "user@test.com" });

            expect(useChatStore.getState().typingUsers).toEqual([
                { userId: "user1", email: "user@test.com" },
            ]);
        });

        it("does not duplicate typing users", () => {
            useChatStore.getState().connect();
            useChatStore.setState({ typingUsers: [{ userId: "user1", email: "user@test.com" }] });

            const typingHandler = mockSocket.on.mock.calls.find((c) => c[0] === "user_typing")?.[1];
            typingHandler?.({ userId: "user1", email: "user@test.com" });

            expect(useChatStore.getState().typingUsers).toHaveLength(1);
        });

        it("handles user_stopped_typing event", () => {
            useChatStore.getState().connect();
            useChatStore.setState({ typingUsers: [{ userId: "user1", email: "user@test.com" }] });

            const stopTypingHandler = mockSocket.on.mock.calls.find(
                (c) => c[0] === "user_stopped_typing"
            )?.[1];
            stopTypingHandler?.({ userId: "user1" });

            expect(useChatStore.getState().typingUsers).toEqual([]);
        });

        it("handles error event", () => {
            useChatStore.getState().connect();

            const errorHandler = mockSocket.on.mock.calls.find((c) => c[0] === "error")?.[1];
            errorHandler?.({ message: "Server error" });

            expect(useChatStore.getState().error).toBe("Server error");
        });
    });

    describe("disconnect", () => {
        it("disconnects and clears state", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                connected: true,
                currentRoom: "room1",
                messages: [{ id: "msg1" } as any],
                typingUsers: [{ userId: "user1", email: "test@test.com" }],
            });

            useChatStore.getState().disconnect();

            expect(disconnectSocket).toHaveBeenCalled();
            const state = useChatStore.getState();
            expect(state.socket).toBeNull();
            expect(state.connected).toBe(false);
            expect(state.messages).toEqual([]);
            expect(state.typingUsers).toEqual([]);
            expect(state.currentRoom).toBeNull();
        });

        it("leaves current room before disconnecting", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                currentRoom: "room1",
            });

            useChatStore.getState().disconnect();

            expect(mockSocket.emit).toHaveBeenCalledWith("leave_room", "room1");
        });
        it("disconnects without current room", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                connected: true,
                currentRoom: null,
            });

            useChatStore.getState().disconnect();

            expect(mockSocket.emit).not.toHaveBeenCalledWith("leave_room", expect.any(String));
            expect(disconnectSocket).toHaveBeenCalled();
            expect(useChatStore.getState().connected).toBe(false);
        });
    });

    describe("joinRoom", () => {
        it("joins a room and clears previous messages", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                messages: [{ id: "old" } as any],
            });

            useChatStore.getState().joinRoom("room1");

            expect(mockSocket.emit).toHaveBeenCalledWith("join_room", "room1");
            expect(useChatStore.getState().currentRoom).toBe("room1");
            expect(useChatStore.getState().messages).toEqual([]);
        });

        it("leaves previous room before joining new one", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                currentRoom: "oldRoom",
            });

            useChatStore.getState().joinRoom("newRoom");

            expect(mockSocket.emit).toHaveBeenCalledWith("leave_room", "oldRoom");
            expect(mockSocket.emit).toHaveBeenCalledWith("join_room", "newRoom");
        });

        it("does nothing without socket", () => {
            useChatStore.getState().joinRoom("room1");
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });
    });

    describe("leaveRoom", () => {
        it("leaves current room and clears state", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                currentRoom: "room1",
                messages: [{ id: "msg" } as any],
                typingUsers: [{ userId: "u1", email: "e" }],
            });

            useChatStore.getState().leaveRoom();

            expect(mockSocket.emit).toHaveBeenCalledWith("leave_room", "room1");
            expect(useChatStore.getState().currentRoom).toBeNull();
            expect(useChatStore.getState().messages).toEqual([]);
            expect(useChatStore.getState().typingUsers).toEqual([]);
        });

        it("does nothing without current room", () => {
            useChatStore.setState({ socket: mockSocket as any, currentRoom: null });
            useChatStore.getState().leaveRoom();
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });
    });

    describe("sendMessage", () => {
        it("sends message to current room", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                currentRoom: "room1",
            });

            useChatStore.getState().sendMessage("Hello!");

            expect(mockSocket.emit).toHaveBeenCalledWith("send_message", {
                roomId: "room1",
                content: "Hello!",
            });
        });

        it("does nothing without socket or room", () => {
            useChatStore.getState().sendMessage("Hello!");
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });
    });

    describe("startTyping", () => {
        it("emits typing_start event", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                currentRoom: "room1",
            });

            useChatStore.getState().startTyping();

            expect(mockSocket.emit).toHaveBeenCalledWith("typing_start", "room1");
        });

        it("does nothing without socket or room", () => {
            useChatStore.getState().startTyping();
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });
    });

    describe("stopTyping", () => {
        it("emits typing_stop event", () => {
            useChatStore.setState({
                socket: mockSocket as any,
                currentRoom: "room1",
            });

            useChatStore.getState().stopTyping();

            expect(mockSocket.emit).toHaveBeenCalledWith("typing_stop", "room1");
        });

        it("does nothing without socket or room", () => {
            useChatStore.getState().stopTyping();
            expect(mockSocket.emit).not.toHaveBeenCalled();
        });
    });
});
