"use client"
import Guard from "../../components/Guard"
import api from "../../lib/api"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../../stores/auth"
import { useState } from "react"
import Link from "next/link"
import RequireGestor from "@/./components/RequireGestor"

type Item = {
  id: string
  name: string
  email: string
  age?: number | null
  role: "NORMAL" | "GESTOR"
  areas: string[]
  regime?: string | null
}

export default function CollaboratorsPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [perPage] = useState(5)
  const [q, setQ] = useState("")

  const qkey = ["collaborators", page, perPage, q]
  const query = useQuery({
    queryKey: qkey,
    queryFn: async () => {
      const { data } = await api.get("/collaborators", { params: { page, perPage, q: q || undefined } })
      return data as { items: Item[]; page: number; perPage: number; total: number; totalPages: number }
    },
  })

  return (
    <Guard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Colaboradores</h1>
            <RequireGestor>
              <Link
                href="/collaborators/new"
                className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-all duration-300"
              >
                Novo
              </Link>
            </RequireGestor>
          </div>

          <div className="flex gap-3">
            <input
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 text-white placeholder-gray-400 p-3 flex-1 rounded-lg focus:border-blue-500/50 focus:outline-none transition-all duration-300"
              placeholder="Buscar por nome/email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-all duration-300"
              onClick={() => query.refetch()}
            >
              Buscar
            </button>
          </div>

          {query.isLoading && <p className="text-gray-300">Carregando...</p>}
          {query.error && <p className="text-red-400">Erro</p>}

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-600/30">
                  <th className="p-4 text-left text-gray-200 font-semibold">Nome</th>
                  <th className="p-4 text-left text-gray-200 font-semibold">Email</th>
                  <th className="p-4 text-left text-gray-200 font-semibold">Role</th>
                  <th className="p-4 text-left text-gray-200 font-semibold">Áreas</th>
                  {user?.role === "GESTOR" && <th className="p-4 text-left text-gray-200 font-semibold">Regime</th>}
                  {user?.role === "GESTOR" && <th className="p-4 text-left text-gray-200 font-semibold">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {query.data?.items?.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-600/20 hover:bg-gray-700/20 transition-colors duration-200"
                  >
                    <td className="p-4 text-gray-300">{c.name}</td>
                    <td className="p-4 text-gray-300">{c.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.role === "GESTOR"
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                            : "bg-gray-600/20 text-gray-300 border border-gray-500/30"
                        }`}
                      >
                        {c.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{c.areas.join(", ")}</td>
                    {user?.role === "GESTOR" && <td className="p-4 text-gray-300">{c.regime ?? "-"}</td>}
                    {user?.role === "GESTOR" && (
                      <td className="p-4 space-x-3">
                        <Link
                          className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"
                          href={`/collaborators/${c.id}/edit`}
                        >
                          Editar
                        </Link>
                        <button
                          className="text-red-400 hover:text-red-300 underline transition-colors duration-200"
                          onClick={async () => {
                            if (!confirm("Excluir colaborador?")) return
                            try {
                              await api.delete(`/collaborators/${c.id}`)
                              query.refetch()
                            } catch (e: any) {
                              alert(e?.response?.data?.message ?? "Erro ao excluir")
                            }
                          }}
                        >
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 text-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ←
            </button>
            <span className="text-gray-300 font-medium">
              página {query.data?.page} / {query.data?.totalPages ?? "?"}
            </span>
            <button
              className="bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 text-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50 transition-all duration-300"
              disabled={page >= (query.data?.totalPages ?? 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        </main>
      </div>
    </Guard>
  )
}
