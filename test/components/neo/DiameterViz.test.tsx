import { render, screen } from "../../test-utils";
import DiameterViz from "@/components/neo/DiameterViz";

describe("DiameterViz", () => {
    const mockNeo = {
        estimated_diameter: {
            kilometers: {
                estimated_diameter_min: 0.1,
                estimated_diameter_max: 0.2
            },
            meters: {
                estimated_diameter_min: 100,
                estimated_diameter_max: 200
            }
        }
    } as any;

    it("renders diameter stats", () => {
        render(<DiameterViz neo={mockNeo} />);

        expect(screen.getByText("Estimated Diameter")).toBeInTheDocument();
        expect(screen.getByText(/0.100 – 0.200 km/)).toBeInTheDocument();
        expect(screen.getByText(/100.0 – 200.0 m/)).toBeInTheDocument();
    });

    it("renders comparison references", () => {
        render(<DiameterViz neo={mockNeo} />);

        expect(screen.getByText("Football field")).toBeInTheDocument();
        expect(screen.getByText("Golden Gate Bridge")).toBeInTheDocument();
        expect(screen.getByText("Mt. Everest")).toBeInTheDocument();
    });
});
