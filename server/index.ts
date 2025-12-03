import express, { Router } from "express";
import authRoutes from "./routes/auth";

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

// Start server
app.listen(PORT, () => {
  console.log(`App is running on ports ${PORT}`);
});
