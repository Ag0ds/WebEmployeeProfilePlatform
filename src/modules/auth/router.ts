import { Router } from "express";
import { validate } from "../../shared/middlewares/validate";
import { RegisterSchema, LoginSchema } from "./schemas";
import { authService } from "./service";
import { loginLimiter } from "../../shared/middlewares/rateLimit";

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
