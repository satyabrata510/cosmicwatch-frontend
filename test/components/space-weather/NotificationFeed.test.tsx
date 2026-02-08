import { render, screen } from "../../test-utils";
import NotificationFeed from "@/components/space-weather/NotificationFeed";

const mockNotifications: any[] = [
    {
        messageId: "FLR-1",
        issueTime: "2023-01-01T10:00:00Z",
        messageType: "FLR",
        messageUrl: "http://example.com",
        body: "Strong solar flare detected."
    }
];

describe("NotificationFeed", () => {
    it("renders loading state", () => {
        render(<NotificationFeed notifications={[]} isLoading={true} />);
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders empty state", () => {
        render(<NotificationFeed notifications={[]} isLoading={false} />);
        expect(screen.getByText(/No notifications found/i)).toBeInTheDocument();
    });

    it("renders notifications", () => {
        render(<NotificationFeed notifications={mockNotifications} isLoading={false} />);

        expect(screen.getByText("FLR")).toBeInTheDocument();
        expect(screen.getByText("Strong solar flare detected.")).toBeInTheDocument();
    });
});
