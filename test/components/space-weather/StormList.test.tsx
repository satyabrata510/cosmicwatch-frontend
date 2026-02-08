import { render, screen } from "../../test-utils";
import StormList from "@/components/space-weather/StormList";
import { GeoStorm } from "@/types";

const mockStorms: GeoStorm[] = [
    {
        stormId: "STORM-1",
        startTime: "2023-01-01T10:00:00Z",
        maxKpIndex: 8,
        stormLevel: "G4",
        link: "http://example.com",
        kpReadings: [
            { observedTime: "2023-01-01T10:00:00Z", kpIndex: 7, source: "NOAA" },
            { observedTime: "2023-01-01T11:00:00Z", kpIndex: 8, source: "NOAA" }
        ]
    }
];

describe("StormList", () => {
    it("renders loading state", () => {
        render(<StormList events={[]} isLoading={true} />);
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders empty state", () => {
        render(<StormList events={[]} isLoading={false} />);
        expect(screen.getByText(/No geomagnetic storm events found/i)).toBeInTheDocument();
    });

    it("renders storms", () => {
        render(<StormList events={mockStorms} isLoading={false} />);

        expect(screen.getAllByText("8")).toHaveLength(2); // Max Kp and Readings
        expect(screen.getByText("G4")).toBeInTheDocument();
        expect(screen.getByText("Kp Readings")).toBeInTheDocument();

        // Readings
        expect(screen.queryAllByText("NOAA").length).toBe(0); // Source not shown in list?
        // Reading Kp values
        expect(screen.getByText("7")).toBeInTheDocument();
    });
});
