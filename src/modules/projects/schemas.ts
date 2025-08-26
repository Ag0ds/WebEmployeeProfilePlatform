import { z } from "zod";

export const CreateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    deadline: z.coerce.date().optional(),      
    description: z.string().optional(),
    technologies: z.array(z.string().min(1)).default([]).optional(),
    memberIds: z.array(z.string().min(1)).optional(), 
  }),
});

export const UpdateProjectSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(2).optional(),
    deadline: z.coerce.date().optional(),
    description: z.string().optional(),
    technologies: z.array(z.string().min(1)).optional(),
  }).refine((b) => Object.keys(b).length > 0, { message: "Body vazio" }),
});

export const IdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const MemberAddSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ collaboratorId: z.string().min(1) }),
});

export const MemberRemoveSchema = z.object({
  params: z.object({ id: z.string().min(1), collaboratorId: z.string().min(1) }),
});

export const ListProjectsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    q: z.string().trim().min(1).optional(), // busca por name
  }),
});
