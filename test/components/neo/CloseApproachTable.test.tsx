import { render, screen } from "../../test-utils";
import CloseApproachTable from "@/components/neo/CloseApproachTable";

describe("CloseApproachTable", () => {
    const mockApproaches = [
        {
            close_approach_date: "2023-10-27",
            close_approach_date_full: "2023-Oct-27 12:00",
            epoch_date_close_approach: 1698408000000,
            relative_velocity: {
                kilometers_per_second: "10.5",
                kilometers_per_hour: "37800",
                miles_per_hour: "23000"
            },
            miss_distance: {
                astronomical: "0.05",
                lunar: "20",
                kilometers: "7500000",
                miles: "4600000"
            },
            orbiting_body: "Earth"
        }
    ] as any;

    it("renders table with data", () => {
        render(<CloseApproachTable approaches={mockApproaches} />);

        expect(screen.getByText("Close Approaches")).toBeInTheDocument();
        expect(screen.getByText("2023-Oct-27 12:00")).toBeInTheDocument();
        expect(screen.getByText("10.50")).toBeInTheDocument(); // km/s
        expect(screen.getByText("7,500,000")).toBeInTheDocument(); // km, formatted
        expect(screen.getByText("Earth")).toBeInTheDocument();
    });

    it("renders empty state", () => {
        render(<CloseApproachTable approaches={[]} />);

        expect(screen.getByText("No close approach data available.")).toBeInTheDocument();
    });
});
