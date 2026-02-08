import { render, screen } from "../../test-utils";
import ScoreBreakdown from "@/components/risk/ScoreBreakdown";
import { RiskScore } from "@/types";

describe("ScoreBreakdown", () => {
    const mockBreakdown = {
        miss_distance_points: 20,
        diameter_points: 15,
        hazardous_points: 15,
        velocity_points: 10,
        kinetic_energy_points: 5,
        orbital_uncertainty_points: 5
    };

    it("renders breakdown factors", () => {
        render(<ScoreBreakdown breakdown={mockBreakdown} />);

        expect(screen.getByText("Score Breakdown")).toBeInTheDocument();
        expect(screen.getByText("Miss Distance")).toBeInTheDocument();
        expect(screen.getByText("20.0")).toBeInTheDocument();
        expect(screen.getByText("/25")).toBeInTheDocument(); // Max for miss distance

        expect(screen.getByText("Diameter")).toBeInTheDocument();
        expect(screen.getAllByText("15.0")).toHaveLength(2); // Diameter and Hazardous match
    });

    it("renders total score calculation", () => {
        render(<ScoreBreakdown breakdown={mockBreakdown} />);

        // Sum: 20+15+15+10+5+5 = 70
        // Text might be split, e.g. "Total Score" and "70.0/100"
        expect(screen.getByText("Total Score")).toBeInTheDocument();
        expect(screen.getByText("70.0")).toBeInTheDocument();
    });
});
