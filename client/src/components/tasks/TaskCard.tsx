import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import type { Task } from "../../lib/schemas";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {task.title}
          </CardTitle>
          <Badge
            variant={task.status === "completed" ? "default" : "secondary"}
            className={
              task.status === "completed"
                ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400 mt-2"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 mt-2"
            }
          >
            {task.status === "completed" ? "Completed" : "Pending"}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              aria-label="Open menu"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-slate-900 dark:border-slate-800"
          >
            <DropdownMenuItem
              onClick={() => onEdit(task)}
              className="cursor-pointer dark:hover:bg-slate-800"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-slate-800"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {task.description && (
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {task.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
