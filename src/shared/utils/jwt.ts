import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type Role = "NORMAL" | "GESTOR";

export function signToken(userId: string, role: Role) {
  return jwt.sign({ role }, env.JWT_SECRET, { subject: userId, expiresIn: "1d" });
}
