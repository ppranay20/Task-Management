import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TaskCard } from "../TaskCard";

// Mock dependencies
const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

const mockTask = {
  id: "task-123",
  title: "Test Task",
  description: "Test Description",
  status: "pending" as const,
  userId: "user-1",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
};

describe("TaskCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
  };

  it("calls onDelete when delete menu item is clicked", async () => {
    renderComponent();
    const user = userEvent.setup();

    // 1. Click Dropdown Trigger (MoreVertical icon button)
    const trigger = screen.getByRole("button", { name: /open menu/i });
    await user.click(trigger);

    // 2. Click Delete Item
    // Dropdown items are in a portal, so we use screen.getByText or getByRole("menuitem")
    const deleteItem = await screen.findByText(/delete/i);
    await user.click(deleteItem);

    // 3. Verify onDelete called
    expect(mockOnDelete).toHaveBeenCalledWith("task-123");
  });
});
