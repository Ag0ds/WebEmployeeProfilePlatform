"use client"
import Guard from "@/./components/Guard"
import RequireGestor from "@/./components/RequireGestor"
import api from "@/./lib/api"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"

const AreaNames = ["FRONTEND", "BACKEND", "INFRA", "DESIGN", "REQUISITOS", "GESTAO"] as const
const Schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  age: z.number().int().positive().nullable().optional(),
  regime: z.union([z.string(), z.null()]).optional(),
  role: z.enum(["NORMAL", "GESTOR"]).optional(),
  areaNames: z.array(z.enum(AreaNames)).optional(),
})
type Form = z.infer<typeof Schema>

export default function EditCollaboratorPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [err, setErr] = useState<string | null>(null)

  const { data: collab, isLoading } = useQuery({
    queryKey: ["collaborator", id],
    queryFn: async () => (await api.get(`/collaborators/${id}`)).data as any,
  })
  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => (await api.get("/areas")).data as Array<{ id: string; name: string }>,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(Schema) })

  useEffect(() => {
    if (!collab) return
    setValue("name", collab.name)
    setValue("email", collab.email)
    setValue("age", collab.age ?? null)
    setValue("regime", collab.regime ?? null)
    setValue("areaNames", collab.areas ?? [])
  }, [collab, setValue])

  const onSubmit = async (f: Form) => {
    setErr(null)
    try {
      await api.put(`/collaborators/${id}`, f)
      router.push("/collaborators")
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro")
    }
  }

  const names = areas?.map((a) => a.name) ?? AreaNames

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Guard>
        <RequireGestor>
          <main className="max-w-xl mx-auto p-6 space-y-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <h1 className="text-2xl font-semibold text-white mb-2">Editar colaborador</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
            </div>

            {isLoading && (
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-gray-300 animate-pulse">Carregando...</p>
              </div>
            )}

            {collab && (
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome"
                    {...register("name")}
                  />
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Email"
                    {...register("email")}
                  />
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    type="password"
                    placeholder="Nova senha (opcional)"
                    {...register("password")}
                  />
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Idade (ou deixe em branco)"
                    {...register("age")}
                  />
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Regime (ou deixe em branco)"
                    {...register("regime")}
                  />

                  <fieldset className="bg-white/5 border border-white/20 rounded-lg p-4">
                    <legend className="text-white font-medium px-2">Áreas</legend>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {names.map((n) => (
                        <label
                          key={n}
                          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={n}
                            {...register("areaNames")}
                            defaultChecked={collab.areas?.includes(n)}
                            className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm">{n}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {err && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                      <p className="text-red-300">{err}</p>
                    </div>
                  )}

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none backdrop-blur-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar"}
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
