import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { EditTaskDialog } from "../EditTaskDialog";
import { TaskCard } from "../TaskCard";
import { useState } from "react";
import type { Task } from "../../../lib/schemas";

// Mock dependencies
const mockUpdateTask = vi.fn();

const mockTask: Task = {
  id: "task-123",
  title: "Original Title",
  description: "Original Description",
  status: "pending",
  userId: "user-1",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
};

// Test Wrapper to handle state
function TestWrapper() {
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setOpen(true);
  };

  return (
    <>
      <TaskCard task={mockTask} onEdit={handleEdit} onDelete={vi.fn()} />
      <EditTaskDialog
        task={editingTask}
        open={open}
        onOpenChange={setOpen}
        onUpdateTask={mockUpdateTask}
      />
    </>
  );
}

describe("EditTaskDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(<TestWrapper />);
  };

  it("opens dialog, pre-fills data, and updates task", async () => {
    renderComponent();
    const user = userEvent.setup();

    // 1. Click Dropdown Trigger
    const trigger = screen.getByRole("button", { name: /open menu/i });
    await user.click(trigger);

    // 2. Click Edit Item
    const editItem = await screen.findByText(/edit/i);
    await user.click(editItem);

    // 3. Verify Dialog Opens and Data Pre-filled
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Edit Task")).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/enter task title/i);
    expect(titleInput).toHaveValue("Original Title");

    // Status should be visible in Edit mode
    // Check the Select trigger's text content
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toHaveTextContent("Pending");

    // 4. Interaction: Change Title
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");

    // 5. Submit
    const submitButton = screen.getByRole("button", { name: /update task/i });
    await user.click(submitButton);

    // 6. Verify updateTask called
    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith("task-123", {
        title: "Updated Title",
        description: "Original Description",
        status: "pending",
      });
    });
  });
});
