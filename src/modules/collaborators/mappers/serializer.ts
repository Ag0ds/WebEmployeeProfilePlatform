type Role = "NORMAL" | "GESTOR";

type CollabWithAreas = {
  id: string;
  name: string;
  email: string;
  age?: number | null;
  regime?: string | null;
  role: Role;
  createdAt: string | Date;
  updatedAt: string | Date;
  areas: Array<{ area: { name: string } }>;
};

function base(c: CollabWithAreas) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    age: c.age ?? null,
    role: c.role,
    areas: c.areas.map((a) => a.area.name),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export function serializeFor(viewerRole: Role, c: CollabWithAreas) {
  const data = base(c);
  if (viewerRole === "GESTOR") {
    return { ...data, regime: c.regime ?? null };
  }
  return data;
}

export function serializeManyFor(viewerRole: Role, list: CollabWithAreas[]) {
  return list.map((c) => serializeFor(viewerRole, c));
}
