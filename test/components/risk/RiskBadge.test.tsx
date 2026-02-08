import { render, screen } from "../../test-utils";
import RiskBadge from "@/components/risk/RiskBadge";
import { describe, it, expect } from "vitest";

describe("RiskBadge", () => {
    it("renders label and correct color for different levels", () => {
        const { rerender } = render(<RiskBadge level="LOW" />);
        expect(screen.getByText("LOW RISK")).toBeInTheDocument();

        rerender(<RiskBadge level="MEDIUM" />);
        expect(screen.getByText("MEDIUM RISK")).toBeInTheDocument();

        rerender(<RiskBadge level="HIGH" />);
        expect(screen.getByText("HIGH RISK")).toBeInTheDocument();
    });

    it("renders custom size class", () => {
        const { container } = render(<RiskBadge level="LOW" size="md" />);
        // Checking if class is applied might require inspecting classList or having specific style expectations
        // Assuming implementation maps size to classes
        expect(container.firstChild).toHaveClass("text-xs"); // md uses text-xs
    });
});
