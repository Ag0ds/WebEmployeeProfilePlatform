"use client"
import Guard from "../../components/Guard"
import api from "../../lib/api"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"
import RequireGestor from "../../components/RequireGestor"

type Row = {
  id: string
  name: string
  deadline?: string | null
  description?: string | null
  technologies: string[]
  members: Array<{ id: string; name: string; role: "NORMAL" | "GESTOR"; areas: string[] }>
}

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [perPage] = useState(5)
  const [q, setQ] = useState("")

  const query = useQuery({
    queryKey: ["projects", page, perPage, q],
    queryFn: async () => {
      const { data } = await api.get("/projects", { params: { page, perPage, q: q || undefined } })
      return data as { items: Row[]; page: number; perPage: number; total: number; totalPages: number }
    },
  })

  return (
    <Guard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
            <h1 className="text-2xl font-bold text-white">Projetos</h1>
            <RequireGestor>
              <Link
                href="/projects/new"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Novo
              </Link>
            </RequireGestor>
          </div>

          <div className="flex gap-3 p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
            <input
              className="flex-1 p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              placeholder="Buscar por nome"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              onClick={() => query.refetch()}
            >
              Buscar
            </button>
          </div>

          {query.isLoading && (
            <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 text-center">
              <p className="text-gray-300">Carregando...</p>
            </div>
          )}
          {query.error && (
            <div className="p-6 rounded-xl bg-red-900/20 backdrop-blur-sm border border-red-500/20 text-center">
              <p className="text-red-300">Erro ao carregar projetos</p>
            </div>
          )}

          <div className="space-y-4">
            {query.data?.items?.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 hover:border-white/20 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
                      {p.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Tecnologias:</span>
                        <div className="flex flex-wrap gap-1">
                          {p.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-md text-xs border border-blue-500/30"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Membros:</span>
                        <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded-md text-xs border border-green-500/30">
                          {p.members.length} {p.members.length === 1 ? "membro" : "membros"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                    href={`/projects/${p.id}`}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
            <button
              className="px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span className="text-gray-300 font-medium">
              Página {query.data?.page} de {query.data?.totalPages ?? "?"}
            </span>
            <button
              className="px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={page >= (query.data?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima →
            </button>
          </div>
        </main>
      </div>
    </Guard>
  )
}
