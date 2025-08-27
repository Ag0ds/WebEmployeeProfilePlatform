import { Router } from "express";
import { validate } from "../../shared/middlewares/validate";
import { RegisterSchema, LoginSchema } from "./schemas";
import { authService } from "./service";
import { loginLimiter } from "../../shared/middlewares/rateLimit";
import { auth } from "../../shared/middlewares/auth";
import { ChangePasswordSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";

export const authRouter = Router();

authRouter.post("/register", validate(RegisterSchema), async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;
    const result = await authService.register({ name, email, password, age });
    res.status(201).json(result);
  } catch (err) { next(err); }
});

authRouter.post("/login", loginLimiter, validate(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) { next(err); }
});

authRouter.get("/me", auth, async (req, res, next) => {
  try {
    const u = req.user!;
    const dbUser = await prisma.collaborator.findUnique({
      where: { id: u.sub },
      select: { id: true, name: true, email: true },
    });
    if (!dbUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json({ id: dbUser.id, name: dbUser.name, email: dbUser.email, role: u.role });
  } catch (e) { next(e); }
});

authRouter.patch("/me/password", auth, validate(ChangePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

    const dbUser = await prisma.collaborator.findUnique({
      where: { id: req.user!.sub },
      select: { passwordHash: true },
    });
    if (!dbUser?.passwordHash) {
      return res.status(400).json({ message: "Usuário inválido." });
    }

    const ok = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!ok) return res.status(400).json({ message: "Senha atual incorreta." });

    const newHash = await bcrypt.hash(newPassword,  await import("../../config/env").then(m => m.env.BCRYPT_ROUNDS));
    await prisma.collaborator.update({
      where: { id: req.user!.sub },
      data: { passwordHash: newHash },
    });

    res.status(204).send();
  } catch (e) { next(e); }
});
