import { render, screen, waitFor, fireEvent } from "../../test-utils";
import RiskAnalysisShell from "@/components/risk/RiskAnalysisShell";
import { fetchNeoRisk } from "@/services/neo";
import { usePermission } from "@/lib/hooks/usePermission";

// Mocks
vi.mock("@/services/neo", () => ({
    fetchNeoRisk: vi.fn(),
    today: () => "2023-01-01"
}));

vi.mock("@/lib/hooks/usePermission", () => ({
    usePermission: vi.fn()
}));

const mockToast = { error: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => mockToast),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

vi.mock("@/components/neo/DateRangePicker", () => ({
    default: ({ onSearch }: any) => (
        <button data-testid="date-picker-search" onClick={() => onSearch("2023-01-01", "2023-01-07")}>
            Search
        </button>
    )
}));

vi.mock("@/components/risk/RiskCard", () => ({
    default: ({ risk }: any) => <div data-testid="risk-card">{risk.name} - {risk.risk_level}</div>
}));

describe("RiskAnalysisShell", () => {
    const mockRisks = [
        { asteroid_id: "1", name: "Asteroid 1", risk_level: "HIGH", risk_score: 80 },
        { asteroid_id: "2", name: "Asteroid 2", risk_level: "LOW", risk_score: 10 }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (usePermission as any).mockReturnValue({ can: vi.fn().mockReturnValue(true) });
    });

    it("loads and displays risk data", async () => {
        (fetchNeoRisk as any).mockResolvedValue(mockRisks);
        render(<RiskAnalysisShell />);

        await waitFor(() => {
            expect(screen.getByText("Asteroid 1 - HIGH")).toBeInTheDocument();
            expect(screen.getByText("Asteroid 2 - LOW")).toBeInTheDocument();
        });
    });

    it("displays error message on fetch failure", async () => {
        (fetchNeoRisk as any).mockRejectedValue(new Error("API Error"));
        render(<RiskAnalysisShell />);

        await waitFor(() => {
            expect(screen.getByText("API Error")).toBeInTheDocument();
        });
    });

    it("filters risks by level", async () => {
        (fetchNeoRisk as any).mockResolvedValue(mockRisks);
        render(<RiskAnalysisShell />);

        await waitFor(() => expect(screen.getAllByTestId("risk-card")).toHaveLength(2));

        // Click HIGH filter
        const highFilter = screen.getByRole("button", { name: /HIGH/ });
        fireEvent.click(highFilter);

        expect(screen.getAllByTestId("risk-card")).toHaveLength(1);
        expect(screen.getByText("Asteroid 1 - HIGH")).toBeInTheDocument();
        expect(screen.queryByText("Asteroid 2 - LOW")).not.toBeInTheDocument();
    });

    it("shows engine management badge if permitted", async () => {
        (fetchNeoRisk as any).mockResolvedValue([]);
        render(<RiskAnalysisShell />);

        await waitFor(() => {
            expect(screen.getByText("Engine management enabled")).toBeInTheDocument();
        });
    });

    it("hides engine management badge if not permitted", async () => {
        (usePermission as any).mockReturnValue({ can: vi.fn().mockReturnValue(false) });
        (fetchNeoRisk as any).mockResolvedValue([]);
        render(<RiskAnalysisShell />);

        await waitFor(() => {
            expect(screen.queryByText("Engine management enabled")).not.toBeInTheDocument();
        });
    });
});
