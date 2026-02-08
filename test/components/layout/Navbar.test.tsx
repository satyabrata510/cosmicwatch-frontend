import { render, screen, fireEvent } from "../../test-utils";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

// Mock stores
vi.mock("@/stores/auth-store");
vi.mock("@/stores/ui-store");

describe("Navbar", () => {
    const mockAuthState = {
        isAuthenticated: false,
        user: null,
        logout: vi.fn(),
    };

    const mockUIState = {
        isMobileMenuOpen: false,
        toggleMobileMenu: vi.fn(),
        closeMobileMenu: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock implementation to handle selectors
        (useAuthStore as any).mockImplementation((selector: any) => {
            return selector ? selector(mockAuthState) : mockAuthState;
        });

        // However, useAuthStore() (no selector) returns the state.
        // And useAuthStore(s => s.user) returns user.
        // The component uses: const { ... } = useAuthStore(); (destructuring state)
        // Wait, check component code:
        // const { user, isAuthenticated, logout } = useAuthStore();
        // It does NOT use selector for auth store.

        // UI Store uses:
        // const { isMobileMenuOpen: mobileOpen, ... } = useUIStore();
        // Also NO selector.

        // So direct return value IS fine for these two.
        (useAuthStore as any).mockReturnValue(mockAuthState);
        (useUIStore as any).mockReturnValue(mockUIState);
    });

    it("renders logo and auth buttons when guest", () => {
        render(<Navbar />);
        expect(screen.getByText("Cosmic")).toBeInTheDocument();
        expect(screen.getByText("Log In")).toBeInTheDocument();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("renders user info and logout when authenticated", () => {
        const authState = { ...mockAuthState, isAuthenticated: true, user: { name: "Test User" } };
        (useAuthStore as any).mockReturnValue(authState);

        render(<Navbar />);
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("toggles mobile menu", () => {
        const toggleMock = vi.fn();
        (useUIStore as any).mockReturnValue({
            ...mockUIState,
            toggleMobileMenu: toggleMock,
        });

        render(<Navbar />);

        const buttons = screen.getAllByRole("button");
        // The menu button is the one with the Menu icon (or X if open)
        // We can find it by verifying it's not one of the text buttons
        const menuBtn = buttons.find(b => !b.textContent);

        if (menuBtn) {
            fireEvent.click(menuBtn);
            expect(toggleMock).toHaveBeenCalled();
        } else {
            throw new Error("Menu button not found");
        }
    });
});
