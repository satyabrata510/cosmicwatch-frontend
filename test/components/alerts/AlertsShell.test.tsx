import { render, screen, fireEvent, waitFor } from "../../test-utils";
import AlertsShell from "@/components/alerts/AlertsShell";
import { useAlertsStore } from "@/stores/alerts-store";

// Mocks
vi.mock("@/stores/alerts-store");

const mockAlerts = [
    {
        id: "1",
        userId: "user-1",
        asteroidId: "ast-1",
        asteroidName: "Asteroid 1",
        alertType: "CLOSE_APPROACH",
        riskLevel: "HIGH",
        message: "Approaching soon",
        isRead: false,
        createdAt: "2023-01-01T10:00:00Z",
        approachDate: "2023-01-02",
        missDistanceKm: 100000
    },
    {
        id: "2",
        userId: "user-1",
        asteroidId: "ast-2",
        asteroidName: "Asteroid 2",
        alertType: "WATCHLIST_UPDATE",
        riskLevel: "LOW",
        message: "Update available",
        isRead: true,
        createdAt: "2023-01-02T10:00:00Z",
        approachDate: null,
        missDistanceKm: 0
    }
];

describe("AlertsShell", () => {
    const mockLoad = vi.fn();
    const mockLoadUnread = vi.fn();
    const mockMarkRead = vi.fn();
    const mockMarkAllRead = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        const mockState = {
            alerts: mockAlerts,
            unreadCount: 1,
            isLoading: false,
            error: null,
            load: mockLoad,
            loadUnread: mockLoadUnread,
            markRead: mockMarkRead,
            markAllRead: mockMarkAllRead
        };

        (useAlertsStore as any).mockImplementation((selector: any) => selector ? selector(mockState) : mockState);
    });

    it("loads alerts on mount", () => {
        render(<AlertsShell />);
        expect(mockLoad).toHaveBeenCalled();
        expect(mockLoadUnread).toHaveBeenCalled();
    });

    it("renders alerts list", () => {
        render(<AlertsShell />);
        expect(screen.getByText("Asteroid 1")).toBeInTheDocument();
        expect(screen.getByText("Approaching soon")).toBeInTheDocument();
        expect(screen.getByText("Asteroid 2")).toBeInTheDocument();
    });

    it("filters unread alerts", () => {
        render(<AlertsShell />);

        const unreadFilter = screen.getByText(/Unread \(1\)/i);
        fireEvent.click(unreadFilter);

        expect(screen.getByText("Asteroid 1")).toBeInTheDocument();
        expect(screen.queryByText("Asteroid 2")).not.toBeInTheDocument(); // Read alert filtered out
    });

    it("marks alert as read", () => {
        render(<AlertsShell />);

        const markReadBtn = screen.getByTitle("Mark as read");
        fireEvent.click(markReadBtn);

        expect(mockMarkRead).toHaveBeenCalledWith("1");
    });

    it("marks all as read", () => {
        render(<AlertsShell />);

        const markAllBtn = screen.getByText("Mark all read");
        fireEvent.click(markAllBtn);

        expect(mockMarkAllRead).toHaveBeenCalled();
    });
});
