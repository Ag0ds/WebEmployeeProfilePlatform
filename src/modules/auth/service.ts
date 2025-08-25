import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { authRepository } from "./repository";
import { signToken } from "../../shared/utils/jwt";

export const authService = {
  async register(input: { name: string; email: string; password: string; age?: number }) {
    const exists = await authRepository.findByEmail(input.email);
    if (exists) throw Object.assign(new Error("Email already in use"), { statusCode: 409 });

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    const user = await authRepository.createCollaborator({
      name: input.name,
      email: input.email,
      passwordHash,
      ...(input.age !== undefined ? { age: input.age } : {}),
    });
    const token = signToken(user.id, user.role);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },

  async login(input: { email: string; password: string }) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

    const token = signToken(user.id, user.role);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },
};
