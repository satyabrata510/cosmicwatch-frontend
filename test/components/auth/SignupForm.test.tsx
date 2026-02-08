import { render, screen, waitFor } from "../../test-utils";
import SignupForm from "@/components/auth/SignupForm";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";

// Explicit local mock for useRouter
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

vi.mock("@/stores/auth-store");

// Mock Toast
const mockToast = { success: vi.fn(), error: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: () => mockToast,
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("SignupForm", () => {
    const mockRegister = vi.fn();
    const replaceMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockRegister.mockReset();
        mockToast.success.mockReset();
        mockToast.error.mockReset();

        // Mock implementation of useAuthStore to handle selector
        (useAuthStore as any).mockImplementation((selector: any) => selector({
            register: mockRegister,
        }));

        (useRouter as any).mockReturnValue({
            replace: replaceMock,
        });
    });

    it("renders inputs", () => {
        render(<SignupForm />);
        expect(screen.getByLabelText("Name")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    });

    it("validates password mismatch", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const name = screen.getByLabelText("Name");
        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");
        const confirm = screen.getByLabelText("Confirm Password");
        const btn = screen.getByText("Create Account");

        await user.type(name, "Test User");
        await user.type(email, "test@example.com");
        await user.type(pass, "Password123");
        await user.type(confirm, "Mismatch");

        await user.click(btn);

        expect(await screen.findByText("No match")).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it("validates password complexity", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const name = screen.getByLabelText("Name");
        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");
        const confirm = screen.getByLabelText("Confirm Password");
        const btn = screen.getByText("Create Account");

        await user.type(name, "User");
        await user.type(email, "email@test.com");
        await user.type(pass, "weak");
        await user.type(confirm, "weak");

        await user.click(btn);

        expect(await screen.findByText(/min 8 characters/i)).toBeInTheDocument();
    });

    it("submits valid form", async () => {
        const user = userEvent.setup();
        render(<SignupForm />);

        const name = screen.getByLabelText("Name");
        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");
        const confirm = screen.getByLabelText("Confirm Password");
        const btn = screen.getByText("Create Account");

        await user.type(name, "Test User");
        await user.type(email, "test@example.com");
        await user.type(pass, "Password123");
        await user.type(confirm, "Password123");

        mockRegister.mockResolvedValue(undefined);

        await user.click(btn);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                name: "Test User",
                email: "test@example.com",
                password: "Password123",
                role: "USER"
            });
        });

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalled();
            expect(replaceMock).toHaveBeenCalledWith("/dashboard");
        });
    });
});
