import { render, screen } from "../../test-utils";
import Card from "@/components/ui/Card";

describe("Card", () => {
    it("renders children", () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("applies glass variant", () => {
        const { container } = render(<Card variant="glass">Glass</Card>);
        expect(container.firstChild).toHaveClass("glass");
    });

    it("applies custom className", () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        expect(container.firstChild).toHaveClass("custom-class");
    });
});
