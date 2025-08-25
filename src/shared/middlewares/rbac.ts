import type { Request, Response, NextFunction } from "express";

export function rbac(...roles: Array<"NORMAL" | "GESTOR">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthenticated" });
    if (!roles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
