import { z } from "zod";

const AreaName = z.enum([
  "FRONTEND","BACKEND","INFRA","DESIGN","REQUISITOS","GESTAO",
]);

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema);

const emptyToNullString = z.preprocess(
  (v) => (v === "" ? null : v),
  z.union([z.string().min(2), z.null()])
);

const emptyToNullNumber = z.preprocess(
  (v) => (v === "" ? null : v),
  z.union([z.coerce.number().int().positive(), z.null()])
);

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
    name: emptyToUndefined(z.string().min(2)).optional(),
    email: emptyToUndefined(z.string().email()).optional(),
    password: emptyToUndefined(z.string().min(6)).optional(),
    age: emptyToNullNumber.optional(),
    regime: emptyToNullString.optional(),
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
