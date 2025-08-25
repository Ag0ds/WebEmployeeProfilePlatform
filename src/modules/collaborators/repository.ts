import { prisma } from "../../config/prisma";

export const collaboratorsRepository = {
  listAll: () =>
  prisma.collaborator.findMany({
    select: {
      id: true, name: true, email: true, age: true, regime: true,
      role: true, createdAt: true, updatedAt: true,
      areas: { select: { area: { select: { name: true } } } },
    },
    orderBy: { name: "asc" },
  }),

  findById: (id: string) =>
    prisma.collaborator.findUnique({
      where: { id },
      include: { areas: { include: { area: true } } },
    }),

  findByEmail: (email: string) =>
    prisma.collaborator.findUnique({ where: { email } }),

  create: async (data: {
    name: string;
    email: string;
    passwordHash: string;
    age?: number;
    regime?: string;
    role?: "NORMAL" | "GESTOR";
    areaNames?: Array<
      "FRONTEND"|"BACKEND"|"INFRA"|"DESIGN"|"REQUISITOS"|"GESTAO"
    >;
  }) => {
    const connectAreas = data.areaNames?.map((n) => ({ name: n })) ?? [];
    const createData: any = {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      age: data.age === undefined ? null : data.age,
      regime: data.regime === undefined ? null : data.regime,
      role: data.role ?? "NORMAL",
    };
    if (connectAreas.length) {
      createData.areas = { create: connectAreas.map((n: any) => ({ area: { connect: n } })) };
    }
    return prisma.collaborator.create({
      data: createData,
      include: { areas: { include: { area: true } } },
    });
  },

  update: async (id: string, data: {
  name?: string;
  email?: string;
  passwordHash?: string;
  age?: number | null;
  regime?: string | null;
  role?: "NORMAL" | "GESTOR";
  areaNames?: ("FRONTEND"|"BACKEND"|"INFRA"|"DESIGN"|"REQUISITOS"|"GESTAO")[];
}) => {
    return prisma.$transaction(async (tx) => {
      if (data.areaNames) {
        const unique = Array.from(new Set(data.areaNames));
        await tx.collaboratorArea.deleteMany({ where: { collaboratorId: id } });

        const areas = await tx.area.findMany({ where: { name: { in: unique } } });
        await tx.collaboratorArea.createMany({
            data: areas.map(a => ({ collaboratorId: id, areaId: a.id })),
            skipDuplicates: true,
        });
        }
       const updateData: any = {};
        if ("name" in data) updateData.name = data.name;
        if ("email" in data) updateData.email = data.email;
        if ("passwordHash" in data) updateData.passwordHash = data.passwordHash;
        if ("age" in data) updateData.age = data.age;         // <- pode ser null
        if ("regime" in data) updateData.regime = data.regime; // <- pode ser null
        if ("role" in data) updateData.role = data.role;

        const updated = await tx.collaborator.update({
            where: { id },
            data: updateData,
            include: { areas: { include: { area: true } } },
        });
        return updated;
    });
    },

  delete: (id: string) => prisma.collaborator.delete({ where: { id } }),
};
