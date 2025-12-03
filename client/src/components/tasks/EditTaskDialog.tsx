import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { TaskForm } from "./TaskForm";
import type { Task, CreateTaskData } from "../../lib/schemas";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateTask: (id: string, data: CreateTaskData) => Promise<void>;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onUpdateTask,
}: EditTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateTaskData) => {
    if (!task) return;

    try {
      setIsLoading(true);
      await onUpdateTask(task.id, data);
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-50">Edit Task</DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            Make changes to your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          onSubmit={handleSubmit}
          initialData={task}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
