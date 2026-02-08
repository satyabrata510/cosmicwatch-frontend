import { render, screen } from "../../test-utils";
import RiskGauge from "@/components/risk/RiskGauge";

describe("RiskGauge", () => {
    it("renders score and text", () => {
        render(<RiskGauge score={75} level="HIGH" />);
        expect(screen.getByText("75")).toBeInTheDocument();
        expect(screen.getByText("/ 100")).toBeInTheDocument();
    });

    it("renders SVG elements", () => {
        const { container } = render(<RiskGauge score={50} level="MEDIUM" />);
        expect(container.querySelector("svg")).toBeInTheDocument();
        expect(container.querySelectorAll("circle")).toHaveLength(2); // Track + Progress
    });
});
