import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 1. Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // 2. Get token from header (Format: "Bearer <token>")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // 3. Verify token
    const secret = process.env.JWT_SECRET || "supersecretfallback";
    const decoded = jwt.verify(token, secret) as { userId: string };

    // 4. Attach user to request object
    req.user = decoded;

    // 5. Move to the next middleware/controller
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};
