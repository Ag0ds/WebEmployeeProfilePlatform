"use client"
import Guard from "../../../components/Guard"
import RequireGestor from "../../../components/RequireGestor"
import api from "../../../lib/api"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"

const Schema = z.object({
  name: z.string().min(2),
  deadline: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
})
type Form = z.infer<typeof Schema>

export default function NewProjectPage() {
  const router = useRouter()
  const [err, setErr] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(Schema) })

  const onSubmit = async (f: Form) => {
    setErr(null)
    try {
      const payload: any = {
        name: f.name,
        description: f.description || null,
        technologies: f.technologies
          ? f.technologies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      }
      if (f.deadline) payload.deadline = new Date(f.deadline).toISOString()
      const { data } = await api.post("/projects", payload)
      router.push(`/projects/${data.id}`)
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Guard>
        <RequireGestor>
          <main className="max-w-xl mx-auto p-6 space-y-6">
            <div className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Novo Projeto
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Nome do Projeto</label>
                  <input
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                    placeholder="Digite o nome do projeto"
                    {...register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Deadline</label>
                  <input
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                    type="date"
                    {...register("deadline")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Descrição</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200 min-h-[100px] resize-none"
                    placeholder="Descreva o projeto..."
                    {...register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Tecnologias</label>
                  <input
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
                    placeholder="Ex: React, Node.js, PostgreSQL (separado por vírgulas)"
                    {...register("technologies")}
                  />
                </div>

                {err && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{err}</p>
                  </div>
                )}

                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Criar Projeto"}
                </button>
              </form>
            </div>
          </main>
        </RequireGestor>
      </Guard>
    </div>
  )
}
