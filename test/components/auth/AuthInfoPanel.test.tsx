import { render, screen } from "../../test-utils";
import AuthInfoPanel from "@/components/auth/AuthInfoPanel";

describe("AuthInfoPanel", () => {
    it("renders sections correctly", () => {
        const sections = [
            { heading: "Heading 1", body: "Body 1" },
            { heading: "Heading 2", body: "Body 2" }
        ];
        render(<AuthInfoPanel sections={sections} />);

        expect(screen.getByText("Heading 1")).toBeInTheDocument();
        expect(screen.getByText("Body 1")).toBeInTheDocument();
        expect(screen.getByText("Heading 2")).toBeInTheDocument();
        expect(screen.getByText("Body 2")).toBeInTheDocument();
    });
});
