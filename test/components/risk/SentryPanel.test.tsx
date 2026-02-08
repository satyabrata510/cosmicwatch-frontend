import { render, screen } from "../../test-utils";
import SentryPanel from "@/components/risk/SentryPanel";
import { SentryRiskScore } from "@/types";

describe("SentryPanel", () => {
    it("renders 'not monitored' state when sentry_available is false", () => {
        const mockSentry: SentryRiskScore = {
            asteroid_id: "1",
            name: "Test Asteroid",
            risk_level: "LOW",
            risk_score: 10,
            hazardous: false,
            estimated_diameter_km: 0.1,
            miss_distance_km: 5000000,
            velocity_km_s: 10,
            kinetic_energy_mt: 0.5,
            torino_scale: 0,
            palermo_scale: -5,
            impact_probability: 1e-9,
            relative_size: "Small",
            score_breakdown: {
                hazardous_points: 0,
                diameter_points: 5,
                miss_distance_points: 5,
                velocity_points: 5,
                kinetic_energy_points: 5,
                orbital_uncertainty_points: 0,
            },
            sentry_available: false,
            data_source: "none",
        };
        render(<SentryPanel sentry={mockSentry} />);
        expect(screen.getByText("Sentry System")).toBeInTheDocument();
        expect(screen.getByText(/not currently monitored/i)).toBeInTheDocument();
    });

    it("renders sentry data when available", () => {
        const mockSentry: SentryRiskScore = {
            asteroid_id: "99942",
            name: "99942 Apophis",
            risk_level: "MEDIUM",
            risk_score: 45,
            hazardous: true,
            estimated_diameter_km: 0.37,
            miss_distance_km: 38000,
            velocity_km_s: 7.4,
            kinetic_energy_mt: 1200,
            torino_scale: 0,
            palermo_scale: -2.5,
            impact_probability: 1e-6,
            relative_size: "Medium",
            score_breakdown: {
                hazardous_points: 20,
                diameter_points: 15,
                miss_distance_points: 10,
                velocity_points: 5,
                kinetic_energy_points: 20,
                orbital_uncertainty_points: 0,
            },
            sentry_available: true,
            sentry_designation: "99942 Apophis",
            real_impact_probability: 1e-6,
            real_palermo_cumulative: -2.5,
            real_palermo_max: -2.0,
            real_torino_max: 0,
            real_impact_energy_mt: 1200,
            total_virtual_impactors: 5,
            data_source: "CNEOS Sentry",
        };
        render(<SentryPanel sentry={mockSentry} />);
        expect(screen.getByText("Actively Monitored")).toBeInTheDocument();
        expect(screen.getByText("99942 Apophis")).toBeInTheDocument();
        expect(screen.getByText("1.00e-6")).toBeInTheDocument(); // 1e-6 formatted
        expect(screen.getByText("1200.00 MT")).toBeInTheDocument();
    });
});
