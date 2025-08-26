import { projectsRepository } from "./repository";
import { serializeManyProjects, serializeProject } from "./mappers/serializer";

function hasMinComposition(areaNames: string[]) {
  const set = new Set(areaNames);
  return set.has("GESTAO") && set.has("BACKEND") && set.has("FRONTEND");
}

export const projectsService = {
  async list(input?: { page: number; perPage: number; q?: string }) {
  const page = input?.page ?? 1;
  const perPage = input?.perPage ?? 10;
  const { total, rows } = await projectsRepository.listPaged(page, perPage, input?.q);
  return {
    items: serializeManyProjects(rows as any),
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
},

  async get(id: string) {
    const p = await projectsRepository.findById(id);
    if (!p) throw Object.assign(new Error("Not found"), { statusCode: 404 });
    return serializeProject(p as any);
  },

  async create(input: {
    name: string;
    deadline?: Date;
    description?: string | null;
    technologies?: string[];
    memberIds?: string[];
  }) {
    if (input.memberIds?.length) {
      const areas = await projectsRepository.getAreasForCollaborators(input.memberIds);
      if (!hasMinComposition(areas)) {
        throw Object.assign(new Error("Project must include at least one of each: GESTAO, BACKEND, FRONTEND"), { statusCode: 400 });
      }
    }
    const created = await projectsRepository.create(input);
    return serializeProject(created as any);
  },

  async update(id: string, input: {
    name?: string; deadline?: Date; description?: string | null; technologies?: string[];
  }) {
    const updated = await projectsRepository.updateFields(id, input);
    return serializeProject(updated as any);
  },

  async addMember(id: string, collaboratorId: string) {
    await projectsRepository.addMember(id, collaboratorId);
    const areas = await projectsRepository.getMembersAreasByProject(id);
    if (!hasMinComposition(areas)) {
      await projectsRepository.removeMember(id, collaboratorId);
      throw Object.assign(new Error("Project must include at least one of each: GESTAO, BACKEND, FRONTEND"), { statusCode: 400 });
    }
    const p = await projectsRepository.findById(id);
    return serializeProject(p as any);
  },

  async removeMember(id: string, collaboratorId: string) {
    await projectsRepository.removeMember(id, collaboratorId);
    const areas = await projectsRepository.getMembersAreasByProject(id);
    if (!hasMinComposition(areas) && areas.length) {
      await projectsRepository.addMember(id, collaboratorId);
      throw Object.assign(new Error("Project must include at least one of each: GESTAO, BACKEND, FRONTEND"), { statusCode: 400 });
    }
    const p = await projectsRepository.findById(id);
    return serializeProject(p as any);
  },
};
