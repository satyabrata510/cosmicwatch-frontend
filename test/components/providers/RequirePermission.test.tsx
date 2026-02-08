import { render, screen } from "../../test-utils";
import RequirePermission from "@/components/providers/RequirePermission";
import { usePermission } from "@/lib/hooks/usePermission";

// Mocks
vi.mock("@/lib/hooks/usePermission");

describe("RequirePermission", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders children when permitted", () => {
        (usePermission as any).mockReturnValue({ can: () => true });

        render(
            <RequirePermission resource="neo_data" action="read">
                <div>Protected Content</div>
            </RequirePermission>
        );

        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders fallback when denied", () => {
        (usePermission as any).mockReturnValue({ can: () => false });

        render(
            <RequirePermission resource="neo_data" action="read" fallback={<div>Access Denied</div>}>
                <div>Protected Content</div>
            </RequirePermission>
        );

        expect(screen.getByText("Access Denied")).toBeInTheDocument();
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("renders nothing when denied and no fallback", () => {
        (usePermission as any).mockReturnValue({ can: () => false });

        render(
            <RequirePermission resource="neo_data" action="read">
                <div>Protected Content</div>
            </RequirePermission>
        );

        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
});
