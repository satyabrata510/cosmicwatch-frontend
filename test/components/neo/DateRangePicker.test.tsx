import { render, screen, fireEvent } from "../../test-utils";
import DateRangePicker from "@/components/neo/DateRangePicker";
import * as neoService from "@/services/neo";

vi.mock("@/services/neo", () => ({
    today: vi.fn(),
}));

describe("DateRangePicker", () => {
    const mockOnSearch = vi.fn();
    const defaultProps = {
        startDate: "2023-01-01",
        endDate: "2023-01-07",
        isLoading: false,
        onSearch: mockOnSearch,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (neoService.today as any).mockReturnValue("2023-10-27");
    });

    it("renders inputs with initial values", () => {
        render(<DateRangePicker {...defaultProps} />);

        expect(screen.getByDisplayValue("2023-01-01")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2023-01-07")).toBeInTheDocument();
    });

    it("calls onSearch with new values on submit", () => {
        render(<DateRangePicker {...defaultProps} />);

        const startInput = screen.getByDisplayValue("2023-01-01");
        const endInput = screen.getByDisplayValue("2023-01-07");

        fireEvent.change(startInput, { target: { value: "2023-02-01" } });
        fireEvent.change(endInput, { target: { value: "2023-02-05" } });

        const submitBtn = screen.getByRole("button", { name: /search/i });
        fireEvent.click(submitBtn);

        expect(mockOnSearch).toHaveBeenCalledWith("2023-02-01", "2023-02-05");
    });

    it("updates inputs when clicking presets", () => {
        render(<DateRangePicker {...defaultProps} />);

        const todayBtn = screen.getByRole("button", { name: /today/i });
        fireEvent.click(todayBtn);

        // today mock is 2023-10-27
        expect(mockOnSearch).toHaveBeenCalledWith("2023-10-27", "2023-10-27");
    });

    it("disables buttons when loading", () => {
        render(<DateRangePicker {...defaultProps} isLoading={true} />);

        expect(screen.getByRole("button", { name: /search/i })).toBeDisabled();
    });
});
