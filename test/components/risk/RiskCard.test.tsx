import { render, screen } from "../../test-utils";
import RiskCard from "@/components/risk/RiskCard";
import { RiskScore } from "@/types";

// Mock RiskBadge to simplify testing
vi.mock("@/components/risk/RiskBadge", () => ({
    default: ({ level }: any) => <div data-testid="risk-badge">{level}</div>
}));

const mockRisk: RiskScore = {
    asteroid_id: "1",
    name: "Asteroid 1",
    risk_level: "HIGH",
    risk_score: 85,
    hazardous: true,
    estimated_diameter_km: 0.123,
    miss_distance_km: 1500000, // 1.5M
    velocity_km_s: 15.0,
    kinetic_energy_mt: 5.5,
    relative_size: "Small",
    impact_probability: 0.01,
    palermo_scale: -2,
    torino_scale: 1,
    score_breakdown: {
        hazardous_points: 20,
        diameter_points: 10,
        miss_distance_points: 15,
        velocity_points: 10,
        kinetic_energy_points: 15,
        orbital_uncertainty_points: 5,
    },
};

describe("RiskCard", () => {
    it("renders basic info", () => {
        render(<RiskCard risk={mockRisk} index={0} />);
        expect(screen.getByText("Asteroid 1")).toBeInTheDocument();
        expect(screen.getByTestId("risk-badge")).toHaveTextContent("HIGH");
        expect(screen.getByText("85")).toBeInTheDocument(); // Gauge score
    });

    it("formats diameter correctly", () => {
        render(<RiskCard risk={mockRisk} index={0} />);
        expect(screen.getByText("0.123 km")).toBeInTheDocument();
    });

    it("formats miss distance (>1M)", () => {
        render(<RiskCard risk={mockRisk} index={0} />);
        expect(screen.getByText("1.5M km")).toBeInTheDocument();
    });

    it("formats miss distance (<1M)", () => {
        const smallDist = { ...mockRisk, miss_distance_km: 500000 };
        render(<RiskCard risk={smallDist} index={0} />);
        expect(screen.getByText("500K km")).toBeInTheDocument();
    });

    it("formats energy (>1 MT)", () => {
        render(<RiskCard risk={mockRisk} index={0} />);
        expect(screen.getByText("5.5 MT")).toBeInTheDocument();
    });

    it("formats energy (<1 MT)", () => {
        const smallEnergy = { ...mockRisk, kinetic_energy_mt: 0.005 }; // 5 kT
        render(<RiskCard risk={smallEnergy} index={0} />);
        expect(screen.getByText("5 kT")).toBeInTheDocument();
    });

    it("renders link", () => {
        render(<RiskCard risk={mockRisk} index={0} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/risk/1");
    });
});
