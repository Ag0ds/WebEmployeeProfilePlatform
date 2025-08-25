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

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use("/auth", authRouter);
app.use("/areas", areasRouter);
app.use("/collaborators", collaboratorsRouter);
app.use("/projects", projectsRouter);


app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});


app.use((err: any, _req: any, res: any, _next: any) => {
  logger.error(err);
  res.status(err?.statusCode || 500).json({ message: err?.message || "Internal Server Error" });
});

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "API up");
});
