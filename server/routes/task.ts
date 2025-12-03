import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Middlware to authenticate token
router.use(authenticateToken);

// Task routes
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
