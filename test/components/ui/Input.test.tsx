import { render, screen, fireEvent } from "../../test-utils";
import Input from "@/components/ui/Input";
import { Search } from "lucide-react";

describe("Input", () => {
    it("renders with label", () => {
        render(<Input label="Email" placeholder="Enter email" />);
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    });

    it("displays error message", () => {
        render(<Input error="Invalid email" />);
        expect(screen.getByText("Invalid email")).toBeInTheDocument();
        // Check if input has error styling class
        expect(screen.getByRole("textbox")).toHaveClass("border-danger");
    });

    it("toggles password visibility", () => {
        render(<Input type="password" placeholder="Password" />);
        const input = screen.getByPlaceholderText("Password") as HTMLInputElement;
        const toggleButton = screen.getByRole("button");

        expect(input.type).toBe("password");

        fireEvent.click(toggleButton);
        expect(input.type).toBe("text");

        fireEvent.click(toggleButton);
        expect(input.type).toBe("password");
    });

    it("renders icon", () => {
        render(<Input icon={<span data-testid="icon">🔍</span>} />);
        expect(screen.getByTestId("icon")).toBeInTheDocument();
    });
});
