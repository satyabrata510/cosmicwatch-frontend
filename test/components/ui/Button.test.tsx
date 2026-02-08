import { render, screen } from "../../test-utils";
import Button from "@/components/ui/Button";

describe("Button", () => {
    it("renders children correctly", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("applies variant classes", () => {
        const { container } = render(<Button variant="danger">Delete</Button>);
        // Check for a class unique to danger variant
        expect(container.firstChild).toHaveClass("bg-danger/10");
        expect(container.firstChild).toHaveClass("text-danger");
    });

    it("shows loader when isLoading is true", () => {
        render(<Button isLoading>Submit</Button>);
        // Loader is an SVG from lucide-react, traditionally has .animate-spin class in this component
        expect(screen.getByRole("button")).toBeDisabled();
        expect(screen.getByRole("button").querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("is disabled when disabled prop is set", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
    });
});
