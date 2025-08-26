import bcrypt from "bcryptjs";
import { env } from "../../config/env";
import { collaboratorsRepository } from "./repository";
import { serializeFor, serializeManyFor } from "./mappers/serializer";

type Role = "NORMAL" | "GESTOR";
type AreaName = "FRONTEND"|"BACKEND"|"INFRA"|"DESIGN"|"REQUISITOS"|"GESTAO";

export const collaboratorsService = {
  async list(viewerRole: "NORMAL" | "GESTOR", input: { page: number; perPage: number; q?: string }) {
  const { total, rows } = await collaboratorsRepository.listPaged(input.page, input.perPage, input.q);
  const items = serializeManyFor(viewerRole, rows as any);
  return {
    items,
    page: input.page,
    perPage: input.perPage,
    total,
    totalPages: Math.ceil(total / input.perPage),
  };
},

  async get(viewerRole: Role, id: string) {
    const c = await collaboratorsRepository.findById(id);
    if (!c) throw Object.assign(new Error("Not found"), { statusCode: 404 });
    return serializeFor(viewerRole, c as any);
  },

  async create(input: {
    name: string;
    email: string;
    password: string;
    age?: number;
    regime?: string;
    areaNames?: AreaName[];
  }) {
    const exists = await collaboratorsRepository.findByEmail(input.email);
    if (exists) throw Object.assign(new Error("Email already in use"), { statusCode: 409 });

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
    const createData: {
      name: string;
      email: string;
      passwordHash: string;
      age?: number;
      regime?: string;
      areaNames?: AreaName[];
    } = {
      name: input.name,
      email: input.email,
      passwordHash,
    };
    if (input.age !== undefined) createData.age = input.age;
    if (input.regime !== undefined) createData.regime = input.regime;
    if (input.areaNames !== undefined) createData.areaNames = input.areaNames;

    const created = await collaboratorsRepository.create(createData);
    return serializeFor("GESTOR", created as any);
  },

  async update(id: string, input: {
    name?: string;
    email?: string;
    password?: string;
    age?: number;
    regime?: string;
    role?: Role;
    areaNames?: AreaName[];
  }) {
    const patch: any = { ...input };
    if (input.password) {
      patch.passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
      delete patch.password;
    }
    const updated = await collaboratorsRepository.update(id, patch);
    return serializeFor("GESTOR", updated as any);
  },

  async remove(id: string) {
    await collaboratorsRepository.delete(id);
  },
};
