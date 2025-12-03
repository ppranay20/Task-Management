import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  type CreateTaskData,
  type Task,
} from "../../lib/schemas";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TaskFormProps {
  onSubmit: (data: CreateTaskData) => Promise<void>;
  initialData?: Task;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, initialData, isLoading }: TaskFormProps) {
  const form = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "pending",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description || "",
        status: initialData.status,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "pending",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: CreateTaskData) => {
    await onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-slate-200">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter task title"
                  {...field}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-slate-200">
                Description (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter task description"
                  {...field}
                  value={field.value || ""}
                  className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {initialData && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-slate-200">Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                    <SelectItem
                      value="pending"
                      className="dark:hover:bg-slate-800"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="completed"
                      className="dark:hover:bg-slate-800"
                    >
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update Task"
            : "Create Task"}
        </Button>
      </form>
    </Form>
  );
}
