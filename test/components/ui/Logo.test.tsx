import { render, screen } from "../../test-utils";
import Logo from "@/components/ui/Logo";

describe("Logo", () => {
    it("renders correctly", () => {
        render(<Logo />);
        expect(screen.getByText("Cosmic")).toBeInTheDocument();
        expect(screen.getByText("Watch")).toBeInTheDocument();
    });

    it("applies size classes", () => {
        const { container } = render(<Logo size="lg" />);
        // Check for class associated with large size
        expect(container.querySelector(".text-2xl")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        const { container } = render(<Logo className="custom-match" />);
        expect(container.firstChild).toHaveClass("custom-match");
    });
});
