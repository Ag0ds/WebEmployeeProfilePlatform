"use client"
import Guard from "../../../../components/Guard"
import RequireGestor from "../../../../components/RequireGestor"
import api from "../../../../lib/api"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"

const Schema = z.object({
  name: z.string().min(2).optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
})
type Form = z.infer<typeof Schema>

export default function EditProjectPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [err, setErr] = useState<string | null>(null)

  const { data: p, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => (await api.get(`/projects/${id}`)).data as any,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(Schema) })

  useEffect(() => {
    if (!p) return
    setValue("name", p.name)
    if (p.deadline) setValue("deadline", String(p.deadline).slice(0, 10))
    setValue("description", p.description ?? "")
    setValue("technologies", (p.technologies ?? []).join(", "))
  }, [p, setValue])

  const onSubmit = async (f: Form) => {
    setErr(null)
    try {
      const payload: any = {}
      if (f.name) payload.name = f.name
      if (f.deadline) payload.deadline = new Date(f.deadline).toISOString()
      if (f.description !== undefined) payload.description = f.description || null
      if (f.technologies !== undefined)
        payload.technologies = f.technologies
          ? f.technologies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : []
      await api.put(`/projects/${id}`, payload)
      router.push(`/projects/${id}`)
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Guard>
        <RequireGestor>
          <main className="max-w-xl mx-auto p-6 space-y-6">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
              <h1 className="text-2xl font-bold text-white mb-2">Editar projeto</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
            </div>

            {isLoading && (
              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <p className="text-gray-300 animate-pulse">Carregando...</p>
              </div>
            )}

            {p && (
              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome do projeto</label>
                    <input
                      className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      placeholder="Nome do projeto"
                      {...register("name")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                    <input
                      className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      type="date"
                      {...register("deadline")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                    <textarea
                      className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-y min-h-[100px]"
                      placeholder="Descrição do projeto"
                      {...register("description")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tecnologias</label>
                    <input
                      className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      placeholder="React, Node.js, PostgreSQL (separadas por vírgula)"
                      {...register("technologies")}
                    />
                  </div>

                  {err && (
                    <div className="backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <p className="text-red-400 text-sm">{err}</p>
                    </div>
                  )}

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Salvando...
                      </div>
                    ) : (
                      "Salvar alterações"
                    )}
                  </button>
                </form>
              </div>
            )}
          </main>
        </RequireGestor>
      </Guard>
    </div>
  )
}
