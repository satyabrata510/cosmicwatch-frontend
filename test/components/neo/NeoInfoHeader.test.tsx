import { render, screen } from "../../test-utils";
import NeoInfoHeader from "@/components/neo/NeoInfoHeader";

describe("NeoInfoHeader", () => {
    const mockNeo = {
        id: "123",
        neo_reference_id: "123",
        name: "Asteroid X",
        nasa_jpl_url: "http://jpl.nasa.gov",
        is_potentially_hazardous_asteroid: true,
        absolute_magnitude_h: 22.1,
        estimated_diameter: { kilometers: { estimated_diameter_max: 0.5, estimated_diameter_min: 0.4 } }
    } as any;

    it("renders header details", () => {
        render(<NeoInfoHeader neo={mockNeo} />);

        expect(screen.getByText("Asteroid X")).toBeInTheDocument();
        expect(screen.getByText(/ID:.*123/)).toBeInTheDocument();
        expect(screen.getByText("Potentially Hazardous")).toBeInTheDocument();
    });

    it("renders external link", () => {
        render(<NeoInfoHeader neo={mockNeo} />);
        const link = screen.getByText(/JPL Data/).closest("a");
        expect(link).toHaveAttribute("href", "http://jpl.nasa.gov");
    });
});
