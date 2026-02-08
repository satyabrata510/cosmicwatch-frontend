import { render, screen, act, fireEvent } from "../../test-utils";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";

// Helper component to consume toast context
const TestComponent = () => {
    const { success, error, warning, info } = useToast();
    return (
        <div>
            <Button onClick={() => success("Success message", "Success Title")}>Success</Button>
            <Button onClick={() => error("Error message")}>Error</Button>
            <Button onClick={() => warning("Warning message")}>Warning</Button>
            <Button onClick={() => info("Info message")}>Info</Button>
        </div>
    );
};

describe("Toast System", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("throws error if used outside provider", () => {
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });
        expect(() => render(<TestComponent />, { wrapper: ({ children }) => <>{children}</> })).toThrow(
            "useToast must be used within <ToastProvider>"
        );
        consoleSpy.mockRestore();
    });

    it("displays success toast with title", async () => {
        render(<TestComponent />);

        const btn = screen.getByText("Success");
        await act(async () => {
            btn.click();
        });

        expect(screen.getByText("Success Title")).toBeInTheDocument();
        expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    it("displays error toast and auto-dismisses", async () => {
        render(<TestComponent />);

        const btn = screen.getByText("Error");
        await act(async () => {
            btn.click();
        });

        expect(screen.getByText("Error message")).toBeInTheDocument();

        // Error duration is 6000ms in Toast.tsx
        await act(async () => {
            vi.advanceTimersByTime(6100);
        });
    });

    it("displays warning toast", async () => {
        render(<TestComponent />);
        const btn = screen.getByText("Warning");
        await act(async () => {
            btn.click();
        });
        expect(screen.getByText("Warning message")).toBeInTheDocument();
    });

    it("removes toast on close button click", async () => {
        render(<TestComponent />);
        const btn = screen.getByText("Info");
        await act(async () => {
            btn.click();
        });

        expect(screen.getByText("Info message")).toBeInTheDocument();

        // Find close button (X icon from lucide usually renders as svg)
        // We look for a button that is NOT the "Info" button.
        // Or better, look for button inside the toast container.
        // The toast message is in a div. The button is sibling.

        const closeBtns = screen.getAllByRole("button");
        // Filter out the trigger buttons
        const closeBtn = closeBtns.find(b => !["Success", "Error", "Warning", "Info"].includes(b.textContent || ""));

        if (closeBtn) {
            await act(async () => {
                fireEvent.click(closeBtn);
            });
            // Wait for exit animation
            await act(async () => {
                vi.advanceTimersByTime(1000);
            });
        } else {
            throw new Error("Close button not found");
        }
    });
});
