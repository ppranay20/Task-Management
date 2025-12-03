import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Dashboard } from "../../../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useAuth
vi.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { username: "testuser" },
    logout: vi.fn(),
  }),
}));

// Mock useTasks hook
const mockUseTasks = vi.fn();
vi.mock("../../../hooks/useTasks", () => ({
  useTasks: () => mockUseTasks(),
}));

// Mock components that might cause issues or aren't focus of this test
vi.mock("../../mode-toggle", () => ({
  ModeToggle: () => <div data-testid="mode-toggle">Mode Toggle</div>,
}));

// Mock CreateTaskDialog to avoid complex rendering
vi.mock("../CreateTaskDialog", () => ({
  CreateTaskDialog: () => <button>Add Task</button>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it("shows loading state initially", () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: true,
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    });

    renderComponent();

    // Look for the loader icon or a loading container
    expect(screen.getByText("My Tasks")).toBeInTheDocument();

    // Check that tasks are not rendered
    expect(screen.queryByText("No tasks yet")).not.toBeInTheDocument();
  });

  it("renders a list of tasks", () => {
    const mockTasks = [
      {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        status: "pending",
        userId: "user1",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01",
      },
      {
        id: "2",
        title: "Task 2",
        description: "Description 2",
        status: "completed",
        userId: "user1",
        createdAt: "2023-01-02",
        updatedAt: "2023-01-02",
      },
    ];

    mockUseTasks.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();

    // Check status badges
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows empty state when no tasks found", () => {
    mockUseTasks.mockReturnValue({
      tasks: [],
      isLoading: false,
      addTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by creating your first task!")
    ).toBeInTheDocument();
  });
});
