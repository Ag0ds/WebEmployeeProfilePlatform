"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
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
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  completedAt?: string | null;
  members: Member[];
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [newMember, setNewMember] = useState("");

  const projectQ = useQuery({
    queryKey: ["project", id],
    queryFn: async () => (await api.get(`/projects/${id}`)).data as Project,
  });

  const collabsQ = useQuery({
    queryKey: ["collaborators-mini"],
    queryFn: async () => {
      const { data } = await api.get("/collaborators", { params: { page: 1, perPage: 100 } });
      return (data.items as Array<{ id: string; name: string }>).map((c) => ({ id: c.id, name: c.name }));
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
    try {
      await api.delete(`/projects/${id}/members/${memberId}`);
      await projectQ.refetch();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao remover");
    }
  };

  const complete = async () => {
    try {
      await api.post(`/projects/${id}/complete`);
      await projectQ.refetch();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao concluir");
    }
  };

  const cancel = async () => {
    try {
      await api.post(`/projects/${id}/cancel`);
      await projectQ.refetch();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao cancelar");
    }
  };

  const reopen = async () => {
    try {
      await api.post(`/projects/${id}/reopen`);
      await projectQ.refetch();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao reabrir");
    }
  };

  const deleteProject = async () => {
    if (!confirm("Excluir projeto definitivamente?")) return;
    try {
      await api.delete(`/projects/${id}`);
      router.push("/projects");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Erro ao excluir");
    }
  };

  const StatusBadge = ({ s }: { s: Project["status"] }) => {
    const cls =
      s === "ACTIVE"
        ? "bg-emerald-100 text-emerald-700"
        : s === "COMPLETED"
        ? "bg-blue-100 text-blue-700"
        : "bg-gray-200 text-gray-700";
    return <span className={`px-2 py-0.5 rounded text-xs ${cls}`}>{s}</span>;
  };

  return (
    <Guard>
      <main className="max-w-3xl mx-auto p-6 space-y-6">
        {projectQ.isLoading && <p>Carregando...</p>}
        {projectQ.isError && <p>Erro ao carregar projeto.</p>}

        {projectQ.data && (
          <>
            {/* Cabeçalho */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{projectQ.data.name}</h1>
                <StatusBadge s={projectQ.data.status} />
              </div>
              <RequireGestor>
                <div className="flex items-center gap-3">
                  {projectQ.data.status === "ACTIVE" ? (
                    <>
                      <button className="underline" onClick={complete}>Concluir</button>
                      <button className="underline" onClick={cancel}>Cancelar</button>
                    </>
                  ) : (
                    <button className="underline" onClick={reopen}>Reabrir</button>
                  )}
                  <Link href={`/projects/${id}/edit`} className="underline">Editar</Link>
                  <button className="text-red-600 underline" onClick={deleteProject}>Excluir</button>
                </div>
              </RequireGestor>
            </header>

            {/* Metadados */}
            <section className="space-y-1 text-sm text-gray-700">
              <div>
                <span className="font-medium">Deadline:</span> {projectQ.data.deadline ?? "-"}
              </div>
              {projectQ.data.description && (
                <div>
                  <span className="font-medium">Descrição:</span> {projectQ.data.description}
                </div>
              )}
              <div>
                <span className="font-medium">Tecnologias:</span>{" "}
                {projectQ.data.technologies?.length ? projectQ.data.technologies.join(", ") : "-"}
              </div>
              {projectQ.data.status !== "ACTIVE" && projectQ.data.completedAt && (
                <div className="text-xs text-gray-500">
                  Atualizado: {new Date(projectQ.data.completedAt).toLocaleString()}
                </div>
              )}
            </section>

            {/* Membros */}
            <section className="space-y-3">
              <h2 className="text-lg font-medium">Membros</h2>
              {projectQ.data.members?.length ? (
                <ul className="list-disc pl-6 space-y-1">
                  {projectQ.data.members.map((m) => (
                    <li key={m.id}>
                      {m.name} — {m.role} ({m.areas.join(", ")})
                      <RequireGestor>
                        <button className="text-red-600 underline ml-2" onClick={() => removeMember(m.id)}>
                          remover
                        </button>
                      </RequireGestor>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">Sem membros.</p>
              )}

              {/* Adicionar membro (somente gestor) */}
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
                    <p className="text-sm text-red-600">Erro ao carregar lista de colaboradores.</p>
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
