import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { authRouter } from "./modules/auth/router";
import { areasRouter } from "./modules/areas/router";
import { collaboratorsRouter } from "./modules/collaborators/router";
import { projectsRouter } from "./modules/projects/router";

const app = express();
const origins = env.CORS_ORIGIN.split(",").map(s => s.trim());

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use("/auth", authRouter);
app.use("/areas", areasRouter);
app.use("/collaborators", collaboratorsRouter);
app.use("/projects", projectsRouter);
app.use(cors({ origin: origins.includes("*") ? true : origins }));


app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "API up");
});

app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err?.statusCode ?? 500;
  const body = {
    message: err?.message ?? "Internal Server Error",
    code: err?.code,
    details: err?.details,
  };
  if (process.env.NODE_ENV === "development" && status >= 500) {
    (body as any).stack = err?.stack;
  }
  res.status(status).json(body);
});
