import { prisma } from "../../config/prisma";

export const areasRepository = {
  listAll: () => prisma.area.findMany({ orderBy: { name: "asc" } }),
};
