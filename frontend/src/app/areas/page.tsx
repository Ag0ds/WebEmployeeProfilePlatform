"use client"

import Guard from "../../components/Guard"
import api from "../../lib/api"
import { useQuery } from "@tanstack/react-query"

export default function AreasPage() {
  const q = useQuery({
    queryKey: ["areas"],
    queryFn: async () => (await api.get("/areas")).data as Array<{ id: string; name: string }>,
  })

  return (
    <Guard>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <main className="max-w-3xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Áreas</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>

          {q.isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="ml-3 text-white/70">Carregando...</p>
            </div>
          )}

          {q.error && (
            <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-red-400">Erro ao carregar áreas</p>
            </div>
          )}

          {q.data && (
            <div className="space-y-3">
              {q.data.map((a) => (
                <div
                  key={a.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-white font-medium group-hover:text-blue-300 transition-colors duration-300">
                      {a.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Guard>
  )
}
