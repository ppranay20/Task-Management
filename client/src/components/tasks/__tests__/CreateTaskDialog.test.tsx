import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { CreateTaskDialog } from "../CreateTaskDialog";

// Mock dependencies
const mockAddTask = vi.fn();

describe("CreateTaskDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<CreateTaskDialog onCreateTask={mockAddTask} />);
  };

  it("opens dialog, fills form, and submits task", async () => {
    renderComponent();
    const user = userEvent.setup();

    // 1. Open Dialog
    const addButton = screen.getByRole("button", { name: /add task/i });
    await user.click(addButton);

    // Verify dialog content is visible
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Create New Task")).toBeInTheDocument();

    // 2. Fill Form
    // Note: Shadcn Dialog renders in a Portal, but RTL handles this automatically with screen queries
    await user.type(
      screen.getByPlaceholderText(/enter task title/i),
      "New Task Title"
    );
    await user.type(
      screen.getByPlaceholderText(/enter task description/i),
      "New Task Description"
    );

    // Status is hidden in Create mode (defaults to pending), so we don't need to select it

    // 3. Submit
    const submitButton = screen.getByRole("button", { name: /create task/i });
    await user.click(submitButton);

    // 4. Verify addTask called
    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith({
        title: "New Task Title",
        description: "New Task Description",
        status: "pending",
      });
    });
  });
});
