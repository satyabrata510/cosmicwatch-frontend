import { render, screen } from "../../test-utils";
import NeoCard from "@/components/neo/NeoCard";
import { useAuthStore } from "@/stores/auth-store";

vi.mock("@/stores/auth-store");
// Mock Link
vi.mock("next/link", () => ({
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

describe("NeoCard", () => {
    const mockNeo = {
        id: "123456",
        neo_reference_id: "123456",
        name: "Test Asteroid",
        nasa_jpl_url: "http://nasa.gov",
        absolute_magnitude_h: 20.5,
        estimated_diameter: {
            kilometers: {
                estimated_diameter_min: 0.1,
                estimated_diameter_max: 0.2
            },
            meters: {
                estimated_diameter_min: 100,
                estimated_diameter_max: 200
            }
        },
        is_potentially_hazardous_asteroid: true,
        close_approach_data: [
            {
                close_approach_date: "2023-10-27",
                close_approach_date_full: "2023-Oct-27 12:00",
                epoch_date_close_approach: 1698408000000,
                relative_velocity: {
                    kilometers_per_second: "10",
                    kilometers_per_hour: "36000",
                    miles_per_hour: "22000"
                },
                miss_distance: {
                    astronomical: "0.05",
                    lunar: "20",
                    kilometers: "7500000",
                    miles: "4600000"
                },
                orbiting_body: "Earth"
            }
        ],
        is_sentry_object: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({ user: { role: "USER" } });
    });

    it("renders asteroid details", () => {
        render(<NeoCard neo={mockNeo} index={0} />);

        expect(screen.getByText("Test Asteroid")).toBeInTheDocument();
        expect(screen.getByText("Hazardous")).toBeInTheDocument();
        expect(screen.getByText("2023-10-27")).toBeInTheDocument();
        expect(screen.getByText("0.200 km")).toBeInTheDocument();
    });

    it("renders safe state if not hazardous", () => {
        const safeNeo = { ...mockNeo, is_potentially_hazardous_asteroid: false };
        render(<NeoCard neo={safeNeo} index={0} />);
        expect(screen.queryByText("Hazardous")).not.toBeInTheDocument();
    });
});
