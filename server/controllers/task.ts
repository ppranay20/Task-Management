import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { TaskStatus } from "../generated/prisma/client";
import { CreateTaskSchema, UpdateTaskSchema } from "../lib/schema";

export const getTasks = async (req: Request, res: Response) => {
  try {
    // 1. Get user ID from authenticated token
    const userId = req.user?.userId;

    // 2. Check if user exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 3. Get tasks for user
    const tasks = await prisma.task.findMany({
      where: { userId: userId as string },
      orderBy: { createdAt: "desc" },
    });

    // 4. Return tasks
    return res.json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    // 1. Get user ID from authenticated token
    const userId = req.user?.userId;

    // 2. Check if user exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 3. Validate Input
    const parsed = CreateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    const { title, description, status } = parsed.data;

    // 4. Create Task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: (status as TaskStatus) || TaskStatus.pending,
        userId: userId as string,
      },
    });

    // 5. Return task
    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    // 1. Get user ID from authenticated token
    const userId = req.user?.userId;
    const taskId = req.params.id;

    // 2. Check if user exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 3. Check if task ID is provided
    if (!taskId) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // 4. Validate Input
    const parsed = UpdateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    // 5. Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // 6. Check if task belongs to user
    if (existingTask.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't own this task" });
    }

    // 7. Update Task
    const { title, description, status } = parsed.data;
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status: status as TaskStatus }),
      },
    });

    // 8. Return updated task
    return res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    // 1. Get user ID from authenticated token
    const userId = req.user?.userId;
    const taskId = req.params.id;

    // 2. Check if user exists
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 3. Check if task ID is provided
    if (!taskId) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // 4. Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    // 5. Check if task exists
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // 6. Check if task belongs to user
    if (existingTask.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't own this task" });
    }

    // 7. Delete Task
    await prisma.task.delete({
      where: { id: taskId },
    });

    // 8. Return success message
    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
