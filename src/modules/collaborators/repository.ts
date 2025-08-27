import { prisma } from "../../config/prisma";
import type { Prisma } from "../../generated/prisma";

const baseSelect = {
  id: true,
  name: true,
  email: true,
  age: true,
  regime: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  areas: { select: { area: { select: { name: true } } } },
} as const;

export const collaboratorsRepository = {
  listPaged: (page: number | string, perPage: number | string, q?: string) => {
  const pNum = Number(page);
  const ppNum = Number(perPage);
  const pageN = Number.isNaN(pNum) ? 1 : Math.max(1, Math.floor(pNum));
  const perPageN = Number.isNaN(ppNum) ? 10 : Math.min(100, Math.max(1, Math.floor(ppNum)));

  const where: Prisma.CollaboratorWhereInput | undefined = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : undefined;

  const skip = (pageN - 1) * perPageN;
  const take = perPageN;

  return prisma.$transaction(async (tx) => {
    const countArgs: Prisma.CollaboratorCountArgs = {};
    if (where) countArgs.where = where;

    const findArgs: Prisma.CollaboratorFindManyArgs = {
      select: baseSelect,
      orderBy: { name: "asc" },
      skip,
      take,
    };
    if (where) findArgs.where = where;

    const [total, rows] = await Promise.all([
      tx.collaborator.count(countArgs),
      tx.collaborator.findMany(findArgs),
    ]);

    return { total, rows };
  });
},

  findById: (id: string) =>
    prisma.collaborator.findUnique({
      where: { id },
      select: baseSelect,
    }),

  findByEmail: (email: string) =>
    prisma.collaborator.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    }),

  create: async (data: {
    name: string;
    email: string;
    passwordHash: string;
    age?: number | null;
    regime?: string | null;
    role?: "NORMAL" | "GESTOR";
    areaNames?: (
      | "FRONTEND"
      | "BACKEND"
      | "INFRA"
      | "DESIGN"
      | "REQUISITOS"
      | "GESTAO"
    )[];
  }) => {
    const connectAreas = data.areaNames?.map((n) => ({ name: n })) ?? [];

    try {
      const createData: Prisma.CollaboratorCreateInput = {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        age: data.age ?? null,
        regime: data.regime ?? null,
        role: data.role ?? "NORMAL",
      };
      if (connectAreas.length) {
        (createData as any).areas = { create: connectAreas.map((n) => ({ area: { connect: n } })) };
      }
      const created = await prisma.collaborator.create({
        data: createData,
        select: baseSelect,
      });
      return created;
    } catch (e: any) {
      if (e?.code === "P2002") {
        throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
      }
      throw e;
    }
  },

  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      age?: number | null;
      regime?: string | null;
      role?: "NORMAL" | "GESTOR";
      areaNames?: (
        | "FRONTEND"
        | "BACKEND"
        | "INFRA"
        | "DESIGN"
        | "REQUISITOS"
        | "GESTAO"
      )[];
    }
  ) => {
    return prisma.$transaction(async (tx) => {
      if (data.areaNames) {
        const unique = Array.from(new Set(data.areaNames));
        await tx.collaboratorArea.deleteMany({ where: { collaboratorId: id } });

        const areas = await tx.area.findMany({
          where: { name: { in: unique } },
        });

        await tx.collaboratorArea.createMany({
          data: areas.map((a) => ({ collaboratorId: id, areaId: a.id })),
          skipDuplicates: true,
        });
      }

      const updateData: Prisma.CollaboratorUpdateArgs["data"] = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.passwordHash !== undefined) updateData.passwordHash = data.passwordHash;
      if (data.age !== undefined) updateData.age = data.age; 
      if (data.regime !== undefined) updateData.regime = data.regime; 
      if (data.role !== undefined) updateData.role = data.role;

      try {
        const updated = await tx.collaborator.update({
          where: { id },
          data: updateData,
          select: baseSelect,
        });
        return updated;
      } catch (e: any) {
        if (e?.code === "P2002") {
          throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
        }
        throw e;
      }
    });
  },

  delete: (id: string) =>
  prisma.$transaction(async (tx) => {
    await tx.projectMember.deleteMany({ where: { collaboratorId: id } });
    await tx.collaboratorArea.deleteMany({ where: { collaboratorId: id } });
    return tx.collaborator.delete({ where: { id } });
  }),
  
  countByRole: (role: "NORMAL" | "GESTOR") =>
  prisma.collaborator.count({ where: { role } }),

  getRoleById: (id: string) =>
    prisma.collaborator.findUnique({
      where: { id },
      select: { role: true },
    }),
};
