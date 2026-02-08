import { render, screen } from "../../test-utils";
import MessageBubble from "@/components/chat/MessageBubble";
import { ChatMessage } from "@/types";

const mockUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    role: "user" as const,
    preferences: { notifications: true, theme: "dark" as const }
};

const mockMessage: ChatMessage = {
    id: "msg-1",
    roomId: "general",
    userId: "user-1",
    content: "Hello world",
    createdAt: "2023-01-01T10:00:00Z",
    user: mockUser
};

describe("MessageBubble", () => {
    it("renders own message correctly", () => {
        render(<MessageBubble message={mockMessage} isOwn={true} showAvatar={true} />);

        expect(screen.getByText("Hello world")).toBeInTheDocument();
        // Own message shouldn't show name separate from bubble context typically, 
        // but let's check class for alignment if possible, or just content.
        const bubble = screen.getByText("Hello world");
        expect(bubble).toHaveClass("bg-accent");
    });

    it("renders other user message correctly", () => {
        render(<MessageBubble message={mockMessage} isOwn={false} showAvatar={true} />);

        expect(screen.getByText("Hello world")).toBeInTheDocument();
        expect(screen.getByText("Test User")).toBeInTheDocument();
        const bubble = screen.getByText("Hello world");
        expect(bubble).not.toHaveClass("bg-accent");
    });

    it("shows initials when no avatar", () => {
        render(<MessageBubble message={mockMessage} isOwn={false} showAvatar={true} />);
        expect(screen.getByText("TU")).toBeInTheDocument();
    });

    it("shows delete button for moderator", () => {
        render(<MessageBubble message={mockMessage} isOwn={false} showAvatar={true} canModerate={true} />);
        expect(screen.getByTitle("Delete message (moderator)")).toBeInTheDocument();
    });
});
