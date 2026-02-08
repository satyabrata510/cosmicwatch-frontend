import { render, screen } from "../../test-utils";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { useNeoStore } from "@/stores/neo-store";

vi.mock("@/stores/neo-store");

describe("StatsGrid", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state", () => {
        (useNeoStore as any).mockReturnValue({ neos: [], isLoading: true });
        const { container } = render(<StatsGrid />);
        // Should find pulse animation classes
        expect(container.getElementsByClassName("animate-pulse").length).toBeGreaterThan(0);
    });

    it("renders stats correctly", () => {
        const mockNeos = [
            {
                close_approach_data: [{
                    miss_distance: { kilometers: "500000" },
                    relative_velocity: { kilometers_per_hour: "10000" }
                }]
            },
            {
                close_approach_data: [{
                    miss_distance: { kilometers: "2000000" },
                    relative_velocity: { kilometers_per_hour: "50000" }
                }]
            }
        ];

        (useNeoStore as any).mockReturnValue({
            neos: mockNeos,
            elementCount: 10,
            hazardousCount: 2,
            isLoading: false
        });

        render(<StatsGrid />);

        expect(screen.getByText("Objects Today")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();

        expect(screen.getByText("Hazardous")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();

        // Closest: 500,000km -> 500K
        expect(screen.getByText("500K")).toBeInTheDocument();

        // Max Speed: 50,000 km/h -> 50K
        expect(screen.getByText("50K")).toBeInTheDocument();
    });
});
