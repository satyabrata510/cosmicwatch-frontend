import { render, screen, fireEvent, waitFor } from "../../test-utils";
import WatchlistShell from "@/components/watchlist/WatchlistShell";
import { useWatchlistStore } from "@/stores/watchlist-store";
import { usePermission } from "@/lib/hooks/usePermission";

// Mocks
vi.mock("@/stores/watchlist-store");
vi.mock("@/lib/hooks/usePermission");
const mockToast = { error: vi.fn(), success: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => mockToast),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

const mockItems = [
    {
        id: "w-1",
        asteroidId: "ast-1",
        asteroidName: "Asteroid 1",
        alertOnApproach: true,
        alertDistanceKm: 7500000,
        createdAt: "2023-01-01T10:00:00Z"
    }
];

describe("WatchlistShell", () => {
    const mockLoad = vi.fn();
    const mockRemove = vi.fn();
    const mockUpdate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useWatchlistStore as any).mockImplementation((selector: any) => {
            const state = {
                items: mockItems,
                isLoading: false,
                error: null,
                load: mockLoad,
                remove: mockRemove,
                update: mockUpdate
            };
            return selector ? selector(state) : state;
        });

        (usePermission as any).mockReturnValue({
            can: (resource: string, action: string) => true,
            role: "USER"
        });
    });

    it("loads watchlist on mount", () => {
        render(<WatchlistShell />);
        expect(mockLoad).toHaveBeenCalled();
    });

    it("renders watchlist items", () => {
        render(<WatchlistShell />);
        expect(screen.getByText("Asteroid 1")).toBeInTheDocument();
        expect(screen.getByText("On")).toBeInTheDocument(); // Alert on
    });

    it("renders empty state", () => {
        (useWatchlistStore as any).mockImplementation((selector: any) => {
            const state = {
                items: [],
                isLoading: false,
                error: null,
                load: mockLoad
            };
            return selector ? selector(state) : state;
        });

        render(<WatchlistShell />);
        expect(screen.getByText("No asteroids tracked yet")).toBeInTheDocument();
    });

    it("opens edit panel", () => {
        render(<WatchlistShell />);

        const editBtn = screen.getByTitle("Edit alert settings");
        fireEvent.click(editBtn);

        expect(screen.getByText("Alert Settings")).toBeInTheDocument();
    });

    it("saves edits", async () => {
        render(<WatchlistShell />);

        const editBtn = screen.getByTitle("Edit alert settings");
        fireEvent.click(editBtn);

        const saveBtn = screen.getByText("Save");
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith("ast-1", expect.objectContaining({
                alertOnApproach: true
            }));
        });
    });

    it("removes item", () => {
        render(<WatchlistShell />);

        const removeBtn = screen.getByTitle("Remove from watchlist");
        fireEvent.click(removeBtn);

        expect(mockRemove).toHaveBeenCalledWith("ast-1");
    });
});
