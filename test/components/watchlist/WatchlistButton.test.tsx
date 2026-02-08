import { render, screen, fireEvent, waitFor } from "../../test-utils";
import WatchlistButton from "@/components/watchlist/WatchlistButton";
import { useWatchlistStore } from "@/stores/watchlist-store";

// Mocks
vi.mock("@/stores/watchlist-store");
const mockToast = { error: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => mockToast),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

describe("WatchlistButton", () => {
    const mockAdd = vi.fn();
    const mockRemove = vi.fn();
    const mockIsWatched = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        (useWatchlistStore as any).mockImplementation((selector: any) => {
            const state = {
                items: [],
                add: mockAdd,
                remove: mockRemove,
                isWatched: mockIsWatched
            };
            return selector ? selector(state) : state;
        });
    });

    it("renders watch button when not watched", () => {
        mockIsWatched.mockReturnValue(false);
        render(<WatchlistButton asteroidId="1" asteroidName="Test Asteroid" />);

        expect(screen.getByText("Watch")).toBeInTheDocument();
        expect(screen.queryByText("Watching")).not.toBeInTheDocument();
    });

    it("renders watching button when watched", () => {
        mockIsWatched.mockReturnValue(true);
        render(<WatchlistButton asteroidId="1" asteroidName="Test Asteroid" />);

        expect(screen.getByText("Watching")).toBeInTheDocument();
    });

    it("calls add when clicked and not watched", async () => {
        mockIsWatched.mockReturnValue(false);
        render(<WatchlistButton asteroidId="1" asteroidName="Test Asteroid" />);

        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(mockAdd).toHaveBeenCalledWith({ asteroidId: "1", asteroidName: "Test Asteroid" });
        });
    });

    it("calls remove when clicked and watched", async () => {
        mockIsWatched.mockReturnValue(true);
        render(<WatchlistButton asteroidId="1" asteroidName="Test Asteroid" />);

        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(mockRemove).toHaveBeenCalledWith("1");
        });
    });

    it("shows loading state", async () => {
        mockIsWatched.mockReturnValue(false);
        mockAdd.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
        render(<WatchlistButton asteroidId="1" asteroidName="Test Asteroid" />);

        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByRole("button")).toBeDisabled();

        await waitFor(() => {
            expect(mockAdd).toHaveBeenCalled();
        });
    });
});
