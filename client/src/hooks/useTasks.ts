import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import type { Task, CreateTaskData, UpdateTaskData } from "../lib/schemas";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");

      const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data.tasks || response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to fetch tasks";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add new task
  const addTask = async (data: CreateTaskData) => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await axios.post(`${API_BASE_URL}/api/tasks`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Task created!", {
        description: "Your task has been added successfully.",
      });

      // Refresh tasks list
      await fetchTasks();

      return response.data.task || response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to create task";
      toast.error("Error", { description: errorMessage });
      throw err;
    }
  };

  // Update existing task
  const updateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const token = localStorage.getItem("auth_token");

      const response = await axios.put(
        `${API_BASE_URL}/api/tasks/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Task updated!", {
        description: "Your changes have been saved.",
      });

      // Refresh tasks list
      await fetchTasks();

      return response.data.task || response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to update task";
      toast.error("Error", { description: errorMessage });
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem("auth_token");

      await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Task deleted!", {
        description: "The task has been removed.",
      });

      // Refresh tasks list
      await fetchTasks();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to delete task";
      toast.error("Error", { description: errorMessage });
      throw err;
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}
