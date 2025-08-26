import { z } from "zod";

const AreaName = z.enum([
  "FRONTEND","BACKEND","INFRA","DESIGN","REQUISITOS","GESTAO",
]);

export const CreateCollaboratorSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    age: z.number().int().positive().optional(),
    regime: z.string().min(2).optional(),
    areaNames: z.array(AreaName).min(1).optional(),
  }),
});

export const UpdateCollaboratorSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    age: z.number().int().positive().optional(),
    regime: z.string().min(2).optional(),
    role: z.enum(["NORMAL","GESTOR"]).optional(),
    areaNames: z.array(AreaName).min(1).optional(),
  }).refine((b) => Object.keys(b).length > 0, { message: "Body vazio" }),
});

export const IdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const ListCollaboratorsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().trim().min(1).optional(),
  }),
});
