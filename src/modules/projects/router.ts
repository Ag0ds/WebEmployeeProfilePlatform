import { Router } from "express";
import { validate } from "../../shared/middlewares/validate";
import { auth } from "../../shared/middlewares/auth";
import { rbac } from "../../shared/middlewares/rbac";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  IdParamSchema,
  MemberAddSchema,
  MemberRemoveSchema,
} from "./schemas";
import { projectsService } from "./service";

export const projectsRouter = Router();

// GETs: públicos (se quiser, aplique auth)
projectsRouter.get("/", async (_req, res, next) => {
  try {
    const items = await projectsService.list();
    res.json(items);
  } catch (err) { next(err); }
});

projectsRouter.get("/:id", validate(IdParamSchema), async (req, res, next) => {
  try {
    const item = await projectsService.get(req.params.id!);
    res.json(item);
  } catch (err) { next(err); }
});

// Mutations: apenas GESTOR
projectsRouter.post("/", auth, rbac("GESTOR"), validate(CreateProjectSchema), async (req, res, next) => {
  try {
    const created = await projectsService.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

projectsRouter.put("/:id", auth, rbac("GESTOR"), validate(UpdateProjectSchema), async (req, res, next) => {
  try {
    const updated = await projectsService.update(req.params.id!, req.body);
    res.json(updated);
  } catch (err) { next(err); }
});

projectsRouter.post("/:id/members", auth, rbac("GESTOR"), validate(MemberAddSchema), async (req, res, next) => {
  try {
    const p = await projectsService.addMember(req.params.id!, req.body.collaboratorId);
    res.json(p);
  } catch (err) { next(err); }
});

projectsRouter.delete("/:id/members/:collaboratorId", auth, rbac("GESTOR"), validate(MemberRemoveSchema), async (req, res, next) => {
  try {
    const p = await projectsService.removeMember(req.params.id!, req.params.collaboratorId!);
    res.json(p);
  } catch (err) { next(err); }
});
