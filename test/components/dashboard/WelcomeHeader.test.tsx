import { render, screen } from "../../test-utils";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import { useAuthStore } from "@/stores/auth-store";

vi.mock("@/stores/auth-store");

describe("WelcomeHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders user greeting and role badge", () => {
        (useAuthStore as any).mockReturnValue({
            user: {
                name: "Test User",
                role: "ADMIN",
                _count: { watchlist: 5, alerts: 2 }
            }
        });

        render(<WelcomeHeader />);

        expect(screen.getByText(/Good/)).toBeInTheDocument();
        expect(screen.getByText(/Test/)).toBeInTheDocument();
        expect(screen.getByText("Admin")).toBeInTheDocument();
        expect(screen.getByText("5 watched")).toBeInTheDocument();
        expect(screen.getByText("2 alerts")).toBeInTheDocument();
    });

    it("renders nothing if no user", () => {
        (useAuthStore as any).mockReturnValue({ user: null });
        render(<WelcomeHeader />);

        // Use queryBy because element should not exist
        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        expect(screen.queryByText(/Good/)).not.toBeInTheDocument();
    });
});
