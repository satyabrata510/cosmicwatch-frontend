import { render, screen } from "../../test-utils";
import AuthFooter from "@/components/auth/AuthFooter";

describe("AuthFooter", () => {
    it("renders text and link", () => {
        render(
            <AuthFooter
                text="Already have an account?"
                linkText="Sign in"
                href="/login"
                index={1}
            />
        );
        expect(screen.getByText(/Already have an account?/)).toBeInTheDocument();
        const link = screen.getByRole("link", { name: "Sign in" });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/login");
    });
});
