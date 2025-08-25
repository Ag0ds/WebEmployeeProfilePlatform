import { PrismaClient, AreaName, Role } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const areas: AreaName[] = [
    AreaName.FRONTEND,
    AreaName.BACKEND,
    AreaName.INFRA,
    AreaName.DESIGN,
    AreaName.REQUISITOS,
    AreaName.GESTAO,
  ];
  for (const name of areas) {
    await prisma.area.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  const gestor = await prisma.collaborator.upsert({
    where: { email: "gestor@empresa.com" },
    update: {},
    create: {
      name: "Gestor Inicial",
      email: "gestor@empresa.com",
      passwordHash,
      role: Role.GESTOR,
    },
  });

  const gestao = await prisma.area.findUnique({ where: { name: AreaName.GESTAO } });
  if (gestao) {
    await prisma.collaboratorArea.upsert({
      where: { collaboratorId_areaId: { collaboratorId: gestor.id, areaId: gestao.id } },
      update: {},
      create: { collaboratorId: gestor.id, areaId: gestao.id },
    });
  }

  console.log("Seed concluído ✔");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
