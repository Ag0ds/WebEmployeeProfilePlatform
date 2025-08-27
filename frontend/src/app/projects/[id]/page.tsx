"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";

import Guard from "@/components/Guard";
import RequireGestor from "@/components/RequireGestor";
import api from "@/lib/api";


type Member = {
  id: string;
  name: string;
  role: "NORMAL" | "GESTOR";
  areas: string[];
};

type Project = {
  id: string;
  name: string;
  deadline: string | null;
  description?: string | null;
  technologies: string[];
  members: Member[];
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [newMember, setNewMember] = useState("");

  const projectQ = useQuery({
    queryKey: ["project", id],
    queryFn: async () => (await api.get(`/projects/${id}`)).data as Project,
  });

  const collabsQ = useQuery({
    queryKey: ["collaborators-mini"],
    queryFn: async () => {
      const { data } = await api.get("/collaborators", {
        params: { page: 1, perPage: 100 },
      });
      return (data.items as Array<{ id: string; name: string }>).map((c) => ({
        id: c.id,
        name: c.name,
      }));
    },
  });

  const addMember = async () => {
  if (!newMember) return;
  try {
    await api.post(`/projects/${id}/members`, { collaboratorId: newMember });
    setNewMember("");
    await projectQ.refetch();
  } catch (e: any) {
    alert(e?.response?.data?.message ?? "Erro ao adicionar membro");
  }
};

  const removeMember = async (memberId: string) => {
    if (!confirm("Remover este membro do projeto?")) return;
    await api.delete(`/projects/${id}/members/${memberId}`);
    await projectQ.refetch();
  };

  return (
    <Guard>
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        {projectQ.isLoading && <p>Carregando...</p>}
        {projectQ.isError && <p>Erro ao carregar projeto.</p>}

        {projectQ.data && (
          <>
            <header className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{projectQ.data.name}</h1>
              <RequireGestor>
                <Link href={`/projects/${id}/edit`} className="underline">
                  editar projeto
                </Link>
              </RequireGestor>
            </header>

            <section className="space-y-1 text-sm text-gray-700">
              <div>
                <span className="font-medium">Deadline:</span>{" "}
                {projectQ.data.deadline ?? "-"}
              </div>
              {projectQ.data.description && (
                <div>
                  <span className="font-medium">Descrição:</span>{" "}
                  {projectQ.data.description}
                </div>
              )}
              <div>
                <span className="font-medium">Tecnologias:</span>{" "}
                {projectQ.data.technologies?.length
                  ? projectQ.data.technologies.join(", ")
                  : "-"}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-medium">Membros</h2>
              {projectQ.data.members?.length ? (
                <ul className="list-disc pl-6 space-y-1">
                  {projectQ.data.members.map((m) => (
                    <li key={m.id}>
                      {m.name} — {m.role} ({m.areas.join(", ")})
                      <RequireGestor>
                        <button
                          className="text-red-600 underline ml-2"
                          onClick={() => removeMember(m.id)}
                        >
                          remover
                        </button>
                      </RequireGestor>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">Sem membros.</p>
              )}

              <RequireGestor>
                <div className="border p-3 rounded-md space-y-2">
                  <div className="font-medium">Adicionar membro</div>
                  <div className="flex gap-2">
                    <select
                      className="border p-2"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      disabled={collabsQ.isLoading}
                    >
                      <option value="">-- selecione --</option>
                      {collabsQ.data?.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <button className="border px-3" onClick={addMember}>
                      Adicionar
                    </button>
                  </div>
                  {collabsQ.isError && (
                    <p className="text-sm text-red-600">
                      Erro ao carregar lista de colaboradores.
                    </p>
                  )}
                </div>
              </RequireGestor>
            </section>
          </>
        )}
      </main>
    </Guard>
  );
}
