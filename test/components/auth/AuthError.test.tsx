import { render, screen } from "../../test-utils";
import AuthError from "@/components/auth/AuthError";

describe("AuthError", () => {
    it("renders error message", () => {
        render(<AuthError message="Test Error" />);
        expect(screen.getByText("Test Error")).toBeInTheDocument();
    });
});
