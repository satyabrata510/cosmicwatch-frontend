import { render, screen, fireEvent } from "../../test-utils";
import RoomSelector from "@/components/chat/RoomSelector";

describe("RoomSelector", () => {
    const mockOnJoin = vi.fn();
    const asteroidRooms = [{ id: "asteroid-1", name: "Asteroid 1" }];

    it("renders default rooms", () => {
        render(<RoomSelector currentRoom="general" onJoin={mockOnJoin} />);

        expect(screen.getByText("General")).toBeInTheDocument();
        expect(screen.getByText("Risk Alerts")).toBeInTheDocument();
    });

    it("renders asteroid rooms", () => {
        render(<RoomSelector currentRoom="general" onJoin={mockOnJoin} asteroidRooms={asteroidRooms} />);

        expect(screen.getByText("Asteroids")).toBeInTheDocument();
        expect(screen.getByText("Asteroid 1")).toBeInTheDocument();
    });

    it("highlights active room", () => {
        render(<RoomSelector currentRoom="risk-alerts" onJoin={mockOnJoin} />);

        const riskButton = screen.getByText("Risk Alerts").closest("button");
        expect(riskButton).toHaveClass("text-accent");
    });

    it("calls onJoin when clicking a room", () => {
        render(<RoomSelector currentRoom="general" onJoin={mockOnJoin} />);

        fireEvent.click(screen.getByText("Risk Alerts"));
        expect(mockOnJoin).toHaveBeenCalledWith("risk-alerts");
    });
});
