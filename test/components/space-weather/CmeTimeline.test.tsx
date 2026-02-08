import { render, screen } from "../../test-utils";
import CmeTimeline from "@/components/space-weather/CmeTimeline";
import { CmeEvent } from "@/types";

const mockCMEs: CmeEvent[] = [
    {
        activityId: "CME-1",
        startTime: "2023-01-01T10:00:00Z",
        type: "C",
        note: "A big explosion",
        speed: 500,
        halfAngle: 30,
        latitude: 10,
        longitude: 10,
        earthDirected: true,
        estimatedArrival: "2023-01-03T10:00:00Z",
        instruments: ["SOHO"],
        linkedEvents: [],
        link: "http://example.com",
        sourceLocation: "N10E10",
        activeRegionNum: null,
    },
    {
        activityId: "CME-2",
        startTime: "2023-01-02T12:00:00Z",
        type: "S",
        note: "",
        speed: null,
        halfAngle: null,
        latitude: null,
        longitude: null,
        earthDirected: false,
        estimatedArrival: null,
        instruments: [],
        linkedEvents: [],
        link: "http://example.com",
        sourceLocation: "",
        activeRegionNum: null,
    }
];

describe("CmeTimeline", () => {
    it("renders loading state", () => {
        render(<CmeTimeline events={[]} isLoading={true} />);
        const skeletons = document.querySelectorAll(".animate-pulse");
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it("renders empty state", () => {
        render(<CmeTimeline events={[]} isLoading={false} />);
        expect(screen.getByText(/No CME events found/i)).toBeInTheDocument();
    });

    it("renders CMEs", () => {
        render(<CmeTimeline events={mockCMEs} isLoading={false} />);

        expect(screen.getByText("CME-1")).toBeInTheDocument();
        expect(screen.getByText("Type C")).toBeInTheDocument();
        expect(screen.getByText("Earth-Directed")).toBeInTheDocument();
        expect(screen.getByText("500 km/s")).toBeInTheDocument(); // Speed
        expect(screen.getByText("CME-2")).toBeInTheDocument();
    });
});
