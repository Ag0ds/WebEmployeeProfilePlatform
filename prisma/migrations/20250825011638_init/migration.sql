-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('NORMAL', 'GESTOR');

-- CreateEnum
CREATE TYPE "public"."AreaName" AS ENUM ('FRONTEND', 'BACKEND', 'INFRA', 'DESIGN', 'REQUISITOS', 'GESTAO');

-- CreateTable
CREATE TABLE "public"."Collaborator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "age" INTEGER,
    "regime" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Area" (
    "id" TEXT NOT NULL,
    "name" "public"."AreaName" NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CollaboratorArea" (
    "collaboratorId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "CollaboratorArea_pkey" PRIMARY KEY ("collaboratorId","areaId")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "description" TEXT,
    "technologies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectMember" (
    "collaboratorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("collaboratorId","projectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_email_key" ON "public"."Collaborator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Area_name_key" ON "public"."Area"("name");

-- AddForeignKey
ALTER TABLE "public"."CollaboratorArea" ADD CONSTRAINT "CollaboratorArea_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "public"."Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollaboratorArea" ADD CONSTRAINT "CollaboratorArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectMember" ADD CONSTRAINT "ProjectMember_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "public"."Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
