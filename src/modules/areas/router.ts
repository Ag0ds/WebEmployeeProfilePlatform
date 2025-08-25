import { Router } from "express";
import { areasService } from "./service";

export const areasRouter = Router();

areasRouter.get("/", async (_req, res, next) => {
  try {
    const areas = await areasService.list();
    res.set("Cache-Control", "public, max-age=60");
    res.json(areas);
  } catch (err) {
    next(err);
  }
});
