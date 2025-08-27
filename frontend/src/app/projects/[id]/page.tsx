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

  const projectQ = useQuery<Project, Error>({
    queryKey: ["project", id],
    queryFn: async () => (await api.get(`/projects/${id}`)).data as Project,
  });

  const collabsQ = useQuery<{ id: string; name: string }[], Error>({
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Guard>
        <main className="max-w-3xl mx-auto p-6 space-y-6">
          {projectQ.isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="ml-3 text-gray-300">Carregando...</p>
            </div>
          )}
          {projectQ.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400">Erro ao carregar projeto.</p>
            </div>
          )}

          {projectQ.data && (
            <>
              <header className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-semibold text-white">{projectQ.data.name}</h1>
                  <StatusBadge s={projectQ.data.status} />
                </div>
                <RequireGestor>
                  <div className="flex items-center gap-3">
                    {projectQ.data.status === "ACTIVE" ? (
                      <>
                        <button
                          className="text-emerald-400 hover:text-emerald-300 underline transition-colors duration-200"
                          onClick={complete}
                        >
                          Concluir
                        </button>
                        <button
                          className="text-yellow-400 hover:text-yellow-300 underline transition-colors duration-200"
                          onClick={cancel}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                        onClick={reopen}
                      >
                        Reabrir
                      </button>
                    )}
                    <Link
                      href={`/projects/${id}/edit`}
                      className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                    >
                      Editar
                    </Link>
                    <button
                      className="text-red-400 hover:text-red-300 underline transition-colors duration-200"
                      onClick={deleteProject}
                    >
                      Excluir
                    </button>
                  </div>
                </RequireGestor>
              </header>

              <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-3">
                <div className="text-gray-300">
                  <span className="font-medium text-white">Deadline:</span> {projectQ.data.deadline ?? "-"}
                </div>
                {projectQ.data.description && (
                  <div className="text-gray-300">
                    <span className="font-medium text-white">Descrição:</span> {projectQ.data.description}
                  </div>
                )}
                <div className="text-gray-300">
                  <span className="font-medium text-white">Tecnologias:</span>{" "}
                  {projectQ.data.technologies?.length ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {projectQ.data.technologies.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md text-xs backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </div>
                {projectQ.data.status !== "ACTIVE" && projectQ.data.completedAt && (
                  <div className="text-xs text-gray-500 pt-2 border-t border-white/10">
                    Atualizado: {new Date(projectQ.data.completedAt).toLocaleString()}
                  </div>
                )}
              </section>

              <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-medium text-white">Membros</h2>
                {projectQ.data.members?.length ? (
                  <div className="space-y-3">
                    {projectQ.data.members.map((m: Member) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="text-gray-300">
                          <span className="text-white font-medium">{m.name}</span>
                          <span className="mx-2">—</span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              m.role === "GESTOR"
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                            }`}
                          >
                            {m.role}
                          </span>
                          <span className="ml-2 text-sm">({m.areas.join(", ")})</span>
                        </div>
                        <RequireGestor>
                          <button
                            className="text-red-400 hover:text-red-300 underline transition-colors duration-200"
                            onClick={() => removeMember(m.id)}
                          >
                            remover
                          </button>
                        </RequireGestor>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Sem membros.</p>
                )}

                <RequireGestor>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                    <div className="font-medium text-white">Adicionar membro</div>
                    <div className="flex gap-3">
                      <select
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        disabled={collabsQ.isLoading}
                      >
                        <option value="" className="bg-gray-800">
                          -- selecione --
                        </option>
                        {collabsQ.data?.map((c: { id: string; name: string }) => (
                          <option key={c.id} value={c.id} className="bg-gray-800">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                        onClick={addMember}
                      >
                        Adicionar
                      </button>
                    </div>
                    {collabsQ.isError && <p className="text-sm text-red-400">Erro ao carregar lista de colaboradores.</p>}
                  </div>
                </RequireGestor>
              </section>
            </>
          )}
        </main>
      </Guard>
    </div>
  )
}
