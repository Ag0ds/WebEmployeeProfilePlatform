import { Router } from "express";
import { auth } from "../../shared/middlewares/auth";
import { rbac } from "../../shared/middlewares/rbac";
import { validate } from "../../shared/middlewares/validate";
import {
  CreateCollaboratorSchema,
  UpdateCollaboratorSchema,
  IdParamSchema,
} from "./schemas";
import { collaboratorsService } from "./service";
import { ListCollaboratorsSchema } from "./schemas";

export const collaboratorsRouter = Router();

collaboratorsRouter.get("/", auth, validate(ListCollaboratorsSchema), async (req, res, next) => {
  try {
    const { page, perPage, q } = req.query as any;
    const data = await collaboratorsService.list(req.user!.role, { page, perPage, q });
    res.json(data);
  } catch (err) { next(err); }
});

collaboratorsRouter.get("/:id", auth, validate(IdParamSchema), async (req, res, next) => {
  try {
    const viewerRole = req.user!.role;
    const data = await collaboratorsService.get(viewerRole, req.params.id!);
    res.json(data);
  } catch (err) { next(err); }
});


collaboratorsRouter.post("/", auth, rbac("GESTOR"), validate(CreateCollaboratorSchema), async (req, res, next) => {
  try {
    const data = await collaboratorsService.create(req.body);
    res.status(201).json(data);
  } catch (err) { next(err); }
});

collaboratorsRouter.put("/:id", auth, rbac("GESTOR"), validate(UpdateCollaboratorSchema), async (req, res, next) => {
  try {
    const data = await collaboratorsService.update(req.params.id!, req.body);
    res.json(data);
  } catch (err) { next(err); }
});

collaboratorsRouter.delete("/:id", auth, rbac("GESTOR"), validate(IdParamSchema), async (req, res, next) => {
  try {
    await collaboratorsService.remove(req.params.id!);
    res.status(204).send();
  } catch (err) { next(err); }
});
