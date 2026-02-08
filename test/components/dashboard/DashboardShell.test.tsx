import { render, screen } from "../../test-utils";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useNeoStore } from "@/stores/neo-store";
import { useAuthStore } from "@/stores/auth-store";

vi.mock("@/stores/neo-store");
vi.mock("@/stores/auth-store");

// Mock children
vi.mock("@/components/dashboard/NeoFeedTable", () => ({ default: () => <div data-testid="feed-table" /> }));
vi.mock("@/components/dashboard/StatsGrid", () => ({ default: () => <div data-testid="stats-grid" /> }));
vi.mock("@/components/dashboard/WelcomeHeader", () => ({ default: () => <div data-testid="welcome-header" /> }));

describe("DashboardShell", () => {
    const loadFeed = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNeoStore as any).mockReturnValue({ loadFeed });
        (useAuthStore as any).mockReturnValue({ user: { name: "Test" } });
    });

    it("loads feed on mount", () => {
        render(<DashboardShell />);
        expect(loadFeed).toHaveBeenCalled();
    });

    it("renders layout components", () => {
        render(<DashboardShell />);
        expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
        expect(screen.getByTestId("stats-grid")).toBeInTheDocument();
        expect(screen.getByTestId("feed-table")).toBeInTheDocument();
        expect(screen.getByText("3D Orbit Explorer")).toBeInTheDocument();
    });
});
