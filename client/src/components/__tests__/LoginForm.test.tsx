import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { LoginForm } from "../LoginForm";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
vi.mock("axios");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useAuth context
const mockLogin = vi.fn();
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };

  it("renders username and password inputs", () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    renderComponent();
    const user = userEvent.setup();

    // Click login without typing anything
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Check for validation messages (from Zod schema)
    // Username min 3 chars, Password min 6 chars
    await waitFor(() => {
      expect(
        screen.getByText(/username must be at least 3 characters long/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it("calls API with correct payload on valid submit", async () => {
    renderComponent();
    const user = userEvent.setup();

    // Mock successful API response
    (axios.post as any).mockResolvedValueOnce({
      data: {
        token: "fake-token",
        user: { id: "1", username: "testuser" },
      },
    });

    // Type valid credentials
    await user.type(screen.getByPlaceholderText(/enter username/i), "testuser");
    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "password123"
    );

    // Click login
    await user.click(screen.getByRole("button", { name: /login/i }));

    // Verify API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/login"),
        {
          username: "testuser",
          password: "password123",
        }
      );
    });

    // Verify login context called
    expect(mockLogin).toHaveBeenCalledWith("fake-token", {
      id: "1",
      username: "testuser",
    });

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
