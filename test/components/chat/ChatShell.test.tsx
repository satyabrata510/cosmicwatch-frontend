import { render, screen, fireEvent, waitFor } from "../../test-utils";
import ChatShell from "@/components/chat/ChatShell";
import { useChatStore } from "@/stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import { useWatchlistStore } from "@/stores/watchlist-store";

// Mocks
vi.mock("@/stores/chat-store");
vi.mock("@/stores/auth-store");
// Watchlist store is also used
vi.mock("@/stores/watchlist-store");

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    role: "user"
};

describe("ChatShell", () => {
    const mockConnect = vi.fn();
    const mockDisconnect = vi.fn();
    const mockJoinRoom = vi.fn();
    const mockSendMessage = vi.fn();
    const mockStartTyping = vi.fn();
    const mockStopTyping = vi.fn();
    const mockLoadWatchlist = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        const mockChatState = {
            connected: true,
            currentRoom: "general",
            messages: [],
            typingUsers: [],
            error: null,
            connect: mockConnect,
            disconnect: mockDisconnect,
            joinRoom: mockJoinRoom,
            sendMessage: mockSendMessage,
            startTyping: mockStartTyping,
            stopTyping: mockStopTyping
        };

        (useAuthStore as any).mockImplementation((selector: any) => selector ? selector({ user: mockUser }) : { user: mockUser });

        (useWatchlistStore as any).mockImplementation((selector: any) => selector ? selector({ items: [], load: mockLoadWatchlist }) : { items: [], load: mockLoadWatchlist });

        (useChatStore as any).mockImplementation((selector: any) => selector ? selector(mockChatState) : mockChatState);
    });

    it("connects on mount", () => {
        render(<ChatShell />);
        expect(mockConnect).toHaveBeenCalled();
        expect(mockLoadWatchlist).toHaveBeenCalled();
    });

    it("renders messages", () => {
        const state = {
            connected: true,
            currentRoom: "general",
            messages: [{
                id: "1", userId: "user-2", user: { name: "Other" }, content: "Hello", createdAt: new Date().toISOString()
            }],
            typingUsers: [],
            connect: mockConnect,
            disconnect: mockDisconnect,
            load: mockLoadWatchlist
        };
        (useChatStore as any).mockImplementation((selector: any) => selector ? selector(state) : state);

        render(<ChatShell />);
        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByText("Other")).toBeInTheDocument();
    });

    it("handles sending messages", () => {
        render(<ChatShell />);

        const input = screen.getByPlaceholderText(/Message #general/i);
        fireEvent.change(input, { target: { value: "New message" } });

        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockSendMessage).toHaveBeenCalledWith("New message");
        expect(mockStopTyping).toHaveBeenCalled();
    });

    it("shows typing indicator", () => {
        const state = {
            connected: true,
            currentRoom: "general",
            messages: [],
            typingUsers: [{ email: "other@example.com" }],
            connect: mockConnect,
            disconnect: mockDisconnect
        };
        (useChatStore as any).mockImplementation((selector: any) => selector ? selector(state) : state);

        render(<ChatShell />);
        expect(screen.getByText("other@example.com is typing…")).toBeInTheDocument();
    });
});
