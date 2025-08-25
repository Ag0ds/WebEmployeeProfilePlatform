import { prisma } from "../../config/prisma";

const projectSelect = {
  id: true, name: true, deadline: true, description: true, technologies: true,
  createdAt: true, updatedAt: true,
  members: {
    select: {
      collaborator: {
        select: {
          id: true, name: true, role: true,
          areas: { select: { area: { select: { name: true } } } },
        },
      },
    },
  },
} as const;

export const projectsRepository = {
  listAll: () =>
    prisma.project.findMany({
      select: projectSelect,
      orderBy: { createdAt: "desc" },
    }),

  findById: (id: string) =>
    prisma.project.findUnique({
      where: { id },
      select: projectSelect,
    }),

  create: async (data: {
    name: string;
    deadline?: Date;
    description?: string | null;
    technologies?: string[];
    memberIds?: string[];
  }) => {
    // cria projeto
    const created = await prisma.project.create({
      data: {
        name: data.name,
        ...(data.deadline !== undefined ? { deadline: data.deadline } : {}),
        description: data.description ?? null,
        technologies: data.technologies ?? [],
      },
      select: projectSelect,
    });
    // adiciona membros (se enviados)
    if (data.memberIds?.length) {
      const unique = Array.from(new Set(data.memberIds));
      await prisma.projectMember.createMany({
        data: unique.map((cid) => ({ projectId: created.id, collaboratorId: cid })),
        skipDuplicates: true,
      });
    }
    // retorna com membros já populados
    return prisma.project.findUniqueOrThrow({
      where: { id: created.id },
      select: projectSelect,
    });
  },

  updateFields: (id: string, data: {
    name?: string; deadline?: Date; description?: string | null; technologies?: string[];
  }) =>
    prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.deadline !== undefined ? { deadline: data.deadline } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.technologies !== undefined ? { technologies: data.technologies } : {}),
      },
      select: projectSelect,
    }),

  addMember: async (projectId: string, collaboratorId: string) => {
    await prisma.projectMember.create({
      data: { projectId, collaboratorId },
    }).catch((e: any) => {
      if (e.code === "P2002" || e.code === "P2003") return; // já existe ou FK inválida
      throw e;
    });
    return prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: projectSelect,
    });
  },

  removeMember: async (projectId: string, collaboratorId: string) => {
    await prisma.projectMember.delete({
      where: { collaboratorId_projectId: { collaboratorId, projectId } as any },
    }).catch((e: any) => {
      if (e.code === "P2025") return; // não existia
      throw e;
    });
    return prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: projectSelect,
    });
  },

  // ajuda a checar composição
  getMembersAreasByProject: async (projectId: string) => {
    const rows = await prisma.projectMember.findMany({
      where: { projectId },
      select: {
        collaborator: {
          select: {
            areas: { select: { area: { select: { name: true } } } },
          },
        },
      },
    });
    return rows.flatMap((r) => r.collaborator.areas.map((a) => a.area.name));
  },

  getAreasForCollaborators: async (ids: string[]) => {
    const rows = await prisma.collaborator.findMany({
      where: { id: { in: ids } },
      select: { areas: { select: { area: { select: { name: true } } } } },
    });
    return rows.flatMap((r) => r.areas.map((a) => a.area.name));
  },
};
