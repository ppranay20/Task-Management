import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { RegisterForm } from "../RegisterForm";
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

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );
  };

  it("shows validation errors for short username and password", async () => {
    renderComponent();
    const user = userEvent.setup();

    // Type short credentials
    await user.type(screen.getByPlaceholderText(/choose a username/i), "ab");
    await user.type(screen.getByPlaceholderText(/choose a password/i), "12345");

    // Click register
    await user.click(screen.getByRole("button", { name: /register/i }));

    // Check for validation messages
    await waitFor(() => {
      expect(
        screen.getByText(/username must be at least 3 characters long/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it("calls API and redirects on valid registration", async () => {
    renderComponent();
    const user = userEvent.setup();

    // Mock successful API responses
    // First call: Register
    (axios.post as any).mockResolvedValueOnce({
      data: { message: "User created" },
    });
    // Second call: Login
    (axios.post as any).mockResolvedValueOnce({
      data: {
        token: "fake-token",
        user: { id: "1", username: "newuser" },
      },
    });

    // Type valid credentials
    await user.type(
      screen.getByPlaceholderText(/choose a username/i),
      "newuser"
    );
    await user.type(
      screen.getByPlaceholderText(/choose a password/i),
      "password123"
    );

    // Click register
    await user.click(screen.getByRole("button", { name: /register/i }));

    // Verify API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/register"),
        {
          username: "newuser",
          password: "password123",
        }
      );
    });

    // Verify login context called
    expect(mockLogin).toHaveBeenCalledWith("fake-token", {
      id: "1",
      username: "newuser",
    });

    // Verify navigation
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
