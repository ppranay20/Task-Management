import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { RegisterSchema, LoginSchema } from "../lib/schema";

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    const { username, password } = parsed.data;

    // 2. Check if user exists
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    // 5. Respond (Exclude password)
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: z.treeifyError(parsed.error) });
    }

    const { username, password } = parsed.data;

    // 2. Find User
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Check Password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Generate JWT
    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1h" });

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
