import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(16),
  BCRYPT_ROUNDS: z.coerce.number().min(8).max(14).default(10),
});

export const env = EnvSchema.parse(process.env);
