import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ModeToggle } from "../components/mode-toggle";
import { CreateTaskDialog } from "../components/tasks/CreateTaskDialog";
import { EditTaskDialog } from "../components/tasks/EditTaskDialog";
import { TaskCard } from "../components/tasks/TaskCard";
import { Loader2, ListTodo } from "lucide-react";
import type { Task } from "../lib/schemas";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back, {user?.username}!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              My Tasks
            </h2>
            <CreateTaskDialog onCreateTask={addTask} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && tasks.length === 0 && (
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ListTodo className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  No tasks yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-4">
                  Get started by creating your first task!
                </p>
                <CreateTaskDialog onCreateTask={addTask} />
              </CardContent>
            </Card>
          )}

          {/* Tasks Grid */}
          {!isLoading && tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        <EditTaskDialog
          task={editingTask}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUpdateTask={updateTask}
        />
      </div>
    </div>
  );
}
