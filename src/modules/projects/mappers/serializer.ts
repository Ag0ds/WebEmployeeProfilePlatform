type Member = {
  collaborator: {
    id: string;
    name: string;
    role: "NORMAL" | "GESTOR";
    areas: Array<{ area: { name: string } }>;
  };
};

type ProjectModel = {
  id: string;
  name: string;
  deadline?: Date | null;
  description?: string | null;
  technologies: string[];
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
};

export function serializeProject(p: ProjectModel) {
  return {
    id: p.id,
    name: p.name,
    deadline: p.deadline ?? null,
    description: p.description ?? null,
    technologies: p.technologies ?? [],
    members: p.members.map((m) => ({
      id: m.collaborator.id,
      name: m.collaborator.name,
      role: m.collaborator.role,
      areas: m.collaborator.areas.map((a) => a.area.name),
    })),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function serializeManyProjects(items: ProjectModel[]) {
  return items.map(serializeProject);
}
