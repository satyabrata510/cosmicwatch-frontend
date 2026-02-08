import { render, screen } from "../../test-utils";
import QuickAccess from "@/components/dashboard/QuickAccess";
import { usePermission } from "@/lib/hooks/usePermission";

vi.mock("@/lib/hooks/usePermission", () => ({
    usePermission: vi.fn(),
}));

describe("QuickAccess", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders common links for all users", () => {
        (usePermission as any).mockReturnValue({ role: "USER" });
        render(<QuickAccess />);

        expect(screen.getByText("NEO Feed")).toBeInTheDocument();
        expect(screen.getByText("Risk Analysis")).toBeInTheDocument();
        expect(screen.queryByText("Admin Panel")).not.toBeInTheDocument();
    });

    it("renders admin link for ADMIN role", () => {
        (usePermission as any).mockReturnValue({ role: "ADMIN" });
        render(<QuickAccess />);

        expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    });
});
