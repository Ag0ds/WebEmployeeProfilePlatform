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
import { ListProjectsSchema } from "./schemas";


export const projectsRouter = Router();

projectsRouter.get("/", validate(ListProjectsSchema), async (req, res, next) => {
  try {
    const { page, perPage, q } = req.query as any;
    const items = await projectsService.list({ page, perPage, q });
    res.json(items);
  } catch (err) { next(err); }
});

projectsRouter.get("/:id", validate(IdParamSchema), async (req, res, next) => {
  try {
    const item = await projectsService.get(req.params.id!);
    res.json(item);
  } catch (err) { next(err); }
});

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

projectsRouter.post("/:id/complete", auth, rbac("GESTOR"), validate(IdParamSchema), async (req, res, next) => {
  try {
    const p = await projectsService.complete(req.params.id!);
    res.json(p);
  } catch (err) { next(err); }
});

projectsRouter.post("/:id/cancel", auth, rbac("GESTOR"), validate(IdParamSchema), async (req, res, next) => {
  try {
    const p = await projectsService.cancel(req.params.id!);
    res.json(p);
  } catch (err) { next(err); }
});

projectsRouter.post("/:id/reopen", auth, rbac("GESTOR"), validate(IdParamSchema), async (req, res, next) => {
  try {
    const p = await projectsService.reopen(req.params.id!);
    res.json(p);
  } catch (err) { next(err); }
});

projectsRouter.delete("/:id", auth, rbac("GESTOR"), validate(IdParamSchema), async (req, res, next) => {
  try {
    await projectsService.removeproject(req.params.id!);
    res.status(204).send();
  } catch (err) { next(err); }
});
