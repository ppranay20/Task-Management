import express, { Router } from "express";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";

const app = express();
const router = Router();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Register API routes
app.use("/api", router);

// Register auth routes
router.use("/auth", authRoutes);

// Register task routes
router.use("/tasks", taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`App is running on ports ${PORT}`);
});
