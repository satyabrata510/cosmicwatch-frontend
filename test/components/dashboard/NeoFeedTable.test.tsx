import { render, screen, fireEvent, within } from "../../test-utils";
import NeoFeedTable from "@/components/dashboard/NeoFeedTable";
import { useNeoStore } from "@/stores/neo-store";

vi.mock("@/stores/neo-store");

// Mock Framer Motion to avoid animation issues
vi.mock("framer-motion", async () => {
    const actual = await vi.importActual("framer-motion");
    return {
        ...actual,
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motion: {
            div: ({ children, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
            tr: ({ children, layout, initial, animate, exit, transition, ...props }: any) => <tr {...props}>{children}</tr>,
        },
    };
});

describe("NeoFeedTable", () => {
    const mockNeos = [
        {
            id: "1",
            name: "Asteroid A",
            is_potentially_hazardous_asteroid: false,
            estimated_diameter: { kilometers: { estimated_diameter_max: 0.5 } },
            close_approach_data: [{
                miss_distance: { kilometers: "1000000" },
                relative_velocity: { kilometers_per_hour: "20000" }
            }],
            nasa_jpl_url: "http://jpl.nasa.gov/1"
        },
        {
            id: "2",
            name: "Asteroid B",
            is_potentially_hazardous_asteroid: true,
            estimated_diameter: { kilometers: { estimated_diameter_max: 1.2 } },
            close_approach_data: [{
                miss_distance: { kilometers: "500000" },
                relative_velocity: { kilometers_per_hour: "50000" }
            }],
            nasa_jpl_url: "http://jpl.nasa.gov/2"
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state", () => {
        (useNeoStore as any).mockReturnValue({ neos: [], isLoading: true, error: null });
        const { container } = render(<NeoFeedTable />);
        expect(container.getElementsByClassName("animate-pulse").length).toBeGreaterThan(0);
    });

    it("renders error state", () => {
        (useNeoStore as any).mockReturnValue({ neos: [], isLoading: false, error: "API Failed" });
        render(<NeoFeedTable />);
        expect(screen.getByText("API Failed")).toBeInTheDocument();
    });

    it("renders table with data", () => {
        (useNeoStore as any).mockReturnValue({ neos: mockNeos, isLoading: false, error: null });
        render(<NeoFeedTable />);

        expect(screen.getByText("Asteroid A")).toBeInTheDocument();
        expect(screen.getByText("Asteroid B")).toBeInTheDocument();
        expect(screen.getByText("YES")).toBeInTheDocument();
    });

    it("sorts by diameter interactively", async () => {
        (useNeoStore as any).mockReturnValue({ neos: mockNeos, isLoading: false, error: null });
        render(<NeoFeedTable />);

        const diameterHeader = screen.getByText("Diameter (km)");

        // Initial sort: Distance (asc). B (500k) < A (1000k).
        // Confirm initial order
        let rows = screen.getAllByRole("row");
        // row 0: headers. row 1: B. row 2: A.
        expect(rows[1]).toHaveTextContent("Asteroid B");
        expect(rows[2]).toHaveTextContent("Asteroid A");

        // Click diameter -> sort asc. A (0.5) < B (1.2).
        fireEvent.click(diameterHeader);

        rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Asteroid A");
        expect(rows[2]).toHaveTextContent("Asteroid B");

        // Click diameter again -> sort desc. B > A.
        fireEvent.click(diameterHeader);

        rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Asteroid B");
        expect(rows[2]).toHaveTextContent("Asteroid A");
    });
});
