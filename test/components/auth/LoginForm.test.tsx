import { render, screen, waitFor } from "../../test-utils";
import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";

// Explicit local mock for useRouter
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

vi.mock("@/stores/auth-store");

// Mock Toast explicitly to avoid auto-mock issues
const mockToast = { success: vi.fn(), error: vi.fn() };
vi.mock("@/components/ui/Toast", () => ({
    useToast: () => mockToast,
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("LoginForm", () => {
    const mockLogin = vi.fn();
    const replaceMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockLogin.mockReset();
        mockToast.success.mockReset();
        mockToast.error.mockReset();

        // Use mockImplementation to handle selector correctly
        (useAuthStore as any).mockImplementation((selector: any) => selector({
            login: mockLogin,
        }));

        (useRouter as any).mockReturnValue({
            replace: replaceMock,
        });
    });

    it("renders inputs", () => {
        render(<LoginForm />);
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("handles input changes", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);
        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");

        await user.type(email, "test@example.com");
        await user.type(pass, "password123");

        expect(email).toHaveValue("test@example.com");
        expect(pass).toHaveValue("password123");
    });

    it("submits form and redirects on success", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);
        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");
        const btn = screen.getByText("Sign In");

        await user.type(email, "test@example.com");
        await user.type(pass, "password123");

        mockLogin.mockResolvedValue(undefined);

        await user.click(btn);

        expect(mockLogin).toHaveBeenCalledWith({ email: "test@example.com", password: "password123" });

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalled();
            expect(replaceMock).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("displays error on failure", async () => {
        const user = userEvent.setup();
        render(<LoginForm />);
        const email = screen.getByLabelText("Email");
        const pass = screen.getByLabelText("Password");
        const btn = screen.getByText("Sign In");

        await user.type(email, "test@example.com");
        await user.type(pass, "wrong");

        const error = {
            isAxiosError: true,
            response: { data: { message: "Invalid credentials" } }
        };
        mockLogin.mockRejectedValue(error);

        await user.click(btn);

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith("Invalid credentials", "Login Failed");
        });
    });
});
