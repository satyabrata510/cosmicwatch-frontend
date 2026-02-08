import { render, screen, fireEvent } from "../../test-utils";
import Sidebar from "@/components/layout/FloatingDock";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import { useAlertsStore } from "@/stores/alerts-store";
import { useWatchlistStore } from "@/stores/watchlist-store";
import { usePermission } from "@/lib/hooks/usePermission";
import * as navigation from "next/navigation";

// Mock stores & hooks
vi.mock("@/stores/auth-store");
vi.mock("@/stores/ui-store");
vi.mock("@/stores/alerts-store");
vi.mock("@/stores/watchlist-store");
vi.mock("@/lib/hooks/usePermission");
// Note: next/navigation is mocked in setup.ts but we can spy/override here if needed.
// setup.ts sets useRouter to vi.fn().

describe("Sidebar (FloatingDock)", () => {
    const mockAuthState = { user: { name: "Test User", role: "USER", avatar: null }, logout: vi.fn() };
    const mockUIState = { sidebarExpanded: true, toggleSidebar: vi.fn() };
    const mockAlertsState = { unreadCount: 5 };
    const mockWatchlistState = { items: [1, 2] };
    const mockPermission = { role: "USER", can: vi.fn().mockReturnValue(true) };

    beforeEach(() => {
        vi.clearAllMocks();

        // Selector-aware mocks
        (useUIStore as any).mockImplementation((selector: any) => selector ? selector(mockUIState) : mockUIState);
        (useAlertsStore as any).mockImplementation((selector: any) => selector ? selector(mockAlertsState) : mockAlertsState);
        (useWatchlistStore as any).mockImplementation((selector: any) => selector ? selector(mockWatchlistState) : mockWatchlistState);

        (useAuthStore as any).mockReturnValue(mockAuthState);
        (usePermission as any).mockReturnValue(mockPermission);

        vi.spyOn(navigation, "usePathname").mockReturnValue("/dashboard");
    });

    it("renders navigation items", () => {
        render(<Sidebar />);
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("NEO Feed")).toBeInTheDocument();
    });

    it("filters items based on role (RBAC)", () => {
        (usePermission as any).mockReturnValue({ ...mockPermission, can: vi.fn().mockReturnValue(false) });
        render(<Sidebar />);
        // Dashboard has no permission required
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        // Admin Panel requires permission
        expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    });

    it("shows badges", () => {
        render(<Sidebar />);
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("collapses sidebar", () => {
        const collapsedState = { ...mockUIState, sidebarExpanded: false };
        (useUIStore as any).mockImplementation((selector: any) => selector ? selector(collapsedState) : collapsedState);

        render(<Sidebar />);

        // In collapsed mode, the text "Dashboard" is only in the hidden tooltip.
        // It has opacity: 0 and class absolute/pointer-events-none etc.
        const dashboardLabel = screen.getByText("Dashboard");
        expect(dashboardLabel).toHaveClass("opacity-0");
        expect(dashboardLabel).toHaveClass("absolute");
    });

    it("toggles sidebar on click", () => {
        render(<Sidebar />);
        const collapseBtn = screen.getByText("Collapse");
        fireEvent.click(collapseBtn);
        expect(mockUIState.toggleSidebar).toHaveBeenCalled();
    });

    it("calls logout", () => {
        render(<Sidebar />);
        const logoutBtn = screen.getByText("Logout");
        fireEvent.click(logoutBtn);
        expect(mockAuthState.logout).toHaveBeenCalled();
    });
});
