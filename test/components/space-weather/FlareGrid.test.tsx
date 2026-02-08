import { render, screen } from "../../test-utils";
import FlareGrid from "@/components/space-weather/FlareGrid";
import { SolarFlare } from "@/types";

const mockFlares: SolarFlare[] = [
    {
        flareId: "1",
        beginTime: "2023-01-01T10:00:00Z",
        peakTime: "2023-01-01T10:15:00Z",
        endTime: "2023-01-01T10:30:00Z",
        classType: "X1.0",
        classCategory: "X",
        intensity: 1.0,
        sourceLocation: "AR2999",
        activeRegionNum: 2999,
        instruments: ["GOES-16"],
        note: "Strong X-class flare",
        link: "http://example.com",
    },
    {
        flareId: "2",
        beginTime: "2023-01-02T12:00:00Z",
        peakTime: "2023-01-02T12:15:00Z",
        endTime: null,
        classType: "M5.0",
        classCategory: "M",
        intensity: 5.0,
        sourceLocation: "Unknown",
        activeRegionNum: null,
        instruments: [],
        note: "",
        link: "http://example.com",
    }
];

const mockSummary = {
    xClass: 1,
    mClass: 1,
    cClass: 0,
    other: 0
};

describe("FlareGrid", () => {
    it("renders loading state", () => {
        render(<FlareGrid events={[]} summary={null} isLoading={true} />);
        // Expect pulse animations or skeletal structure. 
        // We can't easily test for "animate-pulse" class without inspecting classList, 
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders empty state", () => {
        render(<FlareGrid events={[]} summary={null} isLoading={false} />);
        expect(screen.getByText(/No solar flare events found/i)).toBeInTheDocument();
    });

    it("renders flares and summary", () => {
        render(<FlareGrid events={mockFlares} summary={mockSummary} isLoading={false} />);

        // Summary
        expect(screen.getByText("X-Class")).toBeInTheDocument();
        expect(screen.getAllByText("1")).toHaveLength(2); // 1 X-Class, 1 M-Class

        // Flares
        expect(screen.getByText("X1.0")).toBeInTheDocument();
        expect(screen.getByText("M5.0")).toBeInTheDocument();
        expect(screen.getByText("AR2999")).toBeInTheDocument();
        expect(screen.getByText(/ongoing/i)).toBeInTheDocument(); // For null endTime
    });
});
