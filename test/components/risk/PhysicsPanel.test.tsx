import { render, screen } from "../../test-utils";
import PhysicsPanel from "@/components/risk/PhysicsPanel";
import { RiskScore } from "@/types";

const mockRisk: RiskScore = {
    asteroid_id: "1",
    name: "Test Asteroid",
    risk_level: "MEDIUM",
    risk_score: 50,
    hazardous: true,
    kinetic_energy_mt: 10,
    torino_scale: 1,
    palermo_scale: -1.5,
    impact_probability: 1e-4,
    velocity_km_s: 25.5,
    relative_size: "Medium",
    estimated_diameter_km: 0.5,
    miss_distance_km: 1000000,
    score_breakdown: {
        hazardous_points: 20,
        diameter_points: 10,
        miss_distance_points: 15,
        velocity_points: 10,
        kinetic_energy_points: 15,
        orbital_uncertainty_points: 5,
    },
};

describe("PhysicsPanel", () => {
    it("renders physical properties", () => {
        render(<PhysicsPanel risk={mockRisk} />);
        expect(screen.getByText("Physical Properties")).toBeInTheDocument();
        expect(screen.getByText("10.00 MT")).toBeInTheDocument(); // Energy
        expect(screen.getByText("1")).toBeInTheDocument(); // Torino
        expect(screen.getByText("-1.5")).toBeInTheDocument(); // Palermo
        expect(screen.getByText("25.5 km/s")).toBeInTheDocument(); // Velocity
        expect(screen.getByText(/Medium/)).toBeInTheDocument(); // Relative size
    });

    it("formats small energy correctly (kT)", () => {
        const smallRisk = { ...mockRisk, kinetic_energy_mt: 0.0005 }; // 0.5 kT
        render(<PhysicsPanel risk={smallRisk} />);
        expect(screen.getByText("0.50 kT")).toBeInTheDocument();
    });

    it("formats large energy correctly (K MT)", () => {
        const largeRisk = { ...mockRisk, kinetic_energy_mt: 2000 }; // 2K MT
        render(<PhysicsPanel risk={largeRisk} />);
        expect(screen.getByText("2.0K MT")).toBeInTheDocument();
    });

    it("formats probability correctly", () => {
        render(<PhysicsPanel risk={mockRisk} />);
        // 1e-4 is 0.0001 which is 1 in 10,000 OR 0.01% depending on logic
        // Logic: if p < 0.0001 return 1 in X. if > return %. 
        // 1e-4 is >= 0.0001? 0.0001 === 0.0001. So it falls to last case: %.
        // 0.0001 * 100 = 0.0100%
        expect(screen.getByText("0.0100%")).toBeInTheDocument();
    });
});
