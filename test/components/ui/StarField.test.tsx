import { render, fireEvent } from "../../test-utils";
import StarField from "@/components/ui/StarField";

describe("StarField", () => {
    let originalGetContext: any;

    beforeAll(() => {
        originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
            clearRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            fillStyle: "",
        });
    });

    afterAll(() => {
        HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    it("renders canvas", () => {
        const { container } = render(<StarField />);
        expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("initializes animation loop", () => {
        const { unmount } = render(<StarField />);
        unmount();
    });

    it("handles resize event", () => {
        render(<StarField />);
        fireEvent(window, new Event("resize"));
    });
});
