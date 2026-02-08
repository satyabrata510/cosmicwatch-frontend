import { render, screen, waitFor } from "../../test-utils";
import RiskDetailShell from "@/components/risk/RiskDetailShell";
import { fetchNeoRiskById, fetchNeoSentryRisk } from "@/services/neo";

// Mocks
vi.mock("@/services/neo", () => ({
    fetchNeoRiskById: vi.fn(),
    fetchNeoSentryRisk: vi.fn()
}));

const mockToast = { error: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => mockToast),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

// Mock child components to verify composition
vi.mock("@/components/risk/RiskGauge", () => ({ default: () => <div data-testid="risk-gauge" /> }));
vi.mock("@/components/risk/RiskBadge", () => ({ default: () => <div data-testid="risk-badge" /> }));
vi.mock("@/components/risk/ScoreBreakdown", () => ({ default: () => <div data-testid="score-breakdown" /> }));
vi.mock("@/components/risk/PhysicsPanel", () => ({ default: () => <div data-testid="physics-panel" /> }));
vi.mock("@/components/risk/SentryPanel", () => ({ default: () => <div data-testid="sentry-panel" /> }));

describe("RiskDetailShell", () => {
    const mockRisk = {
        asteroid_id: "1",
        name: "Test Asteroid",
        risk_level: "HIGH",
        risk_score: 80,
        torino_scale: 1,
        palermo_scale: -1.5,
        relative_size: "Large",
        hazardous: true,
        score_breakdown: {}
    };

    const mockSentry = {
        sentry_available: true
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("loads and displays risk details", async () => {
        (fetchNeoRiskById as any).mockResolvedValue(mockRisk);
        (fetchNeoSentryRisk as any).mockResolvedValue(mockSentry);

        render(<RiskDetailShell asteroidId="1" />);

        await waitFor(() => {
            expect(screen.getByText("Test Asteroid")).toBeInTheDocument();
            expect(screen.getByTestId("risk-gauge")).toBeInTheDocument();
            expect(screen.getByTestId("physics-panel")).toBeInTheDocument();
            expect(screen.getByTestId("sentry-panel")).toBeInTheDocument();
        });
    });

    it("displays error state", async () => {
        (fetchNeoRiskById as any).mockRejectedValue(new Error("Network Error"));
        (fetchNeoSentryRisk as any).mockResolvedValue(null);

        render(<RiskDetailShell asteroidId="1" />);

        await waitFor(() => {
            expect(screen.getByText("Failed to load risk analysis")).toBeInTheDocument();
        });
    });
});
