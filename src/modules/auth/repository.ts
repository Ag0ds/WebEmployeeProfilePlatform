import { prisma } from "../../config/prisma";

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.collaborator.findUnique({ where: { email } }),

  createCollaborator: (data: {
    name: string;
    email: string;
    passwordHash: string;
    age?: number;
  }) =>
    prisma.collaborator.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        age: data.age === undefined ? null : data.age,
        role: "NORMAL",
      },
    }),
};
