import { render, screen, waitFor } from "../../test-utils";
import NeoDetailShell from "@/components/neo/NeoDetailShell";
import * as neoService from "@/services/neo";
import { useToast } from "@/components/ui/Toast";

vi.mock("@/services/neo");
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => ({ error: vi.fn() })),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

// Mock child components to simplify shell test
vi.mock("@/components/neo/NeoInfoHeader", () => ({ default: () => <div data-testid="neo-info-header" /> }));
vi.mock("@/components/neo/DiameterViz", () => ({ default: () => <div data-testid="diameter-viz" /> }));
vi.mock("@/components/neo/CloseApproachTable", () => ({ default: () => <div data-testid="close-approach-table" /> }));
vi.mock("@/components/watchlist/WatchlistButton", () => ({ default: () => <div data-testid="watchlist-btn" /> }));
vi.mock("@/components/risk/RiskGauge", () => ({ default: () => <div data-testid="risk-gauge" /> }));

describe("NeoDetailShell", () => {
    const mockNeo = {
        id: "1",
        neo_reference_id: "ref1",
        name: "Test Asteroid",
        is_sentry_object: false,
        is_potentially_hazardous_asteroid: false,
        close_approach_data: [],
        absolute_magnitude_h: 20
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (neoService.fetchNeoById as any).mockResolvedValue(mockNeo);
        (neoService.fetchNeoRiskById as any).mockResolvedValue(null);
    });

    it("fetches and renders asteroid data", async () => {
        render(<NeoDetailShell asteroidId="1" />);

        await waitFor(() => {
            expect(screen.getByTestId("neo-info-header")).toBeInTheDocument();
        });

        expect(screen.getByTestId("diameter-viz")).toBeInTheDocument();
        expect(screen.getByTestId("close-approach-table")).toBeInTheDocument();
        expect(neoService.fetchNeoById).toHaveBeenCalledWith("1");
    });

    it("renders loading state initially", () => {
        render(<NeoDetailShell asteroidId="1" />);
        // Loader is present
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("renders error state on fetch failure", async () => {
        (neoService.fetchNeoById as any).mockRejectedValue(new Error("API Error"));
        render(<NeoDetailShell asteroidId="1" />);

        await waitFor(() => {
            expect(screen.getByText("Failed to load asteroid data")).toBeInTheDocument();
        });
    });
});
