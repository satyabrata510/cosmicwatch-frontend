import { render, screen, fireEvent, waitFor } from "../../test-utils";
import SpaceWeatherShell from "@/components/space-weather/SpaceWeatherShell";
import {
    fetchCME,
    fetchSolarFlares,
    fetchGeoStorms,
    fetchSpaceWeatherNotifications
} from "@/services/space-weather";

// Mocks
vi.mock("@/services/space-weather", () => ({
    fetchCME: vi.fn(),
    fetchSolarFlares: vi.fn(),
    fetchGeoStorms: vi.fn(),
    fetchSpaceWeatherNotifications: vi.fn()
}));

const mockToast = { error: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: vi.fn(() => mockToast),
    ToastProvider: ({ children }: any) => <div>{children}</div>
}));

// Mock child components
vi.mock("@/components/space-weather/CmeTimeline", () => ({ default: () => <div data-testid="cme-timeline" /> }));
vi.mock("@/components/space-weather/FlareGrid", () => ({ default: () => <div data-testid="flare-grid" /> }));
vi.mock("@/components/space-weather/StormList", () => ({ default: () => <div data-testid="storm-list" /> }));
vi.mock("@/components/space-weather/NotificationFeed", () => ({ default: () => <div data-testid="notification-feed" /> }));

describe("SpaceWeatherShell", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("defaults to CME tab and loads data", async () => {
        (fetchCME as any).mockResolvedValue({ events: [] });
        render(<SpaceWeatherShell />);

        await waitFor(() => {
            expect(fetchCME).toHaveBeenCalled();
            expect(screen.getByTestId("cme-timeline")).toBeInTheDocument();
        });
    });

    it("switches to Solar Flares tab", async () => {
        (fetchCME as any).mockResolvedValue({ events: [] });
        (fetchSolarFlares as any).mockResolvedValue({ events: [], summary: null });

        render(<SpaceWeatherShell />);

        const flaresTab = screen.getByText("Solar Flares");
        fireEvent.click(flaresTab);

        await waitFor(() => {
            expect(fetchSolarFlares).toHaveBeenCalled();
            expect(screen.getByTestId("flare-grid")).toBeInTheDocument();
        });
    });

    it("switches to Geo Storms tab", async () => {
        (fetchCME as any).mockResolvedValue({ events: [] });
        (fetchGeoStorms as any).mockResolvedValue({ events: [] });

        render(<SpaceWeatherShell />);

        const stormsTab = screen.getByText("Geo Storms");
        fireEvent.click(stormsTab);

        await waitFor(() => {
            expect(fetchGeoStorms).toHaveBeenCalled();
            expect(screen.getByTestId("storm-list")).toBeInTheDocument();
        });
    });

    it("switches to Alerts tab", async () => {
        (fetchCME as any).mockResolvedValue({ events: [] });
        (fetchSpaceWeatherNotifications as any).mockResolvedValue({ notifications: [] });

        render(<SpaceWeatherShell />);

        // "Alerts" is the label in the tabs array
        const alertsTab = screen.getByText("Alerts");
        fireEvent.click(alertsTab);

        await waitFor(() => {
            expect(fetchSpaceWeatherNotifications).toHaveBeenCalled();
            expect(screen.getByTestId("notification-feed")).toBeInTheDocument();
        });
    });

    it("displays error on fetch failure", async () => {
        (fetchCME as any).mockRejectedValue(new Error("CME Error"));
        render(<SpaceWeatherShell />);

        await waitFor(() => {
            expect(screen.getByText("CME Error")).toBeInTheDocument();
        });
    });
});
