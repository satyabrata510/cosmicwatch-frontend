import { render, screen, waitFor } from "../../test-utils";
import ApodBackground from "@/components/auth/ApodBackground";
import { fetchApodToday } from "@/services/apod";

// Mock the service
vi.mock("@/services/apod", () => ({
    fetchApodToday: vi.fn(),
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe("ApodBackground", () => {
    const mockApod = {
        title: "Test APOD",
        url: "https://example.com/apod.jpg",
        hdUrl: "https://example.com/apod-hd.jpg",
        mediaType: "image",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("fetches and renders APOD image on cache miss", async () => {
        (fetchApodToday as any).mockResolvedValue(mockApod);

        render(<ApodBackground />);

        // Wait for image to be set in style
        await waitFor(() => {
            const bg = document.querySelector(".fixed.inset-0.bg-cover");
            expect(bg).toHaveStyle(`background-image: url(${mockApod.hdUrl})`);
        });

        expect(screen.getByText(/NASA APOD: Test APOD/)).toBeInTheDocument();
        expect(fetchApodToday).toHaveBeenCalled();
    });

    it("renders from cache if available", async () => {
        const cached = {
            imageUrl: "https://cached.com/image.jpg",
            title: "Cached Title",
            cachedAt: Date.now(),
        };
        localStorage.setItem("cw_apod_cache", JSON.stringify(cached));

        render(<ApodBackground />);

        await waitFor(() => {
            const bg = document.querySelector(".fixed.inset-0.bg-cover");
            expect(bg).toHaveStyle(`background-image: url(${cached.imageUrl})`);
        });

        expect(screen.getByText(/NASA APOD: Cached Title/)).toBeInTheDocument();
        expect(fetchApodToday).not.toHaveBeenCalled();
    });

    it("handles fetch error gracefully", async () => {
        (fetchApodToday as any).mockRejectedValue(new Error("API Error"));

        render(<ApodBackground />);

        // Should render nothing or empty fragment if mocked to return null on no image
        // The component returns null if !imageUrl.

        // Wait to ensure effect ran
        await waitFor(() => {
            expect(fetchApodToday).toHaveBeenCalled();
        });

        const bg = document.querySelector(".fixed.inset-0.bg-cover");
        expect(bg).not.toBeInTheDocument();
    });
});
