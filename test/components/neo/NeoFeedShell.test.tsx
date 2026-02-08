import { render, screen } from "../../test-utils";
import NeoFeedShell from "@/components/neo/NeoFeedShell";
import { useNeoStore } from "@/stores/neo-store";

vi.mock("@/stores/neo-store");
vi.mock("@/components/neo/DateRangePicker", () => ({ default: () => <div data-testid="date-picker" /> }));
vi.mock("@/components/neo/NeoCard", () => ({ default: ({ neo }: any) => <div data-testid="neo-card">{neo.name}</div> }));
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => ({ error: vi.fn() })),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

describe("NeoFeedShell", () => {
    const mockLoadFeed = vi.fn();
    const defaultStore = {
        neos: [],
        elementCount: 0,
        hazardousCount: 0,
        isLoading: false,
        error: null,
        startDate: "2023-01-01",
        endDate: "2023-01-07",
        loadFeed: mockLoadFeed
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useNeoStore as any).mockReturnValue(defaultStore);
    });

    it("loads feed on mount if empty", () => {
        render(<NeoFeedShell />);
        expect(mockLoadFeed).toHaveBeenCalled();
    });

    it("renders cards when data exists", () => {
        (useNeoStore as any).mockReturnValue({
            ...defaultStore,
            neos: [{ id: "1", name: "Asteroid 1" }, { id: "2", name: "Asteroid 2" }],
            elementCount: 2
        });
        render(<NeoFeedShell />);
        expect(screen.getAllByTestId("neo-card")).toHaveLength(2);
        expect(screen.getByText("Asteroid 1")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        render(<NeoFeedShell />);
        expect(screen.getByText("No near-earth objects found for this date range.")).toBeInTheDocument();
    });

    it("renders error state", () => {
        (useNeoStore as any).mockReturnValue({
            ...defaultStore,
            error: "Failed to fetch"
        });
        render(<NeoFeedShell />);
        expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });

    it("renders loading skeletons", () => {
        (useNeoStore as any).mockReturnValue({
            ...defaultStore,
            isLoading: true
        });
        render(<NeoFeedShell />);
        // Checking for skeleton implies checking for class "animate-pulse" or similar structure
        // The skeleton is a div with animate-pulse
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
