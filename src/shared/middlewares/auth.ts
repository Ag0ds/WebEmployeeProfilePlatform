import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: "NORMAL" | "GESTOR" };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
