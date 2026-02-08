import { render, screen } from "../../test-utils";
import AuthCard from "@/components/auth/AuthCard";

describe("AuthCard", () => {
    it("renders title and panels correctly", () => {
        const left = <div data-testid="left">Left Panel</div>;
        const right = <div data-testid="right">Right Panel</div>;
        const form = <div data-testid="form">Form Content</div>;

        render(
            <AuthCard
                title="Test Title"
                leftPanel={left}
                rightPanel={right}
            >
                {form}
            </AuthCard>
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByTestId("left")).toHaveTextContent("Left Panel");
        expect(screen.getByTestId("right")).toHaveTextContent("Right Panel");
        expect(screen.getByTestId("form")).toHaveTextContent("Form Content");
    });
});
